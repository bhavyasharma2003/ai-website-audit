const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Audit = require("../models/Audit");
const { crawlPage } = require("../services/crawler");
const { runLighthouse } = require("../services/lighthouseRunner");
const { generateSummary } = require("../services/ai");
const { generatePdf } = require("../services/pdfGenerator");

// GET /audit - list recent audits for dashboard
router.get("/", async (req, res) => {
  try {
    const audits = await Audit.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ audits });
  } catch (err) {
    console.error("❌ Error listing audits:", err);
    return res.status(500).json({ error: "Failed to list audits" });
  }
});

// GET /audit/:id - single audit detail for dashboard
router.get("/:id", async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id).lean();
    if (!audit) {
      return res.status(404).json({ error: "Audit not found" });
    }
    return res.json({ audit });
  } catch (err) {
    console.error("❌ Error fetching audit detail:", err);
    return res.status(500).json({ error: "Failed to fetch audit detail" });
  }
});

// GET /audit/:id/pdf - stream PDF file if exists
router.get("/:id/pdf", async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id).lean();
    if (!audit || !audit.pdfPath) {
      return res.status(404).json({ error: "PDF not found for this audit" });
    }

    const pdfPath = path.resolve(audit.pdfPath);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: "PDF file not found on disk" });
    }

    return res.sendFile(pdfPath);
  } catch (err) {
    console.error("❌ Error sending audit PDF:", err);
    return res.status(500).json({ error: "Failed to send PDF" });
  }
});

router.post("/", async (req, res) => {
  console.log("🔔 Received /audit request with body:", req.body);

  // Normalize URL to avoid trailing punctuation causing cert errors
  const urlInput = req.body && req.body.url;
  const url = urlInput ? urlInput.trim().replace(/[.,;:)\]]+$/, "") : urlInput;
  if (!url || !/^https?:\/\//i.test(url)) {
    console.log("❌ Invalid or missing URL:", url);
    return res.status(400).json({ error: "Invalid or missing URL" });
  }

  try {
    // Update status to running
    let audit = new Audit({
      url,
      status: "running",
    });
    audit = await audit.save();
    console.log("📝 Created audit record:", audit._id);

    // Crawl the page with Puppeteer
    console.log("🕷️  Starting Puppeteer crawl for:", url);
    let crawlData;
    try {
      crawlData = await crawlPage(url);
      console.log("✅ Crawl completed:");
      console.log("   - Title:", crawlData.title);
      console.log("   - Meta Description:", crawlData.metaDescription?.substring(0, 50) + "...");
      console.log("   - H1 Headings:", crawlData.h1Headings?.length || 0);
    } catch (crawlError) {
      console.error("❌ Crawl error:", crawlError.message);
      audit.status = "failed";
      audit.errorMessage = `Crawl failed: ${crawlError.message}`;
      await audit.save();
      return res.status(500).json({ 
        error: "Failed to crawl website", 
        details: crawlError.message 
      });
    }

    // Run real Lighthouse to get scores
    console.log("🚦 Running Lighthouse audit...");
    let lighthouseResult;
    try {
      lighthouseResult = await runLighthouse(url);
      console.log("✅ Lighthouse completed with scores:", lighthouseResult.scores);
    } catch (lhError) {
      console.error("❌ Lighthouse error:", lhError.message);
      audit.status = "failed";
      audit.errorMessage = `Lighthouse failed: ${lhError.message}`;
      await audit.save();
      return res.status(500).json({
        error: "Failed to run Lighthouse",
        details: lhError.message,
      });
    }

    // Generate real AI summary; fall back gracefully if OpenAI fails
    let aiSummary;
    try {
      aiSummary = await generateSummary({
        url,
        scores: lighthouseResult.scores,
        crawlData,
      });
      console.log("🤖 AI summary generated");
    } catch (aiError) {
      console.error("❌ AI summary error:", aiError.message);
      aiSummary = {
        summary:
          "AI summary unavailable due to OpenAI error. Please check API key, billing, or retry later.",
        keyFindings: [
          "OpenAI request failed or quota exceeded.",
          aiError.message,
        ],
        recommendations: [
          "Verify OPENAI_API_KEY and billing status.",
          "Retry the audit later or reduce frequency.",
        ],
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        createdAt: new Date(),
      };
      audit.errorMessage = `AI summary failed: ${aiError.message}`;
    }

    // Update audit with crawled data + real Lighthouse scores + AI summary
    audit.status = "completed";
    audit.html = crawlData.html;
    audit.lighthouse = {
      scores: lighthouseResult.scores,
      report: lighthouseResult.report,
      fetchedAt: lighthouseResult.fetchedAt,
    };
    audit.aiSummary = aiSummary;
    audit.pdfPath = null;

    // Generate PDF report and update audit
    let pdfPath = null;
    try {
      pdfPath = await generatePdf({
        ...audit.toObject(),
        crawlData,
      });
      audit.pdfPath = pdfPath;
    } catch (pdfError) {
      console.error("❌ PDF generation error:", pdfError.message);
      audit.errorMessage = audit.errorMessage
        ? `${audit.errorMessage}; PDF error: ${pdfError.message}`
        : `PDF error: ${pdfError.message}`;
    }

    const savedAudit = await audit.save();
    console.log("✅ Audit saved to MongoDB:", savedAudit._id);
    console.log("   - HTML length:", savedAudit.html?.length || 0, "characters");
    if (pdfPath) {
      console.log("   - PDF saved at:", pdfPath);
    }

    // Return the saved document with extracted data
    return res.json({
      audit: savedAudit,
      crawlData: {
        title: crawlData.title,
        metaDescription: crawlData.metaDescription,
        h1Headings: crawlData.h1Headings,
      },
      pdf: pdfPath,
    });
  } catch (error) {
    console.error("❌ Error in audit process:", error);
    return res.status(500).json({ error: "Failed to process audit", details: error.message });
  }
});

module.exports = router;

