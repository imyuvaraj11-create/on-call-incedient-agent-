import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

interface Incident {
  id?: number | string;
  incident_id?: string;
  title?: string;
  description?: string;
  severity?: string;
  status?: string;
  approval_status?: string;
  execution_status?: string;
  diagnosis?: string;
  proposed_fix?: string;
}

function App() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selected, setSelected] = useState<Incident | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getId = (item: Incident) =>
    item.id ?? item.incident_id;

  async function loadIncidents() {
    try {
      const health = await fetch(`${API}/health`);
      setConnected(health.ok);

      const response = await fetch(`${API}/incidents`);

      if (!response.ok) {
        throw new Error("Unable to load incidents");
      }

      const data: unknown = await response.json();

      const list: Incident[] = Array.isArray(data)
        ? data as Incident[]
        : ((data as { incidents?: Incident[] }).incidents ?? []);

      setIncidents(list);

      setSelected((previous: Incident | null) => {
        if (!list.length) return null;

        return list.find(
          (item: Incident) =>
            getId(item) === (previous ? getId(previous) : undefined)
        ) ?? list[0];
      });
    } catch {
      setConnected(false);
    }
  }

  useEffect(() => {
    void loadIncidents();

    const timer = window.setInterval(() => {
      void loadIncidents();
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  async function triggerIncident() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API}/trigger-incident`, {
        method: "POST",
      });

      if (!response.ok) throw new Error();

      setMessage("Incident created successfully.");
      await loadIncidents();
    } catch {
      setMessage("Could not create incident. Check backend.");
    } finally {
      setLoading(false);
    }
  }

  async function investigate() {
    if (!selected) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API}/ai-investigate/${getId(selected)}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error();

      setMessage("Investigation completed.");
      await loadIncidents();
    } catch {
      setMessage("Investigation failed. Check backend endpoint.");
    } finally {
      setLoading(false);
    }
  }

  async function decide(action: "approve" | "reject") {
    if (!selected) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API}/${action}/${getId(selected)}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error();

      setMessage(
        action === "approve"
          ? "Engineer approval recorded."
          : "Fix rejected. No remediation executed."
      );

      await loadIncidents();
    } catch {
      setMessage(
        `Backend endpoint /${action}/{incident_id} is not available yet.`
      );
    } finally {
      setLoading(false);
    }
  }

  const critical = incidents.filter(
    (item: Incident) =>
      item.severity?.toLowerCase() === "critical"
  ).length;

  const investigated = incidents.filter(
    (item: Incident) => Boolean(item.diagnosis)
  ).length;

  const pending = incidents.filter(
    (item: Incident) =>
      !item.approval_status ||
      item.approval_status.toLowerCase() === "pending"
  ).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">⚡</div>
          <div>
            <h2>ON-CALL</h2>
            <h2>INCIDENT AGENT</h2>
          </div>
        </div>

        <p className="side-label">WORKSPACE</p>

        <div className="nav active">⌂ Overview</div>
        <div className="nav">⚠ Incidents</div>
        <div className="nav">✧ AI Investigation</div>
        <div className="nav">◷ Activity Log</div>

        <div className="human-card">
          <div className="shield">✓</div>
          <h3>Human Control</h3>
          <p>Engineers approve every proposed remediation.</p>
        </div>

        <div className="version">VERSION 1.0 • DEMO</div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <span className="eyebrow">DEVOPS / SRE / INCIDENT INTELLIGENCE</span>
            <h1>Incident Command Center</h1>
            <p>Monitor, investigate and manage service incidents.</p>
          </div>

          <div className="header-right">
            <span className={connected ? "online" : "offline"}>
              ● {connected ? "Backend Connected" : "Backend Disconnected"}
            </span>

            <button
              className="primary-button"
              onClick={triggerIncident}
              disabled={loading}
            >
              + Trigger Incident
            </button>
          </div>
        </header>

        {message && <div className="message">{message}</div>}

        <section className="stats">
          <div className="stat blue">
            <span>ϟ</span>
            <div>
              <p>Total Incidents</p>
              <h2>{incidents.length}</h2>
            </div>
          </div>

          <div className="stat red">
            <span>⚠</span>
            <div>
              <p>Critical Incidents</p>
              <h2>{critical}</h2>
            </div>
          </div>

          <div className="stat green">
            <span>✧</span>
            <div>
              <p>Investigated</p>
              <h2>{investigated}</h2>
            </div>
          </div>

          <div className="stat orange">
            <span>◷</span>
            <div>
              <p>Pending Approval</p>
              <h2>{pending}</h2>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="panel incidents">
            <div className="panel-title">
              <h2>Active Incidents</h2>
              <span>{incidents.length}</span>
            </div>

            {incidents.length === 0 && (
              <div className="empty">
                <div>◉</div>
                <h3>No incidents detected</h3>
                <p>Trigger a simulated incident to begin.</p>
              </div>
            )}

            {incidents.map((item: Incident, index: number) => (
              <button
                key={String(getId(item) ?? index)}
                className={`incident ${
                  selected && getId(selected) === getId(item)
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelected(item)}
              >
                <span className="severity">
                  {item.severity ?? "HIGH"}
                </span>

                <h3>{item.title ?? "System Incident"}</h3>

                <p>
                  {item.incident_id ?? getId(item)}
                </p>

                <small>{item.description ?? "Incident detected"}</small>
              </button>
            ))}
          </div>

          <div className="panel details">
            {!selected ? (
              <div className="empty">
                <h3>Select an incident</h3>
                <p>Incident information will appear here.</p>
              </div>
            ) : (
              <>
                <div className="panel-title">
                  <h2>Incident Investigation</h2>
                  <span className="severity">
                    {selected.severity ?? "HIGH"}
                  </span>
                </div>

                <h2 className="incident-heading">
                  {selected.title ?? "System Incident"}
                </h2>

                <p className="incident-description">
                  {selected.description ?? "Incident detected"}
                </p>

                <div className="detail-card">
                  <h3>✧ AI Diagnosis</h3>
                  <p>
                    {selected.diagnosis ??
                      "No investigation available. Run AI investigation to analyse this incident."}
                  </p>

                  <button
                    className="primary-button"
                    onClick={investigate}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Run AI Investigation"}
                  </button>
                </div>

                <div className="detail-card">
                  <h3>⚙ Proposed Remediation</h3>
                  <p>
                    {selected.proposed_fix ??
                      "Recommended remediation will appear after investigation."}
                  </p>
                </div>

                <div className="detail-card approval">
                  <h3>🛡 Human Approval Required</h3>
                  <p>
                    An engineer must review the proposed fix before any
                    remediation is executed.
                  </p>

                  <div className="actions">
                    <button
                      className="approve"
                      onClick={() => decide("approve")}
                      disabled={loading}
                    >
                      ✓ Approve
                    </button>

                    <button
                      className="reject"
                      onClick={() => decide("reject")}
                      disabled={loading}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>

                <div className="execution">
                  Execution Status:{" "}
                  <strong>
                    {selected.execution_status ?? "NOT EXECUTED"}
                  </strong>
                </div>
              </>
            )}
          </div>
        </section>

        <footer>
          ON-CALL INCIDENT AGENT • AI-ASSISTED RESPONSE • HUMAN CONTROL ENABLED
        </footer>
      </main>
    </div>
  );
}

export default App;