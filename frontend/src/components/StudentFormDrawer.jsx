import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const EMPTY_FORM = {
  usn: '',
  full_name: '',
  email: '',
  phone: '',
  department: 'AIML',
  semester: 3,
  section: 'A',
  batch: '2025-2029',
  classes_attended: 64,
  total_classes: 80,
  cgpa: 8.2,
  fee_status: 'Paid',
  fee_due: 0,
  guardian_contact: ''
};

export default function StudentFormDrawer({ open, onClose, initialStudent, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialStudent) {
      setForm({ ...initialStudent });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [initialStudent, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.usn.trim() || !form.full_name.trim() || !form.email.includes('@')) {
      setError('Please provide a valid USN, Full Name, and University Email.');
      return;
    }
    if (Number(form.classes_attended) > Number(form.total_classes)) {
      setError('Classes attended cannot exceed total classes.');
      return;
    }
    const attended = Number(form.classes_attended);
    const total = Number(form.total_classes) || 1;
    const attendance_pct = Number(((attended / total) * 100).toFixed(1));
    const fee_due = form.fee_status === 'Paid' ? 0 : Number(form.fee_due || 25000);

    onSave({
      ...form,
      semester: Number(form.semester),
      classes_attended: attended,
      total_classes: total,
      attendance_pct,
      cgpa: Number(form.cgpa),
      fee_due
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-sm">
      <div className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              {initialStudent ? 'Edit Student Record' : 'Enroll New Student'}
            </h2>
            <p className="text-xs text-slate-400">Changes persist immediately across sessions</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">USN / Roll No *</label>
              <input
                value={form.usn}
                onChange={(e) => setForm({ ...form, usn: e.target.value.toUpperCase() })}
                placeholder="4GM25AI042"
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Aarav Kulkarni"
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="student@nexcampus.edu.in"
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 99001 00000"
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                {['AIML', 'CSE', 'ISE', 'ECE', 'ME', 'CIVIL'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
              <select
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Sem {s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Section</label>
              <select
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                {['A', 'B', 'C'].map((sec) => (
                  <option key={sec} value={sec}>Sec {sec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Attended</label>
              <input
                type="number"
                min="0"
                value={form.classes_attended}
                onChange={(e) => setForm({ ...form, classes_attended: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Total Classes</label>
              <input
                type="number"
                min="1"
                value={form.total_classes}
                onChange={(e) => setForm({ ...form, total_classes: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">CGPA (0-10)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={form.cgpa}
                onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Fee Status</label>
              <select
                value={form.fee_status}
                onChange={(e) => setForm({ ...form, fee_status: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Pending Fee (₹)</label>
              <input
                type="number"
                min="0"
                disabled={form.fee_status === 'Paid'}
                value={form.fee_status === 'Paid' ? 0 : form.fee_due}
                onChange={(e) => setForm({ ...form, fee_due: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white disabled:opacity-40 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Batch</label>
              <input
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Guardian Contact</label>
              <input
                value={form.guardian_contact}
                onChange={(e) => setForm({ ...form, guardian_contact: e.target.value })}
                placeholder="+91 94481 00000"
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
            >
              <Save className="h-4 w-4" />
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}