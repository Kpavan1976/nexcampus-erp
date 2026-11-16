import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isWarn = toast.type === 'warning';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      {isWarn ? (
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
      ) : (
        <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
      )}
      <div className="text-sm font-medium text-slate-100">{toast.message}</div>
      <button onClick={onClose} className="text-slate-400 hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}