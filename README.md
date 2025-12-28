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


---

## ⚙️ Installation & Setup

```
1️⃣ Clone the repository
```bash
git clone https://github.com/bhavyasharma2003/ai-website-audit.git
cd ai-website-audit

2️⃣ Install dependencies
bash
Copy code
npm install

3️⃣ Configure environment variables
Create a file named env in the root directory (do NOT commit this file):

env
Copy code
PORT=4000
MONGO_URI=mongodb://localhost:27017/web_audits
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.2
⚠️ env is ignored via .gitignore for security reasons.


4️⃣ Start MongoDB
bash
Copy code
mongod
(or ensure MongoDB service is running)


5️⃣ Start backend server
bash
Copy code
npm run backend
Backend will start at:

http://localhost:4000

▶️ Running an Audit (CLI)
bash
Copy code
node Cli/audit.js --url https://example.com

Sample Output:
yaml
Copy code
Performance: 100
Accessibility: 100
SEO: 82
Best Practices: 93
PDF generated successfully

---
```
🌐 Web Dashboard
Open dashboard/index.html in browser

View all audits

Click on an audit to see details



Download PDF report

📌 Dashboard consumes backend APIs running locally.


## 📄 PDF Report
Each audit generates a professional PDF report containing:

Website details

Lighthouse scores

AI summary

Actionable recommendations

PDFs are stored locally and accessible via dashboard.


---


## 🔐 Security Practices
API keys stored only in local env file

.gitignore prevents secrets from being pushed

GitHub push protection handled properly

API keys rotated after detection (best practice)


---

## ⚠️ Limitations
Some websites block automated crawling

Lighthouse audits are time-consuming (30–60 sec)

OpenAI summaries require active billing

Backend not deployed online due to browser automation constraints


---

## 🔮 Future Enhancements
Online deployment using containerized Chrome

User authentication

Scheduled audits

Data visualization & charts

Multi-website comparison


---

## 🎓 Academic Note
This project was developed as part of an academic submission and demonstrates:

Full-stack development

Automation

AI integration

Secure version control

Professional engineering practices


---

## 👨‍💻 Author
Bhavya Sharma
GitHub: https://github.com/bhavyasharma2003

---

## ⭐ Acknowledgements
Google Lighthouse

OpenAI

Puppeteer

MongoDB Documentation

yaml
Copy code

---


## ✅ WHY THIS README IS PERFECT

✔ Clean  
✔ Professional  
✔ Secure  
✔ Viva-ready  
✔ Recruiter-friendly  
✔ Matches your actual implementation  

---

