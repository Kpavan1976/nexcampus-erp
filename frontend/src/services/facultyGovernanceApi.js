const STORAGE_KEY = 'nexcampus_faculty_governance_v1';
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const SEED_DATA = {
  faculty: [
    {
      id: 'fac-1',
      emp_id: 'GMU-FAC-101',
      full_name: 'Dr. Raghavendra Kulkarni',
      email: 'raghavendra.k@gmu.edu.in',
      phone: '+91 98450 11201',
      department: 'AIML',
      designation: 'Professor',
      qualification: 'Ph.D. (Machine Learning)',
      joining_date: '2019-07-15',
      status: 'Active',
      system_role: 'HOD',
      permissions: {
        canEditAttendance: true,
        canEditMarks: true,
        canLockMarks: true,
        canApproveStudentLeave: true,
        deptAnalyticsAccess: true,
      },
    },
    {
      id: 'fac-2',
      emp_id: 'GMU-FAC-104',
      full_name: 'Prof. Sneha Deshmukh',
      email: 'sneha.d@gmu.edu.in',
      phone: '+91 98450 11204',
      department: 'AIML',
      designation: 'Associate Professor',
      qualification: 'M.Tech (Data Science)',
      joining_date: '2021-02-10',
      status: 'Active',
      system_role: 'Class Coordinator',
      permissions: {
        canEditAttendance: true,
        canEditMarks: true,
        canLockMarks: true,
        canApproveStudentLeave: true,
        deptAnalyticsAccess: true,
      },
    },
    {
      id: 'fac-3',
      emp_id: 'GMU-FAC-109',
      full_name: 'Prof. Karthik Hegde',
      email: 'karthik.h@gmu.edu.in',
      phone: '+91 98450 11209',
      department: 'AIML',
      designation: 'Assistant Professor',
      qualification: 'M.Tech (Computer Science)',
      joining_date: '2022-08-01',
      status: 'Active',
      system_role: 'Mentor',
      permissions: {
        canEditAttendance: true,
        canEditMarks: true,
        canLockMarks: false,
        canApproveStudentLeave: true,
        deptAnalyticsAccess: false,
      },
    },
    {
      id: 'fac-4',
      emp_id: 'GMU-FAC-115',
      full_name: 'Dr. Ananya Rao',
      email: 'ananya.r@gmu.edu.in',
      phone: '+91 98450 11215',
      department: 'CSE',
      designation: 'Associate Professor',
      qualification: 'Ph.D. (Distributed Systems)',
      joining_date: '2020-01-20',
      status: 'Active',
      system_role: 'Class Coordinator',
      permissions: {
        canEditAttendance: true,
        canEditMarks: true,
        canLockMarks: true,
        canApproveStudentLeave: false,
        deptAnalyticsAccess: true,
      },
    },
    {
      id: 'fac-5',
      emp_id: 'GMU-FAC-122',
      full_name: 'Mr. Manjunath Patil',
      email: 'manjunath.p@gmu.edu.in',
      phone: '+91 98450 11222',
      department: 'AIML',
      designation: 'Lab Instructor',
      qualification: 'M.Sc. (Computer Science)',
      joining_date: '2023-06-12',
      status: 'Active',
      system_role: 'Lab Instructor',
      permissions: {
        canEditAttendance: true,
        canEditMarks: false,
        canLockMarks: false,
        canApproveStudentLeave: false,
        deptAnalyticsAccess: false,
      },
    },
  ],

  allocations: [
    {
      id: 'alloc-1',
      faculty_id: 'fac-1',
      subject_code: '22AI31',
      subject_name: 'Foundations of Artificial Intelligence',
      subject_type: 'Theory',
      department: 'AIML',
      semester: 'Sem 3',
      section: 'A',
      academic_term: 'Odd Term 2026-27',
      is_co_teaching: false,
    },
    {
      id: 'alloc-2',
      faculty_id: 'fac-2',
      subject_code: '22AI32',
      subject_name: 'Data Structures & Algorithms in Python',
      subject_type: 'Theory',
      department: 'AIML',
      semester: 'Sem 3',
      section: 'A',
      academic_term: 'Odd Term 2026-27',
      is_co_teaching: false,
    },
    {
      id: 'alloc-3',
      faculty_id: 'fac-3',
      subject_code: '22AI33',
      subject_name: 'Discrete Mathematical Structures',
      subject_type: 'Theory',
      department: 'AIML',
      semester: 'Sem 3',
      section: 'A',
      academic_term: 'Odd Term 2026-27',
      is_co_teaching: false,
    },
    {
      id: 'alloc-4',
      faculty_id: 'fac-5',
      subject_code: '22AIL36',
      subject_name: 'Python & DSA Laboratory',
      subject_type: 'Lab',
      department: 'AIML',
      semester: 'Sem 3',
      section: 'A',
      academic_term: 'Odd Term 2026-27',
      is_co_teaching: true,
    },
    {
      id: 'alloc-5',
      faculty_id: 'fac-4',
      subject_code: '22CS51',
      subject_name: 'Operating Systems & Kernel Design',
      subject_type: 'Theory',
      department: 'CSE',
      semester: 'Sem 5',
      section: 'B',
      academic_term: 'Odd Term 2026-27',
      is_co_teaching: false,
    },
  ],

  timetable: [
    {
      id: 'tt-1',
      faculty_id: 'fac-1',
      allocation_id: 'alloc-1',
      subject_code: '22AI31',
      subject_name: 'Foundations of AI',
      department: 'AIML',
      semester: 'Sem 3',
      section: 'A',
      day_of_week: 'Monday',
      time_slot: '09:00 - 10:00',
      room_no: 'LH-204',
      hours: 4,
    },
    {
      id: 'tt-2',
      faculty_id: 'fac-2',
      allocation_id: 'alloc-2',
      subject_code: '22AI32',
      subject_name: 'DSA in Python',
      department: 'AIML',
      semester: 'Sem 3',
      section: 'A',
      day_of_week: 'Monday',
      time_slot: '10:00 - 11:00',
      room_no: 'LH-204',
      hours: 4,
    },
    {
      id: 'tt-3',
      faculty_id: 'fac-3',
      allocation_id: 'alloc-3',
      subject_code: '22AI33',
      subject_name: 'Discrete Mathematics',
      department: 'AIML',
      semester: 'Sem 3',
      section: 'A',
      day_of_week: 'Tuesday',
      time_slot: '11:15 - 12:15',
      room_no: 'LH-205',
      hours: 4,
    },
    {
      id: 'tt-4',
      faculty_id: 'fac-5',
      allocation_id: 'alloc-4',
      subject_code: '22AIL36',
      subject_name: 'Python & DSA Lab',
      department: 'AIML',
      semester: 'Sem 3',
      section: 'A',
      day_of_week: 'Wednesday',
      time_slot: '02:00 - 04:00',
      room_no: 'AIML-Lab-1',
      hours: 6,
    },
    {
      id: 'tt-5',
      faculty_id: 'fac-4',
      allocation_id: 'alloc-5',
      subject_code: '22CS51',
      subject_name: 'Operating Systems',
      department: 'CSE',
      semester: 'Sem 5',
      section: 'B',
      day_of_week: 'Thursday',
      time_slot: '09:00 - 10:00',
      room_no: 'LH-301',
      hours: 4,
    },
  ],

  attendance: [
    { id: 'att-1', faculty_id: 'fac-1', date: '2026-11-20', check_in: '08:48 AM', check_out: '04:35 PM', status: 'Present' },
    { id: 'att-2', faculty_id: 'fac-2', date: '2026-11-20', check_in: '08:55 AM', check_out: '04:40 PM', status: 'Present' },
    { id: 'att-3', faculty_id: 'fac-3', date: '2026-11-20', check_in: '09:18 AM', check_out: '--', status: 'Late' },
    { id: 'att-4', faculty_id: 'fac-4', date: '2026-11-20', check_in: '--', check_out: '--', status: 'On Leave' },
    { id: 'att-5', faculty_id: 'fac-5', date: '2026-11-20', check_in: '08:50 AM', check_out: '04:30 PM', status: 'Present' },
  ],

  leaves: [
    {
      id: 'lv-1',
      faculty_id: 'fac-4',
      leave_type: 'OD',
      start_date: '2026-11-20',
      end_date: '2026-11-21',
      days: 2,
      balance_remaining: 8,
      reason: 'VTU Board of Examiners (BOE) Question Paper Scrutiny Duty at Belagavi',
      status: 'Approved',
      admin_remark: 'Approved under University On-Duty quota.',
    },
    {
      id: 'lv-2',
      faculty_id: 'fac-3',
      leave_type: 'CL',
      start_date: '2026-11-24',
      end_date: '2026-11-25',
      days: 2,
      balance_remaining: 6,
      reason: 'Attending family function in Mysuru; alternate classes arranged with Prof. Sneha.',
      status: 'Pending',
      admin_remark: '',
    },
    {
      id: 'lv-3',
      faculty_id: 'fac-2',
      leave_type: 'EL',
      start_date: '2026-12-02',
      end_date: '2026-12-04',
      days: 3,
      balance_remaining: 14,
      reason: 'IEEE International AI Conference paper presentation at IISc Bengaluru.',
      status: 'Pending',
      admin_remark: '',
    },
  ],

  audits: [
    {
      id: 'aud-1',
      allocation_id: 'alloc-1',
      syllabus_pct: 84,
      units_completed: '4.2 / 5 Units',
      attendance_regularity: 'Up to Date',
      last_attendance_sync: 'Today, 10:05 AM',
      ia1_status: 'Submitted',
      ia2_status: 'Submitted',
    },
    {
      id: 'aud-2',
      allocation_id: 'alloc-2',
      syllabus_pct: 76,
      units_completed: '3.8 / 5 Units',
      attendance_regularity: 'Up to Date',
      last_attendance_sync: 'Today, 11:02 AM',
      ia1_status: 'Submitted',
      ia2_status: 'In Progress',
    },
    {
      id: 'aud-3',
      allocation_id: 'alloc-3',
      syllabus_pct: 62,
      units_completed: '3.1 / 5 Units',
      attendance_regularity: 'Pending >48 hrs',
      last_attendance_sync: '3 days ago',
      ia1_status: 'Submitted',
      ia2_status: 'Overdue',
    },
    {
      id: 'aud-4',
      allocation_id: 'alloc-4',
      syllabus_pct: 80,
      units_completed: '8 / 10 Lab Programs',
      attendance_regularity: 'Up to Date',
      last_attendance_sync: 'Yesterday, 04:15 PM',
      ia1_status: 'Submitted',
      ia2_status: 'In Progress',
    },
    {
      id: 'aud-5',
      allocation_id: 'alloc-5',
      syllabus_pct: 70,
      units_completed: '3.5 / 5 Units',
      attendance_regularity: 'Pending >48 hrs',
      last_attendance_sync: '4 days ago',
      ia1_status: 'Submitted',
      ia2_status: 'Overdue',
    },
  ],
};

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return structuredClone(SEED_DATA);
    }
    return JSON.parse(raw);
  } catch {
    return structuredClone(SEED_DATA);
  }
}

function writeStore(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
}

async function tryBackendSync(endpoint, method = 'GET', body = null) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const facultyGovernanceApi = {
  async getAll() {
    const remote = await tryBackendSync('/api/admin/faculty/bootstrap');
    if (remote && remote.faculty) {
      writeStore(remote);
      return remote;
    }
    return readStore();
  },

  async saveFaculty(profile) {
    const store = readStore();
    const existsIdx = store.faculty.findIndex((f) => f.id === profile.id);
    if (existsIdx >= 0) {
      store.faculty[existsIdx] = { ...store.faculty[existsIdx], ...profile };
    } else {
      const newProfile = {
        ...profile,
        id: `fac-${Date.now()}`,
        status: profile.status || 'Active',
        system_role: profile.system_role || 'Standard Faculty',
        permissions: profile.permissions || {
          canEditAttendance: true,
          canEditMarks: true,
          canLockMarks: false,
          canApproveStudentLeave: false,
          deptAnalyticsAccess: false,
        },
      };
      store.faculty.unshift(newProfile);
      store.attendance.push({
        id: `att-${Date.now()}`,
        faculty_id: newProfile.id,
        date: '2026-11-20',
        check_in: '--',
        check_out: '--',
        status: 'Present',
      });
    }
    await tryBackendSync('/api/admin/faculty/profiles', 'POST', profile);
    return writeStore(store);
  },

  async toggleFacultyStatus(facultyId) {
    const store = readStore();
    store.faculty = store.faculty.map((f) =>
      f.id === facultyId
        ? { ...f, status: f.status === 'Active' ? 'Deactivated' : 'Active' }
        : f
    );
    await tryBackendSync(`/api/admin/faculty/profiles/${facultyId}/toggle`, 'PATCH');
    return writeStore(store);
  },

  async addAllocation(allocation) {
    const store = readStore();
    const duplicate = store.allocations.find(
      (a) =>
        a.academic_term === allocation.academic_term &&
        a.subject_code.trim().toLowerCase() === allocation.subject_code.trim().toLowerCase() &&
        a.semester === allocation.semester &&
        a.section === allocation.section
    );
    if (duplicate && !allocation.is_co_teaching) {
      const assignedProf = store.faculty.find((f) => f.id === duplicate.faculty_id);
      throw new Error(
        `${allocation.subject_code} (${allocation.semester} - Sec ${allocation.section}) is already assigned to ${
          assignedProf ? assignedProf.full_name : 'another faculty member'
        }. Enable "Co-Teaching / Lab Assistant" to assign a second instructor.`
      );
    }

    const newAlloc = { ...allocation, id: `alloc-${Date.now()}` };
    store.allocations.unshift(newAlloc);
    store.audits.unshift({
      id: `aud-${Date.now()}`,
      allocation_id: newAlloc.id,
      syllabus_pct: 15,
      units_completed: '0.8 / 5 Units',
      attendance_regularity: 'Up to Date',
      last_attendance_sync: 'Just now',
      ia1_status: 'In Progress',
      ia2_status: 'Pending',
    });
    await tryBackendSync('/api/admin/faculty/allocations', 'POST', newAlloc);
    return writeStore(store);
  },

  async deleteAllocation(allocationId) {
    const store = readStore();
    store.allocations = store.allocations.filter((a) => a.id !== allocationId);
    store.audits = store.audits.filter((aud) => aud.allocation_id !== allocationId);
    await tryBackendSync(`/api/admin/faculty/allocations/${allocationId}`, 'DELETE');
    return writeStore(store);
  },

  async addTimetableSlot(slot) {
    const store = readStore();

    const facultyClash = store.timetable.find(
      (t) =>
        t.faculty_id === slot.faculty_id &&
        t.day_of_week === slot.day_of_week &&
        t.time_slot === slot.time_slot
    );
    if (facultyClash) {
      throw new Error(
        `Faculty Clash: Selected professor is already scheduled on ${slot.day_of_week} (${slot.time_slot}) in ${facultyClash.room_no} for ${facultyClash.subject_code}.`
      );
    }

    const roomClash = store.timetable.find(
      (t) =>
        t.room_no.trim().toLowerCase() === slot.room_no.trim().toLowerCase() &&
        t.day_of_week === slot.day_of_week &&
        t.time_slot === slot.time_slot
    );
    if (roomClash) {
      throw new Error(
        `Room Clash: ${slot.room_no} is already occupied on ${slot.day_of_week} (${slot.time_slot}) by ${roomClash.subject_code} (${roomClash.semester} Sec ${roomClash.section}).`
      );
    }

    const classClash = store.timetable.find(
      (t) =>
        t.department === slot.department &&
        t.semester === slot.semester &&
        t.section === slot.section &&
        t.day_of_week === slot.day_of_week &&
        t.time_slot === slot.time_slot
    );
    if (classClash) {
      throw new Error(
        `Class Section Clash: ${slot.department} ${slot.semester} (Sec ${slot.section}) already has ${classClash.subject_code} on ${slot.day_of_week} (${slot.time_slot}).`
      );
    }

    const newSlot = { ...slot, id: `tt-${Date.now()}` };
    store.timetable.push(newSlot);
    await tryBackendSync('/api/admin/faculty/timetable', 'POST', newSlot);
    return writeStore(store);
  },

  async deleteTimetableSlot(slotId) {
    const store = readStore();
    store.timetable = store.timetable.filter((t) => t.id !== slotId);
    await tryBackendSync(`/api/admin/faculty/timetable/${slotId}`, 'DELETE');
    return writeStore(store);
  },

  async updateLeaveStatus(leaveId, decision, remark = '') {
    const store = readStore();
    let targetFacultyId = null;

    store.leaves = store.leaves.map((lv) => {
      if (lv.id === leaveId) {
        targetFacultyId = lv.faculty_id;
        const deducted = decision === 'Approved' ? Math.max(0, lv.balance_remaining - lv.days) : lv.balance_remaining;
        return {
          ...lv,
          status: decision,
          balance_remaining: deducted,
          admin_remark: remark || (decision === 'Approved' ? 'Approved by Admin' : 'Rejected by Admin'),
        };
      }
      return lv;
    });

    if (decision === 'Approved' && targetFacultyId) {
      store.attendance = store.attendance.map((att) =>
        att.faculty_id === targetFacultyId ? { ...att, status: 'On Leave', check_in: '--', check_out: '--' } : att
      );
    }

    await tryBackendSync(`/api/admin/faculty/leaves/${leaveId}`, 'PATCH', { status: decision, admin_remark: remark });
    return writeStore(store);
  },

  async updatePermissions(facultyId, systemRole, permissions) {
    const store = readStore();
    store.faculty = store.faculty.map((f) =>
      f.id === facultyId ? { ...f, system_role: systemRole, permissions } : f
    );
    await tryBackendSync(`/api/admin/faculty/permissions/${facultyId}`, 'PATCH', {
      system_role: systemRole,
      permissions,
    });
    return writeStore(store);
  },
};