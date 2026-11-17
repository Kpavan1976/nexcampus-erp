import {
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_COURSES,
  INITIAL_MARKS
} from '../data/seedData';

const API_BASE = 'http://localhost:8000/api';

const KEYS = {
  STUDENTS: 'nexcampus_students_v1',
  FACULTY: 'nexcampus_faculty_v1',
  COURSES: 'nexcampus_courses_v1',
  MARKS: 'nexcampus_marks_v1',
  AUTH: 'nexcampus_auth_session_v1',
  USERS: 'nexcampus_registered_users_v1'
};

function readLocal(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

async function tryFetch(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1400);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export const erpApi = {
  async login(identifier, password, role = 'Admin') {
    const clean = identifier.trim();
    if (!clean || password.trim().length < 4) {
      throw new Error('Please enter a valid Email/USN and a password (at least 4 characters).');
    }

    // 1. Try FastAPI + SQLite authentication first
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: clean, password, role })
      });

      if (res.ok) {
        const session = await res.json();
        // Mirror registered account locally for offline consistency
        const localUsers = readLocal(KEYS.USERS, []);
        if (!localUsers.some((u) => u.identifier.toLowerCase() === clean.toLowerCase())) {
          writeLocal(KEYS.USERS, [
            ...localUsers,
            {
              identifier: session.identifier,
              password,
              full_name: session.full_name,
              role: session.role,
              department: session.department,
              usn: session.usn
            }
          ]);
        }
        localStorage.setItem(KEYS.AUTH, JSON.stringify(session));
        return session;
      }

      if (res.status === 401 || res.status === 400) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.detail ||
            'This email/ID already exists. Incorrect password — enter the password you registered with.'
        );
      }
    } catch (err) {
      if (
        err.message.includes('already exists') ||
        err.message.includes('Incorrect password') ||
        err.message.includes('at least 4')
      ) {
        throw err;
      }
      // Network error only: fall through to localStorage registry
    }

    // 2. Offline / LocalStorage Register-Once, Verify-Always Registry
    const registeredUsers = readLocal(KEYS.USERS, []);
    const existing = registeredUsers.find(
      (u) => u.identifier.toLowerCase() === clean.toLowerCase()
    );

    if (existing) {
      if (existing.password !== password) {
        throw new Error(
          'This email/ID already exists. Incorrect password — enter the password you registered with.'
        );
      }
      const session = {
        token: 'session_' + Date.now(),
        identifier: existing.identifier,
        full_name: existing.full_name,
        role: existing.role,
        department: existing.department,
        usn: existing.usn
      };
      localStorage.setItem(KEYS.AUTH, JSON.stringify(session));
      return session;
    }

    // First-time registration in localStorage
    const displayName = clean.includes('@')
      ? clean.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : clean.toUpperCase();

    const newAccount = {
      identifier: clean,
      password,
      full_name: displayName,
      role,
      department: role === 'Admin' ? 'Administration' : 'AIML',
      usn: null
    };
    writeLocal(KEYS.USERS, [...registeredUsers, newAccount]);

    const session = {
      token: 'session_' + Date.now(),
      identifier: newAccount.identifier,
      full_name: newAccount.full_name,
      role: newAccount.role,
      department: newAccount.department,
      usn: newAccount.usn
    };
    localStorage.setItem(KEYS.AUTH, JSON.stringify(session));
    return session;
  },

  getSession() {
    try {
      const raw = localStorage.getItem(KEYS.AUTH);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(KEYS.AUTH);
  },

  async loadInitialState() {
    const remoteStudents = await tryFetch('/students');
    if (remoteStudents) {
      const [faculty, courses, marks] = await Promise.all([
        tryFetch('/faculty'),
        tryFetch('/courses'),
        tryFetch('/marks')
      ]);
      writeLocal(KEYS.STUDENTS, remoteStudents);
      if (faculty) writeLocal(KEYS.FACULTY, faculty);
      if (courses) writeLocal(KEYS.COURSES, courses);
      if (marks) writeLocal(KEYS.MARKS, marks);
      return {
        backendOnline: true,
        students: remoteStudents,
        faculty: faculty || INITIAL_FACULTY,
        courses: courses || INITIAL_COURSES,
        marks: marks || INITIAL_MARKS
      };
    }

    return {
      backendOnline: false,
      students: readLocal(KEYS.STUDENTS, INITIAL_STUDENTS),
      faculty: readLocal(KEYS.FACULTY, INITIAL_FACULTY),
      courses: readLocal(KEYS.COURSES, INITIAL_COURSES),
      marks: readLocal(KEYS.MARKS, INITIAL_MARKS)
    };
  },

  async createStudent(studentData) {
    const remote = await tryFetch('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
    const current = readLocal(KEYS.STUDENTS, INITIAL_STUDENTS);
    const created = remote || {
      ...studentData,
      id: Date.now(),
      subject_breakdown: [
        { code: `UE25${studentData.department.slice(0, 2)}${studentData.semester}301`, subject: 'Core Theory I', attended: Math.floor(studentData.classes_attended / 3), total: Math.floor(studentData.total_classes / 3) },
        { code: `UE25${studentData.department.slice(0, 2)}${studentData.semester}302`, subject: 'Applied Systems', attended: Math.floor(studentData.classes_attended / 3), total: Math.floor(studentData.total_classes / 3) },
        { code: `UE25${studentData.department.slice(0, 2)}${studentData.semester}303`, subject: 'Integrated Lab', attended: studentData.classes_attended - 2 * Math.floor(studentData.classes_attended / 3), total: studentData.total_classes - 2 * Math.floor(studentData.total_classes / 3) }
      ]
    };
    const next = [created, ...current];
    writeLocal(KEYS.STUDENTS, next);
    return created;
  },

  async updateStudent(id, studentData) {
    const remote = await tryFetch(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
    const current = readLocal(KEYS.STUDENTS, INITIAL_STUDENTS);
    const updatedItem = remote || { ...studentData, id };
    const next = current.map((s) => (s.id === id ? updatedItem : s));
    writeLocal(KEYS.STUDENTS, next);
    return updatedItem;
  },

  async deleteStudent(id) {
    await tryFetch(`/students/${id}`, { method: 'DELETE' });
    const current = readLocal(KEYS.STUDENTS, INITIAL_STUDENTS);
    const next = current.filter((s) => s.id !== id);
    writeLocal(KEYS.STUDENTS, next);
    return id;
  },

  async submitBulkAttendance(payload) {
    await tryFetch('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const current = readLocal(KEYS.STUDENTS, INITIAL_STUDENTS);
    const statusMap = new Map(payload.records.map((r) => [r.usn, r.status]));
    const next = current.map((stu) => {
      const status = statusMap.get(stu.usn);
      if (!status) return stu;
      const total_classes = (stu.total_classes || 80) + 1;
      const classes_attended =
        (stu.classes_attended || 60) + (status === 'Present' || status === 'Late' ? 1 : 0);
      const attendance_pct = Number(((classes_attended / total_classes) * 100).toFixed(1));
      return { ...stu, total_classes, classes_attended, attendance_pct };
    });
    writeLocal(KEYS.STUDENTS, next);
    return next;
  },

  async saveBulkMarks(items) {
    await tryFetch('/marks/bulk', {
      method: 'POST',
      body: JSON.stringify(items)
    });
    const current = readLocal(KEYS.MARKS, INITIAL_MARKS);
    const merged = [...current];
    items.forEach((item) => {
      const idx = merged.findIndex(
        (m) => m.student_usn === item.student_usn && m.course_code === item.course_code
      );
      if (idx >= 0) {
        merged[idx] = { ...merged[idx], ...item };
      } else {
        merged.push({ id: Date.now() + Math.random(), ...item });
      }
    });
    writeLocal(KEYS.MARKS, merged);
    return merged;
  },

  async createCourse(courseData) {
    const remote = await tryFetch('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
    const current = readLocal(KEYS.COURSES, INITIAL_COURSES);
    const created = remote || { id: Date.now(), ...courseData };
    const next = [...current, created];
    writeLocal(KEYS.COURSES, next);
    return created;
  }
};