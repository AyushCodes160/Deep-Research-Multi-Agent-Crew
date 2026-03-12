import { useEffect, useRef } from 'react';

export default function TerminalView({ logs }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#1e293b] shadow-2xl">
      {/* Terminal Header Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[#1e293b]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
        <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
        <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        <span className="ml-3 text-xs text-[#94a3b8] font-mono tracking-wider uppercase">
          Agent Thoughts — Live Feed
        </span>
      </div>

      {/* Terminal Body */}
      <div
        className="bg-[#0d1117] p-4 h-[420px] overflow-y-auto font-mono text-sm leading-relaxed"
        id="terminal-body"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#94a3b8] opacity-60">
            <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Waiting for research to begin...</p>
            <p className="text-xs mt-1">Submit a topic above to activate the crew</p>
          </div>
        ) : (
          logs.map((line, i) => (
            <div key={i} className="flex gap-2 mb-1 hover:bg-[#161b22] px-2 py-0.5 rounded transition-colors">
              <span className="text-[#7c3aed] select-none shrink-0">❯</span>
              <span className={`whitespace-pre-wrap break-words ${
                line.includes('ERROR') ? 'text-red-400' :
                line.includes('FINAL_REPORT') ? 'text-[#10b981] font-bold' :
                line.includes('Agent') || line.includes('Task') ? 'text-[#06b6d4]' :
                'text-[#c9d1d9]'
              }`}>
                {line}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
        {logs.length > 0 && !logs[logs.length - 1]?.includes('FINAL_REPORT') && (
          <span className="inline-block w-2 h-4 bg-[#7c3aed] ml-6" style={{ animation: 'typing-cursor 1s infinite' }}></span>
        )}
      </div>
    </div>
  );
}
