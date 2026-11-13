from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional

app = FastAPI(title="On-Call Incident Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

incidents = []
next_id = 1


@app.get("/")
def home():
    return {
        "message": "On-Call Incident Agent Backend",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "message": "On-Call Incident Agent is running"
    }


@app.get("/incidents")
def get_incidents():
    return incidents


@app.post("/trigger-incident")
def trigger_incident():
    global next_id

    incident = {
        "id": next_id,
        "title": "High CPU Usage Detected",
        "service": "payment-service",
        "severity": "High",
        "status": "Investigating",
        "description": "CPU usage exceeded 90% after a recent deployment.",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "diagnosis": None,
        "recommendation": None,
        "approval_status": "Pending",
        "execution_status": "Not executed"
    }

    incidents.insert(0, incident)
    next_id += 1

    return incident


@app.post("/ai-investigate/{incident_id}")
def investigate_incident(incident_id: int):
    for incident in incidents:
        if incident["id"] == incident_id:
            incident["diagnosis"] = (
                "CPU usage increased after deployment. "
                "The payment service may have an inefficient process."
            )
            incident["recommendation"] = (
                "Review the latest deployment and investigate "
                "the payment service CPU-intensive process."
            )
            incident["status"] = "Diagnosis Complete"

            return incident

    return {"error": "Incident not found"}


@app.post("/approve/{incident_id}")
def approve_incident(incident_id: int):
    for incident in incidents:
        if incident["id"] == incident_id:
            incident["approval_status"] = "Approved"
            incident["execution_status"] = (
                "Approved — simulated action only"
            )
            return incident

    return {"error": "Incident not found"}


@app.post("/reject/{incident_id}")
def reject_incident(incident_id: int):
    for incident in incidents:
        if incident["id"] == incident_id:
            incident["approval_status"] = "Rejected"
            incident["execution_status"] = "Execution cancelled"
            return incident

    return {"error": "Incident not found"}