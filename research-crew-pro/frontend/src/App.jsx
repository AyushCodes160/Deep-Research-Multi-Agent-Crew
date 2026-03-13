import { useState, useRef, useEffect } from 'react';
import TerminalView from './components/TerminalView';
import ReportCard from './components/ReportCard';
import './App.css';

const API_BASE = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/ws/research';

function App() {
  const [topic, setTopic] = useState('');
  const [logs, setLogs] = useState([]);
  const [report, setReport] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const wsRef = useRef(null);

  // Connect to WebSocket on mount
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = event.data;
      if (data.includes('[[FINAL_REPORT]]')) {
        const reportText = data.replace('[[FINAL_REPORT]]', '').trim();
        setReport(reportText);
        setIsRunning(false);
      } else if (data.includes('[[ERROR]]')) {
        setLogs(prev => [...prev, `❌ ERROR: ${data.replace('[[ERROR]]', '').trim()}`]);
        setIsRunning(false);
      } else {
        // Filter empty lines and add non-empty logs
        const lines = data.split('\n').filter(l => l.trim());
        if (lines.length > 0) {
          setLogs(prev => [...prev, ...lines]);
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => ws.close();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || isRunning) return;

    setLogs([]);
    setReport(null);
    setIsRunning(true);

    try {
      await fetch(`${API_BASE}/api/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });
    } catch (err) {
      setLogs(prev => [...prev, `❌ Failed to connect to backend: ${err.message}`]);
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#a78bfa] text-xs font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-[#7c3aed] animate-pulse"></span>
          Powered by CrewAI + Groq + Tavily
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#7c3aed] via-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent mb-3">
          Deep Research Crew
        </h1>
        <p className="text-[#94a3b8] max-w-xl mx-auto">
          AI agents collaborate in real-time to research, verify, and write professional reports on any topic.
        </p>
      </header>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10">
        <div className="relative flex items-center gap-3 p-2 rounded-xl bg-[#1a1a2e]/80 backdrop-blur border border-[#1e293b] shadow-lg focus-within:border-[#7c3aed]/50 transition-colors">
          <svg className="w-5 h-5 text-[#94a3b8] ml-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            id="research-topic-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a research topic, e.g. 'The future of quantum computing'"
            disabled={isRunning}
            className="flex-1 bg-transparent text-white placeholder-[#64748b] outline-none text-sm py-2"
          />
          <button
            type="submit"
            id="start-research-btn"
            disabled={isRunning || !topic.trim()}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shrink-0 ${
              isRunning
                ? 'bg-[#7c3aed]/30 text-[#a78bfa] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white hover:shadow-lg hover:shadow-[#7c3aed]/25 cursor-pointer active:scale-95'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Researching...
              </span>
            ) : (
              'Start Research'
            )}
          </button>
        </div>
      </form>

      {/* Agent Status Pills */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-3 justify-center">
        {[
          { name: 'Researcher', icon: '🔍', color: '#3b82f6' },
          { name: 'Fact-Checker', icon: '✅', color: '#10b981' },
          { name: 'Writer', icon: '✍️', color: '#f59e0b' },
        ].map((agent) => (
          <div
            key={agent.name}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium"
            style={{
              borderColor: `${agent.color}33`,
              backgroundColor: `${agent.color}10`,
              color: agent.color,
            }}
          >
            <span>{agent.icon}</span>
            {agent.name}
            {isRunning && (
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: agent.color }}></span>
            )}
          </div>
        ))}
      </div>

      {/* Terminal + Report */}
      <div className="max-w-4xl mx-auto">
        <TerminalView logs={logs} />
        <ReportCard report={report} />
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 text-[#475569] text-xs">
        Built with CrewAI • Groq (Llama 3) • Tavily • FastAPI • React
      </footer>
    </div>
  );
}

export default App;
