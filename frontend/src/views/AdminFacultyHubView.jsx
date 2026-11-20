import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  ShieldCheck,
  FileCheck2,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  Power,
  Send,
  Trash2,
  Clock,
  Building2,
  Lock,
  Unlock,
  X,
} from 'lucide-react';
import { facultyGovernanceApi } from '../services/facultyGovernanceApi';

const TABS = [
  { id: 'directory', label: 'Faculty Directory', icon: Users },
  { id: 'allocations', label: 'Subject Allocation', icon: BookOpen },
  { id: 'timetable', label: 'Workload & Timetable', icon: CalendarClock },
  { id: 'attendance', label: 'Attendance & Leaves', icon: ClipboardCheck },
  { id: 'permissions', label: 'Roles & Permissions', icon: ShieldCheck },
  { id: 'audit', label: 'Syllabus & Teaching Audit', icon: FileCheck2 },
];

const DEPARTMENTS = ['AIML', 'CSE', 'ECE', 'ISE', 'Basic Sciences'];
const DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lab Instructor'];
const SYSTEM_ROLES = ['HOD', 'Class Coordinator', 'Mentor', 'Lab Instructor', 'Standard Faculty'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['09:00 - 10:00', '10:00 - 11:00', '11:15 - 12:15', '12:15 - 01:15', '02:00 - 04:00'];

export default function AdminFacultyHubView({ role, onNotify }) {
  if (role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-[#111827]/90 p-10 text-center">
        <Lock className="h-10 w-10 text-rose-400 mb-3" />
        <h2 className="text-lg font-bold text-white">Restricted Admin Module</h2>
        <p className="mt-1 text-sm text-slate-400">
          Faculty Governance & Operations modules are accessible strictly to Administration accounts.
        </p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('directory');
  const [data, setData] = useState({
    faculty: [],
    allocations: [],
    timetable: [],
    attendance: [],
    leaves: [],
    audits: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    emp_id: '',
    full_name: '',
    email: '',
    phone: '',
    department: 'AIML',
    designation: 'Assistant Professor',
    qualification: 'M.Tech',
    joining_date: '2026-08-01',
    status: 'Active',
  });

  const [selectedTerm, setSelectedTerm] = useState('Odd Term 2026-27');
  const [allocForm, setAllocForm] = useState({
    faculty_id: '',
    subject_code: '',
    subject_name: '',
    subject_type: 'Theory',
    department: 'AIML',
    semester: 'Sem 3',
    section: 'A',
    is_co_teaching: false,
  });

  const [ttFilterType, setTtFilterType] = useState('All');
  const [ttFilterValue, setTtFilterValue] = useState('');
  const [clashError, setClashError] = useState('');
  const [ttForm, setTtForm] = useState({
    faculty_id: '',
    subject_code: '',
    subject_name: '',
    department: 'AIML',
    semester: 'Sem 3',
    section: 'A',
    day_of_week: 'Monday',
    time_slot: '09:00 - 10:00',
    room_no: 'LH-204',
    hours: 4,
  });

  const [remarks, setRemarks] = useState({});
  const [auditDept, setAuditDept] = useState('All');
  const [auditSem, setAuditSem] = useState('All');

  useEffect(() => {
    facultyGovernanceApi.getAll().then((res) => {
      setData(res);
      if (res.faculty.length > 0) {
        setAllocForm((prev) => ({ ...prev, faculty_id: res.faculty[0].id }));
        setTtForm((prev) => ({ ...prev, faculty_id: res.faculty[0].id }));
      }
    });
  }, []);

  const notify = (msg, type = 'success') => {
    if (onNotify) onNotify(msg, type);
  };

  const facultyMap = useMemo(() => {
    const map = {};
    data.faculty.forEach((f) => {
      map[f.id] = f;
    });
    return map;
  }, [data.faculty]);

  const filteredFaculty = useMemo(() => {
    return data.faculty.filter((f) => {
      const matchesQuery =
        f.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.emp_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === 'All' || f.department === deptFilter;
      const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
      return matchesQuery && matchesDept && matchesStatus;
    });
  }, [data.faculty, searchTerm, deptFilter, statusFilter]);

  const openAddFaculty = () => {
    setEditingFaculty(null);
    setFacultyForm({
      emp_id: `GMU-FAC-${125 + data.faculty.length}`,
      full_name: '',
      email: '',
      phone: '+91 ',
      department: 'AIML',
      designation: 'Assistant Professor',
      qualification: 'M.Tech',
      joining_date: '2026-08-01',
      status: 'Active',
    });
    setDrawerOpen(true);
  };

  const openEditFaculty = (fac) => {
    setEditingFaculty(fac);
    setFacultyForm({ ...fac });
    setDrawerOpen(true);
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    if (!facultyForm.full_name.trim() || !facultyForm.emp_id.trim()) return;
    const updated = await facultyGovernanceApi.saveFaculty(
      editingFaculty ? { ...facultyForm, id: editingFaculty.id } : facultyForm
    );
    setData(updated);
    setDrawerOpen(false);
    notify(editingFaculty ? 'Faculty profile updated.' : 'New faculty member added to directory.');
  };

  const handleToggleStatus = async (id) => {
    const updated = await facultyGovernanceApi.toggleFacultyStatus(id);
    setData(updated);
    notify('Faculty account status updated.');
  };

  const handleAddAllocation = async (e) => {
    e.preventDefault();
    if (!allocForm.subject_code.trim() || !allocForm.subject_name.trim() || !allocForm.faculty_id) return;
    try {
      const updated = await facultyGovernanceApi.addAllocation({
        ...allocForm,
        academic_term: selectedTerm,
      });
      setData(updated);
      setAllocForm((prev) => ({ ...prev, subject_code: '', subject_name: '', is_co_teaching: false }));
      notify('Subject mapped to faculty successfully.');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteAllocation = async (id) => {
    const updated = await facultyGovernanceApi.deleteAllocation(id);
    setData(updated);
    notify('Subject allocation removed.');
  };

  const workloadSummary = useMemo(() => {
    return data.faculty
      .filter((f) => f.status === 'Active')
      .map((f) => {
        const slots = data.timetable.filter((t) => t.faculty_id === f.id);
        const totalHours = slots.reduce((sum, s) => sum + Number(s.hours || 0), 0);
        return { ...f, totalHours, slotCount: slots.length };
      });
  }, [data.faculty, data.timetable]);

  const filteredTimetable = useMemo(() => {
    if (ttFilterType === 'All' || !ttFilterValue) return data.timetable;
    if (ttFilterType === 'Faculty') return data.timetable.filter((t) => t.faculty_id === ttFilterValue);
    if (ttFilterType === 'Room') return data.timetable.filter((t) => t.room_no === ttFilterValue);
    if (ttFilterType === 'Department') return data.timetable.filter((t) => t.department === ttFilterValue);
    return data.timetable;
  }, [data.timetable, ttFilterType, ttFilterValue]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setClashError('');
    if (!ttForm.faculty_id || !ttForm.subject_code.trim() || !ttForm.room_no.trim()) return;
    try {
      const updated = await facultyGovernanceApi.addTimetableSlot(ttForm);
      setData(updated);
      notify('Timetable slot assigned with zero clashes.');
    } catch (err) {
      setClashError(err.message);
      notify('Schedule clash detected! Check alert banner.', 'error');
    }
  };

  const handleDeleteSlot = async (id) => {
    const updated = await facultyGovernanceApi.deleteTimetableSlot(id);
    setData(updated);
    notify('Timetable slot removed.');
  };

  const handleLeaveDecision = async (leaveId, decision) => {
    const updated = await facultyGovernanceApi.updateLeaveStatus(leaveId, decision, remarks[leaveId] || '');
    setData(updated);
    notify(`Leave request ${decision.toLowerCase()} and attendance log synced.`);
  };

  const handleRoleChange = async (fac, newRole) => {
    const updated = await facultyGovernanceApi.updatePermissions(fac.id, newRole, fac.permissions);
    setData(updated);
    notify(`Updated system role for ${fac.full_name} to ${newRole}.`);
  };

  const handlePermissionToggle = async (fac, key) => {
    const updatedPerms = { ...fac.permissions, [key]: !fac.permissions[key] };
    const updated = await facultyGovernanceApi.updatePermissions(fac.id, fac.system_role, updatedPerms);
    setData(updated);
    notify(`Updated access permissions for ${fac.full_name}.`);
  };

  const auditRows = useMemo(() => {
    return data.audits
      .map((aud) => {
        const alloc = data.allocations.find((a) => a.id === aud.allocation_id);
        const fac = alloc ? facultyMap[alloc.faculty_id] : null;
        return { ...aud, alloc, fac };
      })
      .filter((row) => {
        if (!row.alloc) return false;
        const dMatch = auditDept === 'All' || row.alloc.department === auditDept;
        const sMatch = auditSem === 'All' || row.alloc.semester === auditSem;
        return dMatch && sMatch;
      });
  }, [data.audits, data.allocations, facultyMap, auditDept, auditSem]);

  const activeFacultyCount = data.faculty.filter((f) => f.status === 'Active').length;
  const pendingLeaveCount = data.leaves.filter((l) => l.status === 'Pending').length;
  const overdueAuditsCount = auditRows.filter((r) => r.ia2_status === 'Overdue' || r.attendance_regularity.includes('Pending')).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111827]/85 p-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
            Admin Governance Suite
          </span>
          <h1 className="mt-1.5 text-xl font-bold text-white">Faculty Operations & Academic Control</h1>
          <p className="text-xs text-slate-400">
            Manage faculty profiles, subject mappings, clash-free timetables, leave approvals, RBAC locks, and syllabus audits.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 bg-[#0B0F19]/80 px-3.5 py-2.5">
            <div className="text-[11px] text-slate-400">Active Faculty</div>
            <div className="text-lg font-bold text-cyan-400">{activeFacultyCount} / {data.faculty.length}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0B0F19]/80 px-3.5 py-2.5">
            <div className="text-[11px] text-slate-400">Pending Leaves</div>
            <div className="text-lg font-bold text-amber-400">{pendingLeaveCount}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0B0F19]/80 px-3.5 py-2.5">
            <div className="text-[11px] text-slate-400">Audit Alerts</div>
            <div className="text-lg font-bold text-rose-400">{overdueAuditsCount}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#111827]/75 p-2 backdrop-blur-xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.id === 'attendance' && pendingLeaveCount > 0 && (
                <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300">
                  {pendingLeaveCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111827]/85 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name, Emp ID, email..."
                  className="w-60 rounded-xl border border-white/10 bg-[#0B0F19] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>

              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </div>

            <button
              onClick={openAddFaculty}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              <Plus className="h-4 w-4" />
              Add Faculty Profile
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]/85">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-[#0B0F19]/70 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Faculty Details</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation & Qualification</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredFaculty.map((fac) => (
                  <tr key={fac.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono font-semibold text-cyan-400">{fac.emp_id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{fac.full_name}</div>
                      <div className="text-[11px] text-slate-400">{fac.email} • {fac.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 font-semibold text-indigo-300">
                        {fac.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200 font-medium">{fac.designation}</div>
                      <div className="text-[11px] text-slate-400">{fac.qualification}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          fac.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {fac.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditFaculty(fac)}
                          title="Edit Profile"
                          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(fac.id)}
                          title={fac.status === 'Active' ? 'Deactivate Faculty' : 'Activate Faculty'}
                          className={`rounded-lg border p-1.5 transition ${
                            fac.status === 'Active'
                              ? 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          }`}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'allocations' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleAddAllocation}
            className="space-y-3.5 rounded-2xl border border-white/10 bg-[#111827]/85 p-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">Map Subject to Faculty</h3>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#0B0F19] px-2 py-1 text-[11px] text-amber-300"
              >
                <option value="Odd Term 2026-27">Odd Term 2026-27</option>
                <option value="Even Term 2026-27">Even Term 2026-27</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] text-slate-400">Select Active Faculty</label>
              <select
                value={allocForm.faculty_id}
                onChange={(e) => setAllocForm({ ...allocForm, faculty_id: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
              >
                {data.faculty
                  .filter((f) => f.status === 'Active')
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.full_name} ({f.department})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Subject Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 22AI34"
                  value={allocForm.subject_code}
                  onChange={(e) => setAllocForm({ ...allocForm, subject_code: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Course Type</label>
                <select
                  value={allocForm.subject_type}
                  onChange={(e) => setAllocForm({ ...allocForm, subject_type: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                >
                  <option value="Theory">Theory</option>
                  <option value="Lab">Lab</option>
                  <option value="Integrated">Integrated (T+L)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] text-slate-400">Subject Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Machine Learning Algorithms"
                value={allocForm.subject_name}
                onChange={(e) => setAllocForm({ ...allocForm, subject_name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Dept</label>
                <select
                  value={allocForm.department}
                  onChange={(e) => setAllocForm({ ...allocForm, department: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-2.5 py-2 text-xs text-white"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Semester</label>
                <select
                  value={allocForm.semester}
                  onChange={(e) => setAllocForm({ ...allocForm, semester: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-2.5 py-2 text-xs text-white"
                >
                  {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Section</label>
                <select
                  value={allocForm.section}
                  onChange={(e) => setAllocForm({ ...allocForm, section: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-2.5 py-2 text-xs text-white"
                >
                  {['A', 'B', 'C'].map((sec) => (
                    <option key={sec} value={sec}>Sec {sec}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={allocForm.is_co_teaching}
                onChange={(e) => setAllocForm({ ...allocForm, is_co_teaching: e.target.checked })}
                className="rounded border-white/20 bg-[#0B0F19]"
              />
              Allow Co-Teaching / Lab Assistant duplicate mapping
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
            >
              Assign Subject Mapping
            </button>
          </form>

          <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]/85">
            <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Active Term Subject Matrix ({selectedTerm})</h3>
              <span className="text-xs text-slate-400">{data.allocations.length} mappings</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-[#0B0F19]/70 text-[11px] uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Cohort</th>
                  <th className="px-4 py-3">Assigned Professor</th>
                  <th className="px-4 py-3 text-right">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {data.allocations
                  .filter((a) => a.academic_term === selectedTerm)
                  .map((alloc) => {
                    const prof = facultyMap[alloc.faculty_id];
                    return (
                      <tr key={alloc.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <div className="font-mono font-bold text-cyan-400">
                            {alloc.subject_code}{' '}
                            <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 font-sans text-[10px] text-slate-300">
                              {alloc.subject_type}
                            </span>
                          </div>
                          <div className="text-white font-medium">{alloc.subject_name}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {alloc.department} • {alloc.semester} (Sec {alloc.section})
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">{prof ? prof.full_name : 'Unassigned'}</div>
                          <div className="text-[11px] text-slate-400">{prof?.emp_id}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteAllocation(alloc.id)}
                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {workloadSummary.map((item) => {
              const overloaded = item.totalHours > 18;
              const optimal = item.totalHours >= 12 && item.totalHours <= 18;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#111827]/85 p-3.5"
                >
                  <div className="text-xs font-bold text-white truncate">{item.full_name}</div>
                  <div className="text-[11px] text-slate-400">{item.department} • {item.designation}</div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-cyan-400">{item.totalHours} hrs/wk</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        overloaded
                          ? 'bg-rose-500/20 text-rose-300'
                          : optimal
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {overloaded ? 'Overloaded (>18h)' : optimal ? 'Optimal (12–18h)' : 'Light (<12h)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {clashError && (
            <div className="flex items-start justify-between gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/15 p-4 text-xs text-rose-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
                <div>
                  <div className="font-bold text-rose-300">Schedule Conflict Blocked</div>
                  <div>{clashError}</div>
                </div>
              </div>
              <button onClick={() => setClashError('')} className="text-rose-300 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <form
              onSubmit={handleAddSlot}
              className="space-y-3 rounded-2xl border border-white/10 bg-[#111827]/85 p-5"
            >
              <h3 className="border-b border-white/10 pb-2.5 text-sm font-bold text-white">
                Assign Weekly Slot & Room
              </h3>

              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Faculty</label>
                <select
                  value={ttForm.faculty_id}
                  onChange={(e) => setTtForm({ ...ttForm, faculty_id: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                >
                  {data.faculty
                    .filter((f) => f.status === 'Active')
                    .map((f) => (
                      <option key={f.id} value={f.id}>{f.full_name}</option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="22AI31"
                    value={ttForm.subject_code}
                    onChange={(e) => setTtForm({ ...ttForm, subject_code: e.target.value.toUpperCase() })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">Room / Lab</label>
                  <input
                    type="text"
                    required
                    placeholder="LH-204 / AIML-Lab-1"
                    value={ttForm.room_no}
                    onChange={(e) => setTtForm({ ...ttForm, room_no: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">Dept</label>
                  <select
                    value={ttForm.department}
                    onChange={(e) => setTtForm({ ...ttForm, department: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-2 py-2 text-xs text-white"
                  >
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">Sem</label>
                  <select
                    value={ttForm.semester}
                    onChange={(e) => setTtForm({ ...ttForm, semester: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-2 py-2 text-xs text-white"
                  >
                    {['Sem 1', 'Sem 3', 'Sem 5', 'Sem 7'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">Sec</label>
                  <select
                    value={ttForm.section}
                    onChange={(e) => setTtForm({ ...ttForm, section: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-2 py-2 text-xs text-white"
                  >
                    {['A', 'B', 'C'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">Day</label>
                  <select
                    value={ttForm.day_of_week}
                    onChange={(e) => setTtForm({ ...ttForm, day_of_week: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-2.5 py-2 text-xs text-white"
                  >
                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-400">Time Slot</label>
                  <select
                    value={ttForm.time_slot}
                    onChange={(e) => setTtForm({ ...ttForm, time_slot: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-2.5 py-2 text-xs text-white"
                  >
                    {TIME_SLOTS.map((ts) => <option key={ts} value={ts}>{ts}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Weekly Load Hours (L+P)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={ttForm.hours}
                  onChange={(e) => setTtForm({ ...ttForm, hours: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                Validate & Save Schedule Slot
              </button>
            </form>

            <div className="lg:col-span-2 space-y-3 rounded-2xl border border-white/10 bg-[#111827]/85 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">Department Master Timetable</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={ttFilterType}
                    onChange={(e) => {
                      setTtFilterType(e.target.value);
                      setTtFilterValue('');
                    }}
                    className="rounded-lg border border-white/10 bg-[#0B0F19] px-2.5 py-1.5 text-xs text-slate-200"
                  >
                    <option value="All">All Schedules</option>
                    <option value="Faculty">Filter by Faculty</option>
                    <option value="Department">Filter by Dept</option>
                  </select>

                  {ttFilterType === 'Faculty' && (
                    <select
                      value={ttFilterValue}
                      onChange={(e) => setTtFilterValue(e.target.value)}
                      className="rounded-lg border border-white/10 bg-[#0B0F19] px-2.5 py-1.5 text-xs text-cyan-300"
                    >
                      <option value="">Select Faculty...</option>
                      {data.faculty.map((f) => (
                        <option key={f.id} value={f.id}>{f.full_name}</option>
                      ))}
                    </select>
                  )}

                  {ttFilterType === 'Department' && (
                    <select
                      value={ttFilterValue}
                      onChange={(e) => setTtFilterValue(e.target.value)}
                      className="rounded-lg border border-white/10 bg-[#0B0F19] px-2.5 py-1.5 text-xs text-cyan-300"
                    >
                      <option value="">Select Dept...</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {filteredTimetable.map((slot) => {
                  const prof = facultyMap[slot.faculty_id];
                  return (
                    <div
                      key={slot.id}
                      className="flex items-start justify-between rounded-xl border border-white/10 bg-[#0B0F19]/90 p-3.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] font-bold text-indigo-300">
                            {slot.day_of_week}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="h-3 w-3" /> {slot.time_slot}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white">
                          {slot.subject_code} • {slot.department} {slot.semester} (Sec {slot.section})
                        </div>
                        <div className="text-[11px] text-cyan-400">{prof ? prof.full_name : 'Faculty'}</div>
                        <div className="flex items-center gap-1 text-[11px] text-amber-300">
                          <Building2 className="h-3 w-3" /> Room: {slot.room_no} ({slot.hours} hrs/wk)
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:border-rose-500/40 hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5">
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Daily Staff Biometric Check-In</h3>
                <p className="text-[11px] text-slate-400">Live campus punch-in status for today</p>
              </div>
              <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                20 Nov 2026
              </span>
            </div>

            <div className="space-y-2.5">
              {data.attendance.map((att) => {
                const prof = facultyMap[att.faculty_id];
                if (!prof) return null;
                return (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0B0F19]/80 px-3.5 py-2.5"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{prof.full_name}</div>
                      <div className="text-[11px] text-slate-400">
                        {prof.emp_id} • In: <span className="text-slate-200">{att.check_in}</span> | Out:{' '}
                        <span className="text-slate-200">{att.check_out}</span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        att.status === 'Present'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : att.status === 'Late'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-rose-500/15 text-rose-300'
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827]/85 p-5">
            <div className="mb-3 border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">Faculty Leave Approval Queue (CL / EL / OD)</h3>
              <p className="text-[11px] text-slate-400">Approve or reject leave requests with automatic attendance sync</p>
            </div>

            <div className="space-y-3">
              {data.leaves.map((lv) => {
                const prof = facultyMap[lv.faculty_id];
                return (
                  <div
                    key={lv.id}
                    className="rounded-xl border border-white/10 bg-[#0B0F19]/90 p-3.5 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{prof ? prof.full_name : 'Faculty'}</span>
                          <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                            {lv.leave_type} ({lv.days}d)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lv.start_date} to {lv.end_date} • Balance: {lv.balance_remaining} days left
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          lv.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : lv.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {lv.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{lv.reason}</p>

                    {lv.status === 'Pending' ? (
                      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                        <input
                          type="text"
                          placeholder="Optional Admin remark..."
                          value={remarks[lv.id] || ''}
                          onChange={(e) => setRemarks({ ...remarks, [lv.id]: e.target.value })}
                          className="flex-1 rounded-lg border border-white/10 bg-[#111827] px-2.5 py-1.5 text-xs text-white"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLeaveDecision(lv.id, 'Approved')}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleLeaveDecision(lv.id, 'Rejected')}
                            className="flex items-center gap-1 rounded-lg bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/30"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      lv.admin_remark && (
                        <div className="text-[11px] italic text-slate-400">Admin Note: {lv.admin_remark}</div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]/85">
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-bold text-white">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-slate-400">
              Assign academic leadership roles and lock or unlock sensitive Faculty Workspace actions.
            </p>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-[#0B0F19]/70 text-[11px] uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Faculty Member</th>
                <th className="px-4 py-3">System Role</th>
                <th className="px-4 py-3 text-center">Edit Attendance</th>
                <th className="px-4 py-3 text-center">Edit CIE Marks</th>
                <th className="px-4 py-3 text-center">Lock / Finalize Marks</th>
                <th className="px-4 py-3 text-center">Approve Student Leave</th>
                <th className="px-4 py-3 text-center">Dept Analytics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {data.faculty.map((fac) => {
                const permKeys = [
                  'canEditAttendance',
                  'canEditMarks',
                  'canLockMarks',
                  'canApproveStudentLeave',
                  'deptAnalyticsAccess',
                ];
                return (
                  <tr key={fac.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{fac.full_name}</div>
                      <div className="text-[11px] text-slate-400">{fac.emp_id} • {fac.department}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={fac.system_role}
                        onChange={(e) => handleRoleChange(fac, e.target.value)}
                        className="rounded-lg border border-amber-500/30 bg-[#0B0F19] px-2.5 py-1.5 text-xs font-semibold text-amber-300"
                      >
                        {SYSTEM_ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    {permKeys.map((key) => {
                      const enabled = Boolean(fac.permissions?.[key]);
                      return (
                        <td key={key} className="px-4 py-3 text-center">
                          <button
                            onClick={() => handlePermissionToggle(fac, key)}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                              enabled
                                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                                : 'border-white/10 bg-white/5 text-slate-500'
                            }`}
                          >
                            {enabled ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                            {enabled ? 'Allowed' : 'Locked'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111827]/85 p-4">
            <div>
              <h3 className="text-sm font-bold text-white">Department Syllabus & CIE Compliance Audit</h3>
              <p className="text-xs text-slate-400">Monitor unit coverage, attendance regularity, and internal marks deadlines.</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={auditDept}
                onChange={(e) => setAuditDept(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-slate-200"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={auditSem}
                onChange={(e) => setAuditSem(e.target.value)}
                className="rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-slate-200"
              >
                <option value="All">All Semesters</option>
                {['Sem 1', 'Sem 3', 'Sem 5', 'Sem 7'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111827]/85">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-[#0B0F19]/70 text-[11px] uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Course & Faculty</th>
                  <th className="px-4 py-3">Syllabus Coverage</th>
                  <th className="px-4 py-3">Attendance Regularity</th>
                  <th className="px-4 py-3">IA-1 / IA-2 Status</th>
                  <th className="px-4 py-3 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {auditRows.map((row) => {
                  const delayed = row.attendance_regularity.includes('Pending');
                  const overdue = row.ia2_status === 'Overdue';
                  return (
                    <tr key={row.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">
                          {row.alloc.subject_code} — {row.alloc.subject_name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {row.fac?.full_name} • {row.alloc.department} {row.alloc.semester} (Sec {row.alloc.section})
                        </div>
                      </td>

                      <td className="px-4 py-3 w-52">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-300">{row.units_completed}</span>
                          <span className="font-bold text-cyan-400">{row.syllabus_pct}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                            style={{ width: `${row.syllabus_pct}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            delayed ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {row.attendance_regularity}
                        </span>
                        <div className="mt-0.5 text-[10px] text-slate-500">Sync: {row.last_attendance_sync}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                            IA-1: {row.ia1_status}
                          </span>
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                              overdue
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            IA-2: {row.ia2_status}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            notify(
                              `Compliance reminder sent to ${row.fac?.full_name} for ${row.alloc.subject_code}.`,
                              'info'
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20"
                        >
                          <Send className="h-3 w-3" /> Send Reminder
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSaveFaculty}
            className="w-full max-w-lg space-y-4 rounded-2xl border border-white/15 bg-[#111827] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingFaculty ? 'Edit Faculty Profile' : 'Register New Faculty Member'}
              </h3>
              <button type="button" onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Employee ID</label>
                <input
                  type="text"
                  required
                  value={facultyForm.emp_id}
                  onChange={(e) => setFacultyForm({ ...facultyForm, emp_id: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. / Prof. Full Name"
                  value={facultyForm.full_name}
                  onChange={(e) => setFacultyForm({ ...facultyForm, full_name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmu.edu.in"
                  value={facultyForm.email}
                  onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Phone Number</label>
                <input
                  type="text"
                  required
                  value={facultyForm.phone}
                  onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Department</label>
                <select
                  value={facultyForm.department}
                  onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                >
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Designation</label>
                <select
                  value={facultyForm.designation}
                  onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                >
                  {DESIGNATIONS.map((des) => <option key={des} value={des}>{des}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Highest Qualification</label>
                <input
                  type="text"
                  required
                  placeholder="Ph.D. / M.Tech"
                  value={facultyForm.qualification}
                  onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">Date of Joining</label>
                <input
                  type="date"
                  value={facultyForm.joining_date}
                  onChange={(e) => setFacultyForm({ ...facultyForm, joining_date: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Save Faculty Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}