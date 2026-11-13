import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

type Incident = {
  id?: string | number;
  incident_id?: string | number;
  title?: string;
  status?: string;
  severity?: string;
};

function App() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");

  async function loadIncidents() {
    try {
      const response = await fetch(`${API}/incidents`);

      if (!response.ok) {
        throw new Error("Could not load incidents");
      }

      const data = await response.json();

      setIncidents(
        Array.isArray(data)
          ? data
          : data.incidents || []
      );

      setError("");
    } catch (err) {
      setError("Cannot connect to backend.");
    }
  }

  async function checkBackend() {
    try {
      const response = await fetch(`${API}/health`);

      if (!response.ok) throw new Error();

      setBackendStatus("Connected");
    } catch {
      setBackendStatus("Disconnected");
    }
  }

  async function triggerIncident() {
    setLoading(true);
    setError("");
    setDiagnosis("");

    try {
      const response = await fetch(
        `${API}/trigger-incident`,
        { method: "POST" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Incident creation failed");
      }

      await loadIncidents();

      const incident = result.incident || result;
      const id = incident.id ?? incident.incident_id;

      setDiagnosis(
        id !== undefined
          ? `Incident created successfully!\nIncident ID: ${id}`
          : JSON.stringify(result, null, 2)
      );

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Incident creation failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function investigateIncident(id: string | number) {
    setDiagnosis("AI is investigating the incident...");

    try {
      const response = await fetch(
        `${API}/ai-investigate/${id}`,
        { method: "POST" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "AI investigation failed");
      }

      setDiagnosis(
        result.diagnosis ||
        result.analysis ||
        JSON.stringify(result, null, 2)
      );

    } catch (err) {
      setDiagnosis("AI investigation failed. Check backend terminal.");
    }
  }

  useEffect(() => {
    checkBackend();
    loadIncidents();

    const timer = setInterval(loadIncidents, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="app-shell">

      <header className="topbar">
        <div>
          <p className="eyebrow">DEVOPS • SRE • INCIDENT INTELLIGENCE</p>
          <h1>ON-CALL INCIDENT AGENT</h1>
          <p className="subtitle">
            AI-powered DevOps incident response platform
          </p>
        </div>

        <div className="connection">
          Backend: {backendStatus}
        </div>
      </header>

      <section className="metrics">
        <article className="metric-card">
          <span>Total Incidents</span>
          <strong>{incidents.length}</strong>
        </article>

        <article className="metric-card">
          <span>Response Mode</span>
          <strong>Human Approval</strong>
        </article>

        <article className="metric-card">
          <span>Agent Status</span>
          <strong>Monitoring</strong>
        </article>
      </section>

      <section className="panel trigger-panel">
        <div>
          <h2>Incident Monitoring</h2>
          <p>Create a simulated incident to test the system.</p>
        </div>

        <button
          onClick={triggerIncident}
          disabled={loading}
        >
          {loading ? "Creating..." : "+ Trigger Incident"}
        </button>
      </section>

      {error && (
        <div className="error-box">{error}</div>
      )}

      <section className="content-grid">

        <article className="panel">
          <h2>Active Incidents</h2>

          {incidents.length === 0 ? (
            <p>No incidents detected.</p>
          ) : (
            incidents.map((incident, index) => {
              const id = incident.id ?? incident.incident_id;

              return (
                <div className="incident-row" key={id ?? index}>
                  <h3>
                    {incident.title || "System Incident"}
                  </h3>

                  <p>
                    Incident ID: {id ?? "Not provided"}
                  </p>

                  <p>
                    Status: {incident.status || "Open"}
                  </p>

                  <p>
                    Severity: {incident.severity || "Unknown"}
                  </p>

                  {id !== undefined && (
                    <button
                      onClick={() => investigateIncident(id)}
                    >
                      AI Investigate
                    </button>
                  )}
                </div>
              );
            })
          )}
        </article>

        <article className="panel">
          <h2>AI Diagnosis</h2>

          <pre>
            {diagnosis || "Waiting for incident investigation..."}
          </pre>

          <p>
            Human approval required before executing fixes.
          </p>
        </article>

      </section>

      <footer>
        On-Call Incident Agent | Local Development
      </footer>

    </main>
  );
}

export default App;