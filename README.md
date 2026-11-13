# 🚨 On-Call Incident Agent

### AI-Powered DevOps Incident Response & Diagnosis Platform

An intelligent incident response platform designed to help DevOps and SRE engineers identify incidents, investigate possible root causes, and recommend solutions while keeping human approval in control.

---

## 📌 Project Overview

In modern applications, unexpected failures such as server crashes, high CPU usage, database connection failures, and API timeouts can affect system availability.

Engineers often spend valuable time manually investigating logs and identifying possible root causes.

**On-Call Incident Agent** aims to simplify this process through an automated incident investigation workflow.

The system allows users to trigger simulated incidents, investigate them, view possible diagnoses, and review proposed remediation steps.

Human approval is required before any remediation is executed.

---

## ✨ Key Features

- 🚨 Incident Triggering – Generate simulated infrastructure incidents.
- 🔍 Incident Investigation – Retrieve incident information and associated logs.
- 🧠 AI Diagnosis Workflow – Generate possible causes and recommended investigation steps.
- 🛡️ Human-in-the-Loop Safety – Require human approval before remediation.
- 📊 Incident Dashboard – Monitor active incidents and diagnosis status.
- ⚡ FastAPI Backend – REST API for incident management.
- 💻 React Frontend – Interactive dashboard.

---

## 🏗️ System Architecture

```text
        USER / DEVOPS ENGINEER
                 |
                 ▼
          REACT DASHBOARD
                 |
                 ▼
           FASTAPI BACKEND
                 |
        ┌────────┴────────┐
        ▼                 ▼
 INCIDENT ENGINE      LOG DATA
        |                 |
        └────────┬────────┘
                 ▼
        INVESTIGATION ENGINE
                 |
                 ▼
           AI DIAGNOSIS
                 |
                 ▼
        PROPOSED REMEDIATION
                 |
                 ▼
          HUMAN APPROVAL
                 |
                 ▼
          SAFE EXECUTION
```

*Note: The current prototype uses simulated incident and log data. Production monitoring integrations and real remediation execution are future development goals.*

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Backend | Python |
| API Framework | FastAPI |
| Development Server | Uvicorn |
| Styling | CSS |
| API Communication | REST API |
| Version Control | Git & GitHub |

---

## 📂 Project Structure

```text
on-call-incident-agent/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/imyuvaraj11-create/on-call-incedient-agent-.git
```

### 2. Open the project

```bash
cd on-call-incedient-agent-
```

### 3. Start the backend

```bash
cd backend
```

Install dependencies:

```bash
pip install fastapi uvicorn
```

Start the server:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

---

## 🔄 How It Works

1. The engineer opens the incident dashboard.
2. A simulated incident is triggered.
3. The backend creates an incident record.
4. The investigation workflow retrieves available incident information.
5. The diagnosis workflow generates a possible cause and proposed investigation steps.
6. The engineer reviews the recommendation.
7. Human approval is required before any remediation can be executed.

---

## 🎯 Example Incidents

The prototype can simulate incidents such as:

- High CPU Usage
- Database Connection Failure
- API Response Timeout
- Memory Usage Critical
- Service Unavailable

---

## 🔐 Safety First: Human-in-the-Loop

The system is designed around a human approval principle.

**The agent recommends. The engineer decides.**

Automated remediation should never execute destructive operations without appropriate authorization and safety checks.

---

## 🚀 Future Enhancements

- Real-time infrastructure monitoring.
- Prometheus and Grafana integration.
- Real application log analysis.
- AI-powered root cause analysis.
- Slack incident notifications.
- Historical incident correlation.
- Human-approved automated remediation.
- Incident analytics and reporting.

---

## 👨‍💻 Team

Developed as a hackathon project by students of the Computer Science and Engineering Department, Karavali Institute of Technology.

---

## 📌 Project Status

**Prototype – Local Development**

This project currently demonstrates a simulated incident response and diagnosis workflow. Additional integrations and production capabilities are planned.

---

## ⭐ Support

If you find this project interesting, consider giving the repository a star!

**Building safer and smarter incident response.**
