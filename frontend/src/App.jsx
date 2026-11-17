import React, { useState, useEffect } from 'react';
import { erpApi } from './services/api';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import CommandSearchModal from './components/CommandSearchModal';
import Student360Modal from './components/Student360Modal';
import Toast from './components/Toast';
import DashboardView from './views/DashboardView';
import StudentDirectoryView from './views/StudentDirectoryView';
import FacultyWorkspaceView from './views/FacultyWorkspaceView';
import CoursesFacultyView from './views/CoursesFacultyView';
import StudentPortalView from './views/StudentPortalView';

export default function App() {
  const [user, setUser] = useState(() => erpApi.getSession());
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [role, setRole] = useState(() => erpApi.getSession()?.role || 'Admin');
  const [activeTab, setActiveTab] = useState(() => {
    const initialRole = erpApi.getSession()?.role;
    if (initialRole === 'Student') return 'student-portal';
    if (initialRole === 'Faculty') return 'faculty-workspace';
    return 'dashboard';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState([]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3600);
  };

  useEffect(() => {
    erpApi.loadInitialState().then((data) => {
      setBackendOnline(data.backendOnline);
      setStudents(data.students);
      setFaculty(data.faculty);
      setCourses(data.courses);
      setMarks(data.marks);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

 const handleLogin = async (identifier, password, selectedRole) => {
    const session = await erpApi.login(identifier, password, selectedRole);
    setUser(session);
    setRole(session.role);
    if (session.role === 'Student') setActiveTab('student-portal');
    else if (session.role === 'Faculty') setActiveTab('faculty-workspace');
    else setActiveTab('dashboard');
    notify(`Welcome, ${session.full_name}`);
  };

  const handleLogout = () => {
    erpApi.logout();
    setUser(null);
  };

 if (!user) {
  return <LoginPage onLogin={handleLogin} students={students} />;
}
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'Student') setActiveTab('student-portal');
    else if (newRole === 'Faculty') setActiveTab('faculty-workspace');
    else setActiveTab('dashboard');
    notify(`Switched workspace to ${newRole} Mode`);
  };

  const handleAddStudent = async (studentData) => {
    const created = await erpApi.createStudent(studentData);
    setStudents((prev) => [created, ...prev]);
    notify(`Enrolled ${created.full_name} (${created.usn})`);
  };

  const handleUpdateStudent = async (id, studentData) => {
    const updated = await erpApi.updateStudent(id, studentData);
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    notify(`Updated record for ${updated.full_name}`);
  };

  const handleDeleteStudent = async (stu) => {
    await erpApi.deleteStudent(stu.id);
    setStudents((prev) => prev.filter((s) => s.id !== stu.id));
    notify(`Removed ${stu.full_name} (${stu.usn})`, 'warning');
  };

  const handleBulkAttendance = async (payload) => {
    const updatedStudents = await erpApi.submitBulkAttendance(payload);
    setStudents(updatedStudents);
    notify(`Attendance submitted for ${payload.course_code} — percentages recalculated.`);
  };

  const handleSaveMarks = async (items) => {
    const updatedMarks = await erpApi.saveBulkMarks(items);
    setMarks(updatedMarks);
    notify(`Saved CIE Internal Marks for ${items.length} students.`);
  };

  const handleAddCourse = async (courseData) => {
    const created = await erpApi.createCourse(courseData);
    setCourses((prev) => [...prev, created]);
    notify(`Allocated ${created.code} (${created.title}) to ${created.faculty_name}`);
  };

  const shortageStudents = students.filter((s) => s.attendance_pct < 75);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        role={role}
        backendOnline={backendOnline}
      />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} pl-20`}>
        <Topbar
          role={role}
          setRole={handleRoleChange}
          user={user}
          onLogout={handleLogout}
          onOpenSearch={() => setSearchOpen(true)}
          shortageStudents={shortageStudents}
          onSelectStudent={(stu) => setSelectedStudent(stu)}
        />

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 w-64 animate-pulse rounded-xl bg-white/5" />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-28 animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
              <div className="h-80 animate-pulse rounded-2xl bg-white/5" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  students={students}
                  onNotify={notify}
                  onSelectStudent={(stu) => setSelectedStudent(stu)}
                />
              )}
              {activeTab === 'students' && (
                <StudentDirectoryView
                  students={students}
                  role={role}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onSelectStudent={(stu) => setSelectedStudent(stu)}
                  onNotify={notify}
                />
              )}
              {activeTab === 'faculty-workspace' && (
                <FacultyWorkspaceView
                  students={students}
                  courses={courses}
                  marks={marks}
                  onSubmitAttendance={handleBulkAttendance}
                  onSaveMarks={handleSaveMarks}
                />
              )}
              {activeTab === 'courses' && (
                <CoursesFacultyView
                  courses={courses}
                  faculty={faculty}
                  role={role}
                  onAddCourse={handleAddCourse}
                />
              )}
              {activeTab === 'student-portal' && (
                <StudentPortalView
                  students={students}
                  marks={marks}
                  onNotify={notify}
                  defaultUsn={user?.usn}
                />
              )}
            </>
          )}
        </main>
      </div>

      <CommandSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        students={students}
        courses={courses}
        onSelectStudent={(stu) => setSelectedStudent(stu)}
      />

      <Student360Modal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}