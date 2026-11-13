from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import uuid
import random

app = FastAPI(title="On-Call Incident Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

incidents = []
logs = []

@app.get("/")
def home():
    return {"message": "On-Call Incident Agent is running", "status": "healthy"}

@app.get("/health")
def health():
    return {"message": "Backend connected successfully", "status": "healthy"}

@app.get("/incidents")
def get_incidents():
    return {"total": len(incidents), "incidents": incidents}

@app.post("/trigger-incident")
def trigger_incident():
    incident_id = str(uuid.uuid4())[:8]
    title = random.choice([
        "High CPU Usage",
        "Database Connection Failure",
        "API Response Timeout",
        "Memory Usage Critical",
        "Service Unavailable"
    ])

    incident = {
        "id": incident_id,
        "incident_id": incident_id,
        "title": title,
        "description": f"Simulated alert: {title}",
        "severity": random.choice(["HIGH", "CRITICAL"]),
        "status": "OPEN",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "diagnosis": None
    }

    incidents.insert(0, incident)
    logs.insert(0, {
        "incident_id": incident_id,
        "message": f"Alert detected: {title}"
    })

    return incident

@app.get("/investigate/{incident_id}")
def investigate(incident_id: str):
    incident = next(
        (item for item in incidents if item["id"] == incident_id),
        None
    )
    if not incident:
        return {"error": "Incident not found"}

    return {
        "incident": incident,
        "logs": [log for log in logs if log["incident_id"] == incident_id]
    }

@app.post("/ai-investigate/{incident_id}")
def ai_investigate(incident_id: str):
    incident = next(
        (item for item in incidents if item["id"] == incident_id),
        None
    )
    if not incident:
        return {"error": "Incident not found"}

    diagnosis = (
        f"Possible cause: {incident['title']}. "
        "Review application logs, recent deployments and service metrics."
    )

    incident["diagnosis"] = diagnosis
    incident["status"] = "INVESTIGATED"

    return {
        "incident_id": incident_id,
        "diagnosis": diagnosis,
        "proposed_fix": "Review and approve the proposed remediation.",
        "approval_required": True,
        "execution_status": "NOT_EXECUTED"
    }