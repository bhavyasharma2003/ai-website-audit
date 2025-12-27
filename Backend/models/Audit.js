const mongoose = require('mongoose');

const LighthouseSchema = new mongoose.Schema(
  {
    scores: {
      performance: Number,
      accessibility: Number,
      bestPractices: Number,
      seo: Number
    },
    report: mongoose.Schema.Types.Mixed,
    fetchedAt: Date
  },
  { _id: false }
);

const AiSummarySchema = new mongoose.Schema(
  {
    summary: String,
    keyFindings: [String],
    recommendations: [String],
    model: String,
    createdAt: Date
  },
  { _id: false }
);

const AuditSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    status: {
      type: String,
      enum: ['queued', 'running', 'completed', 'failed'],
      default: 'queued'
    },
    html: String,
    lighthouse: LighthouseSchema,
    aiSummary: AiSummarySchema,
    pdfPath: String,
    errorMessage: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Audit', AuditSchema);

