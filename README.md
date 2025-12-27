# 🚀 AI-Powered Website Audit Tool

An AI-powered full-stack system that automatically audits websites for **performance, SEO, accessibility, and best practices** using modern web technologies.  
The tool generates **Lighthouse-based scores**, **AI-driven recommendations**, and a **downloadable PDF report**.

---

## 📌 Features

- 🔍 Website crawling using Puppeteer
- 📊 Performance analysis using Google Lighthouse
- 🧠 AI-generated summary & recommendations (OpenAI)
- 🗄️ MongoDB-based audit history
- 📄 Automatic PDF audit report generation
- 🖥️ Command Line Interface (CLI)
- 🌐 Web dashboard for viewing audits
- 🔐 Secure environment variable handling

---

## 🛠️ Tec

CLI / Dashboard
|
v
Express Backend (Node.js)
|
|-- Puppeteer (Crawl website)
|-- Lighthouse (Performance audit)
|-- OpenAI API (AI insights)
|
MongoDB (Store audit data)
|
PDF Generator (Audit Report)




---

## 📂 Project Structure

ai-website-audit/
│
├── Backend/
│ ├── routes/
│ ├── services/
│ ├── models/
│ ├── storage/
│ └── server.js


│
├── Cli/
│ └── audit.js
│
├── dashboard/
│ ├── index.html
│ ├── detail.html
│ └── style.css
│
├── env.example
├── .gitignore
├── package.json
└── README.md



