export default function ReportCard({ report }) {
  if (!report) return null;

  return (
    <div className="mt-8 rounded-xl border border-[#1e293b] bg-[#1a1a2e]/80 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#7c3aed]/20 to-[#3b82f6]/20 border-b border-[#1e293b]">
        <div className="p-2 rounded-lg bg-[#10b981]/20">
          <svg className="w-5 h-5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white">Final Research Report</h2>
        <button
          onClick={() => navigator.clipboard.writeText(report)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#7c3aed]/20 text-[#a78bfa] hover:bg-[#7c3aed]/30 transition-colors cursor-pointer border border-[#7c3aed]/30"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>
      </div>

      {/* Report Body */}
      <div className="p-6 prose prose-invert max-w-none text-sm leading-relaxed text-[#c9d1d9] whitespace-pre-wrap font-mono">
        {report}
      </div>
    </div>
  );
}
