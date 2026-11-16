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
  AUTH: 'nexcampus_auth_session_v1'
};

const DEMO_USERS = [
  {
    identifier: 'admin@nexcampus.edu.in',
    password: 'Password@123',
    altPassword: 'Admin@123',
    full_name: 'Dr. Vishwanath Deshpande (Registrar)',
    role: 'Admin',
    department: 'Administration',
    usn: null
  },
  {
    identifier: 'r.kulkarni@nexcampus.edu.in',
    password: 'Password@123',
    altPassword: 'Faculty@123',
    full_name: 'Dr. Raghavendra Kulkarni',
    role: 'Faculty',
    department: 'AIML',
    usn: null
  },
  {
    identifier: '4GM25AI001',
    password: 'Password@123',
    altPassword: 'Student@123',
    full_name: 'Aarav Sharma',
    role: 'Student',
    department: 'AIML',
    usn: '4GM25AI001'
  },
  {
    identifier: '4GM25AI002',
    password: 'Password@123',
    altPassword: 'Student@123',
    full_name: 'Diya Nair',
    role: 'Student',
    department: 'AIML',
    usn: '4GM25AI002'
  }
];

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
  async login(identifier, password) {
    const clean = identifier.trim();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: clean, password })
      });
      if (res.ok) {
        const session = await res.json();
        localStorage.setItem(KEYS.AUTH, JSON.stringify(session));
        return session;
      }
      if (res.status === 401) {
        throw new Error('Invalid Institutional Email/USN or Password.');
      }
    } catch (err) {
      if (err.message.includes('Invalid')) throw err;
    }

    const match = DEMO_USERS.find(
      (u) =>
        u.identifier.toLowerCase() === clean.toLowerCase() &&
        (u.altPassword === password || u.password === password)
    );
    if (!match) {
      throw new Error('Invalid Institutional Email/USN or Password.');
    }
    const session = {
      token: 'local_' + Date.now(),
      identifier: match.identifier,
      full_name: match.full_name,
      role: match.role,
      department: match.department,
      usn: match.usn
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