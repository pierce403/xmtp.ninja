import { useMemo, useRef, useState } from "react";

type RoutingMode = "single" | "priority" | "round-robin";

const demoPrimary = "0xA3f9...1b72";
const demoSecondaries = ["0x2B11...8fE2", "0x9C0d...44Aa", "lens/riverblue"];

const normalizeIdentity = (value: string) => value.trim().replace(/\s+/g, " ");

const formatIdentity = (value: string) => {
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export default function App() {
  const [primaryInput, setPrimaryInput] = useState("");
  const [primary, setPrimary] = useState("");
  const [secondaryInput, setSecondaryInput] = useState("");
  const [secondaries, setSecondaries] = useState<string[]>([]);
  const [routingMode, setRoutingMode] = useState<RoutingMode>("single");
  const [note, setNote] = useState("");
  const primaryInputRef = useRef<HTMLInputElement>(null);

  const unifiedInbox = useMemo(() => {
    if (!primary) return "Connect a primary identity to view routing.";
    const total = secondaries.length + 1;
    return `${formatIdentity(primary)} receives ${total} identity${
      total === 1 ? "" : "ies"
    }.`;
  }, [primary, secondaries]);

  const handlePrimaryConnect = () => {
    const next = normalizeIdentity(primaryInput);
    if (!next) {
      setNote("Add a primary identity before connecting.");
      return;
    }
    setPrimary(next);
    if (secondaries.includes(next)) {
      setSecondaries((prev) => prev.filter((item) => item !== next));
    }
    setNote("Primary identity connected.");
  };

  const handleAddSecondary = () => {
    const next = normalizeIdentity(secondaryInput);
    if (!next) {
      setNote("Enter an additional identity to add.");
      return;
    }
    if (next === primary) {
      setNote("That identity is already the primary inbox.");
      return;
    }
    if (secondaries.includes(next)) {
      setNote("That identity is already linked.");
      return;
    }
    setSecondaries((prev) => [next, ...prev]);
    setSecondaryInput("");
    setNote("Identity added to the unified inbox.");
  };

  const handleRemoveSecondary = (target: string) => {
    setSecondaries((prev) => prev.filter((item) => item !== target));
    setNote("Identity removed.");
  };

  const handleDemo = () => {
    setPrimary(demoPrimary);
    setPrimaryInput(demoPrimary);
    setSecondaries(demoSecondaries);
    setNote("Loaded demo identities.");
  };

  const handleReset = () => {
    setPrimary("");
    setPrimaryInput("");
    setSecondaries([]);
    setSecondaryInput("");
    setNote("Cleared the workspace.");
  };

  const handleJumpToPrimary = () => {
    document.getElementById("primary-panel")?.scrollIntoView({ behavior: "smooth" });
    primaryInputRef.current?.focus();
  };

  const handleJumpToRouting = () => {
    document
      .getElementById("routing-preview")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <header className="hero">
        <nav className="nav">
          <div className="brand">
            <span className="brand-mark">*</span>
            <div>
              <p className="brand-name">XMTP Ninja</p>
              <p className="brand-tag">Identity tools for the inbox frontier</p>
            </div>
          </div>
          <div className="nav-actions">
            <button className="ghost" onClick={handleDemo}>
              Load demo
            </button>
            <button className="ghost" onClick={handleReset}>
              Reset
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div>
            <p className="eyebrow">Inbox Unifier</p>
            <h1>Route every identity into one XMTP inbox.</h1>
            <p className="lede">
              Connect a primary identity, link any number of additional identities,
              and keep your conversations flowing to the same secure destination.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={handleJumpToPrimary}>
                Connect primary
              </button>
              <button className="secondary" onClick={handleJumpToRouting}>
                Review routing
              </button>
            </div>
          </div>
          <div className="hero-card">
            <p className="card-title">Unified inbox status</p>
            <h2>{primary ? "Active" : "Waiting"}</h2>
            <p className="muted">{unifiedInbox}</p>
            <div className="stat-grid">
              <div>
                <p className="stat-label">Primary</p>
                <p className="stat-value">
                  {primary ? formatIdentity(primary) : "Not connected"}
                </p>
              </div>
              <div>
                <p className="stat-label">Additional</p>
                <p className="stat-value">{secondaries.length}</p>
              </div>
              <div>
                <p className="stat-label">Mode</p>
                <p className="stat-value">{routingMode}</p>
              </div>
            </div>
            {note ? <p className="note">{note}</p> : null}
          </div>
        </div>
      </header>

      <main>
        <section className="tool-grid">
          <article className="panel" id="primary-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Step 1</p>
                <h3>Connect your primary identity</h3>
              </div>
              <span className="badge">Inbox target</span>
            </div>
            <p className="muted">
              This identity becomes the destination for all routed messages. You
              can connect an XMTP address, ENS, Lens handle, or another resolvable
              identity.
            </p>
            <div className="input-row">
              <input
                type="text"
                placeholder="0x... or handle"
                value={primaryInput}
                ref={primaryInputRef}
                onChange={(event) => setPrimaryInput(event.target.value)}
              />
              <button className="primary" onClick={handlePrimaryConnect}>
                Connect
              </button>
            </div>
            <div className="panel-foot">
              <div>
                <p className="stat-label">Connected primary</p>
                <p className="stat-value">
                  {primary ? primary : "No primary connected yet"}
                </p>
              </div>
              <span className="chip">Encrypted routing</span>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Step 2</p>
                <h3>Add secondary identities</h3>
              </div>
              <span className="badge alt">Multi-identity</span>
            </div>
            <p className="muted">
              Link every account you want to converge into the same inbox. Each
              identity will route messages to your primary destination.
            </p>
            <div className="input-row">
              <input
                type="text"
                placeholder="Add another identity"
                value={secondaryInput}
                onChange={(event) => setSecondaryInput(event.target.value)}
              />
              <button className="primary" onClick={handleAddSecondary}>
                Add
              </button>
            </div>
            <div className="pill-list">
              {secondaries.length === 0 ? (
                <p className="muted">No secondary identities yet.</p>
              ) : (
                secondaries.map((identity) => (
                  <div className="pill" key={identity}>
                    <span>{formatIdentity(identity)}</span>
                    <button
                      className="icon-button"
                      onClick={() => handleRemoveSecondary(identity)}
                      aria-label={`Remove ${identity}`}
                    >
                      x
                    </button>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="panel full">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Step 3</p>
                <h3>Define routing behavior</h3>
              </div>
              <span className="badge soft">Configurable</span>
            </div>
            <div className="mode-grid">
              {[
                {
                  id: "single",
                  title: "Single inbox",
                  body: "All identities resolve to one primary destination.",
                },
                {
                  id: "priority",
                  title: "Priority fallback",
                  body: "Route to the primary, then cascade to backups.",
                },
                {
                  id: "round-robin",
                  title: "Round-robin",
                  body: "Distribute incoming messages across identities.",
                },
              ].map((mode) => (
                <button
                  key={mode.id}
                  className={`mode-card ${
                    routingMode === mode.id ? "active" : ""
                  }`}
                  onClick={() => setRoutingMode(mode.id as RoutingMode)}
                >
                  <h4>{mode.title}</h4>
                  <p>{mode.body}</p>
                </button>
              ))}
            </div>
          </article>
        </section>

        <section className="routing-preview" id="routing-preview">
          <div>
            <p className="eyebrow">Live preview</p>
            <h3>Unified inbox routing table</h3>
            <p className="muted">
              See how identities route into your primary inbox before you commit
              the configuration to XMTP.
            </p>
          </div>
          <div className="table">
            <div className="table-row header">
              <span>Identity</span>
              <span>Routes to</span>
              <span>Status</span>
            </div>
            {[primary, ...secondaries].filter(Boolean).length === 0 ? (
              <div className="table-row empty">
                <span>-</span>
                <span>Connect identities to preview routing.</span>
                <span>-</span>
              </div>
            ) : (
              [primary, ...secondaries]
                .filter(Boolean)
                .map((identity, index) => (
                  <div className="table-row" key={`${identity}-${index}`}>
                    <span>{formatIdentity(identity)}</span>
                    <span>{primary ? formatIdentity(primary) : "-"}</span>
                    <span className="status">Ready</span>
                  </div>
                ))
            )}
          </div>
        </section>

        <section className="toolbox">
          <div>
            <p className="eyebrow">Next tools</p>
            <h3>XMTP Ninja toolkit roadmap</h3>
            <p className="muted">
              Plan the rest of the suite alongside the Inbox Unifier.
            </p>
          </div>
          <div className="toolbox-grid">
            <div className="tool-card">
              <h4>Conversation sweeper</h4>
              <p>Archive, label, and migrate message history across identities.</p>
            </div>
            <div className="tool-card">
              <h4>Permissions guard</h4>
              <p>Audit which apps or devices can send on your behalf.</p>
            </div>
            <div className="tool-card">
              <h4>Identity health</h4>
              <p>Check delivery, key rotation, and inbox sync status.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built for XMTP operators who manage multiple inboxes.</p>
        <button className="secondary">Publish configuration</button>
      </footer>
    </div>
  );
}
