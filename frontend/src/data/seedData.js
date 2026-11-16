export const INITIAL_FACULTY = [
  { id: 1, faculty_code: 'FAC101', name: 'Dr. Raghavendra Kulkarni', designation: 'Professor & HOD', department: 'AIML', email: 'r.kulkarni@nexcampus.edu.in', phone: '+91 98451 22101' },
  { id: 2, faculty_code: 'FAC102', name: 'Dr. Ananya Deshpande', designation: 'Associate Professor', department: 'CSE', email: 'a.deshpande@nexcampus.edu.in', phone: '+91 98451 22102' },
  { id: 3, faculty_code: 'FAC103', name: 'Prof. Vikramaditya Rao', designation: 'Assistant Professor', department: 'CSE', email: 'v.rao@nexcampus.edu.in', phone: '+91 98451 22103' },
  { id: 4, faculty_code: 'FAC104', name: 'Dr. Meenakshi Sundaram', designation: 'Professor', department: 'ECE', email: 'm.sundaram@nexcampus.edu.in', phone: '+91 98451 22104' },
  { id: 5, faculty_code: 'FAC105', name: 'Prof. Karthikeya Hegde', designation: 'Associate Professor', department: 'ME', email: 'k.hegde@nexcampus.edu.in', phone: '+91 98451 22105' },
  { id: 6, faculty_code: 'FAC106', name: 'Dr. Shweta Prabhu', designation: 'Assistant Professor', department: 'AIML', email: 's.prabhu@nexcampus.edu.in', phone: '+91 98451 22106' }
];

export const INITIAL_COURSES = [
  { id: 1, code: 'UE25AI3301', title: 'Python for AIML', department: 'AIML', semester: 3, credits: 4, faculty_id: 1, faculty_name: 'Dr. Raghavendra Kulkarni' },
  { id: 2, code: 'UE25CS3302', title: 'Discrete Structures', department: 'CSE', semester: 3, credits: 4, faculty_id: 2, faculty_name: 'Dr. Ananya Deshpande' },
  { id: 3, code: 'UE25CS5301', title: 'Operating Systems', department: 'CSE', semester: 5, credits: 4, faculty_id: 3, faculty_name: 'Prof. Vikramaditya Rao' },
  { id: 4, code: 'UE25AI5302', title: 'Deep Neural Networks', department: 'AIML', semester: 5, credits: 4, faculty_id: 6, faculty_name: 'Dr. Shweta Prabhu' },
  { id: 5, code: 'UE25EC4301', title: 'Digital Signal Processing', department: 'ECE', semester: 4, credits: 4, faculty_id: 4, faculty_name: 'Dr. Meenakshi Sundaram' },
  { id: 6, code: 'UE25ME6301', title: 'Thermodynamics & Heat Transfer', department: 'ME', semester: 6, credits: 3, faculty_id: 5, faculty_name: 'Prof. Karthikeya Hegde' },
  { id: 7, code: 'UE25CS1301', title: 'Problem Solving with C', department: 'CSE', semester: 1, credits: 4, faculty_id: 3, faculty_name: 'Prof. Vikramaditya Rao' },
  { id: 8, code: 'UE25AI7301', title: 'Reinforcement Learning', department: 'AIML', semester: 7, credits: 3, faculty_id: 1, faculty_name: 'Dr. Raghavendra Kulkarni' }
];

const RAW_STUDENTS = [
  ['4GM25AI001', 'Aarav Sharma', 'aarav.sharma@nexcampus.edu.in', '+91 99001 10001', 'AIML', 3, 'A', '2025-2029', 68, 80, 8.92, 'Paid', 0, '+91 94481 10001'],
  ['4GM25AI002', 'Diya Nair', 'diya.nair@nexcampus.edu.in', '+91 99001 10002', 'AIML', 3, 'A', '2025-2029', 54, 80, 7.64, 'Pending', 45000, '+91 94481 10002'],
  ['4GM25AI003', 'Rohan Kulkarni', 'rohan.k@nexcampus.edu.in', '+91 99001 10003', 'AIML', 3, 'A', '2025-2029', 74, 80, 9.18, 'Paid', 0, '+91 94481 10003'],
  ['4GM24AI014', 'Sneha Patil', 'sneha.patil@nexcampus.edu.in', '+91 99001 10004', 'AIML', 5, 'A', '2024-2028', 52, 80, 7.21, 'Partial', 22500, '+91 94481 10004'],
  ['4GM24AI019', 'Karthik Gowda', 'karthik.g@nexcampus.edu.in', '+91 99001 10005', 'AIML', 5, 'B', '2024-2028', 71, 80, 8.75, 'Paid', 0, '+91 94481 10005'],
  ['4GM23AI027', 'Ananya Joshi', 'ananya.joshi@nexcampus.edu.in', '+91 99001 10006', 'AIML', 7, 'A', '2023-2027', 76, 80, 9.45, 'Paid', 0, '+91 94481 10006'],
  ['4GM25CS004', 'Siddharth Verma', 'siddharth.v@nexcampus.edu.in', '+91 99001 10007', 'CSE', 3, 'A', '2025-2029', 64, 80, 8.34, 'Paid', 0, '+91 94481 10007'],
  ['4GM25CS009', 'Kavya Hegde', 'kavya.hegde@nexcampus.edu.in', '+91 99001 10008', 'CSE', 3, 'B', '2025-2029', 56, 80, 7.88, 'Pending', 52000, '+91 94481 10008'],
  ['4GM24CS012', 'Pranav Deshmukh', 'pranav.d@nexcampus.edu.in', '+91 99001 10009', 'CSE', 5, 'A', '2024-2028', 72, 80, 8.95, 'Paid', 0, '+91 94481 10009'],
  ['4GM24CS018', 'Meghana Bhat', 'meghana.bhat@nexcampus.edu.in', '+91 99001 10010', 'CSE', 5, 'A', '2024-2028', 49, 80, 6.95, 'Pending', 52000, '+91 94481 10010'],
  ['4GM24CS025', 'Aditya Menon', 'aditya.menon@nexcampus.edu.in', '+91 99001 10011', 'CSE', 5, 'B', '2024-2028', 66, 80, 8.12, 'Partial', 18000, '+91 94481 10011'],
  ['4GM26CS001', 'Nandini Rao', 'nandini.rao@nexcampus.edu.in', '+91 99001 10012', 'CSE', 1, 'A', '2026-2030', 75, 80, 9.05, 'Paid', 0, '+91 94481 10012'],
  ['4GM26CS008', 'Vikram Shetty', 'vikram.shetty@nexcampus.edu.in', '+91 99001 10013', 'CSE', 1, 'B', '2026-2030', 62, 80, 7.90, 'Paid', 0, '+91 94481 10013'],
  ['4GM23CS031', 'Pooja Kamath', 'pooja.kamath@nexcampus.edu.in', '+91 99001 10014', 'CSE', 7, 'A', '2023-2027', 70, 80, 8.68, 'Paid', 0, '+91 94481 10014'],
  ['4GM25EC003', 'Harsha Vardhan', 'harsha.v@nexcampus.edu.in', '+91 99001 10015', 'ECE', 4, 'A', '2025-2029', 55, 80, 7.42, 'Partial', 25000, '+91 94481 10015'],
  ['4GM25EC011', 'Shreya Iyer', 'shreya.iyer@nexcampus.edu.in', '+91 99001 10016', 'ECE', 4, 'A', '2025-2029', 73, 80, 9.10, 'Paid', 0, '+91 94481 10016'],
  ['4GM24EC015', 'Nikhil Reddy', 'nikhil.reddy@nexcampus.edu.in', '+91 99001 10017', 'ECE', 6, 'B', '2024-2028', 65, 80, 8.04, 'Paid', 0, '+91 94481 10017'],
  ['4GM24EC022', 'Tanvi Kulkarni', 'tanvi.k@nexcampus.edu.in', '+91 99001 10018', 'ECE', 6, 'A', '2024-2028', 51, 80, 7.15, 'Pending', 48000, '+91 94481 10018'],
  ['4GM26EC005', 'Abhishek Mishra', 'abhishek.m@nexcampus.edu.in', '+91 99001 10019', 'ECE', 2, 'A', '2026-2030', 69, 80, 8.40, 'Paid', 0, '+91 94481 10019'],
  ['4GM24ME004', 'Suresh Naik', 'suresh.naik@nexcampus.edu.in', '+91 99001 10020', 'ME', 6, 'A', '2024-2028', 53, 80, 7.08, 'Pending', 40000, '+91 94481 10020'],
  ['4GM24ME012', 'Divya Prakash', 'divya.p@nexcampus.edu.in', '+91 99001 10021', 'ME', 6, 'A', '2024-2028', 67, 80, 8.25, 'Paid', 0, '+91 94481 10021'],
  ['4GM25ME007', 'Tejaswini Angadi', 'tejaswini.a@nexcampus.edu.in', '+91 99001 10022', 'ME', 4, 'B', '2025-2029', 71, 80, 8.55, 'Paid', 0, '+91 94481 10022'],
  ['4GM23ME019', 'Manjunath Hiremath', 'manjunath.h@nexcampus.edu.in', '+91 99001 10023', 'ME', 7, 'A', '2023-2027', 63, 80, 7.95, 'Partial', 15000, '+91 94481 10023'],
  ['4GM25AI018', 'Varun Acharya', 'varun.acharya@nexcampus.edu.in', '+91 99001 10024', 'AIML', 3, 'B', '2025-2029', 57, 80, 7.50, 'Pending', 45000, '+91 94481 10024'],
  ['4GM25CS021', 'Ishita Chatterjee', 'ishita.c@nexcampus.edu.in', '+91 99001 10025', 'CSE', 3, 'A', '2025-2029', 77, 80, 9.52, 'Paid', 0, '+91 94481 10025'],
  ['4GM24AI029', 'Darshan Gowda', 'darshan.g@nexcampus.edu.in', '+91 99001 10026', 'AIML', 5, 'B', '2024-2028', 61, 80, 8.11, 'Paid', 0, '+91 94481 10026']
];

export const INITIAL_STUDENTS = RAW_STUDENTS.map((s, idx) => {
  const [usn, full_name, email, phone, department, semester, section, batch, classes_attended, total_classes, cgpa, fee_status, fee_due, guardian_contact] = s;
  const attendance_pct = Number(((classes_attended / total_classes) * 100).toFixed(1));
  return {
    id: idx + 1,
    usn,
    full_name,
    email,
    phone,
    department,
    semester,
    section,
    batch,
    classes_attended,
    total_classes,
    attendance_pct,
    cgpa,
    fee_status,
    fee_due,
    guardian_contact,
    subject_breakdown: [
      { code: `UE25${department.slice(0, 2)}${semester}301`, subject: 'Core Theory I', attended: Math.floor(classes_attended / 3), total: Math.floor(total_classes / 3) },
      { code: `UE25${department.slice(0, 2)}${semester}302`, subject: 'Applied Systems', attended: Math.floor(classes_attended / 3), total: Math.floor(total_classes / 3) },
      { code: `UE25${department.slice(0, 2)}${semester}303`, subject: 'Integrated Lab', attended: classes_attended - 2 * Math.floor(classes_attended / 3), total: total_classes - 2 * Math.floor(total_classes / 3) }
    ]
  };
});

export const INITIAL_MARKS = [
  { id: 1, student_usn: '4GM25AI001', student_name: 'Aarav Sharma', course_code: 'UE25AI3301', ia1: 18, ia2: 19, lab: 9 },
  { id: 2, student_usn: '4GM25AI002', student_name: 'Diya Nair', course_code: 'UE25AI3301', ia1: 11, ia2: 10, lab: 6 },
  { id: 3, student_usn: '4GM25AI003', student_name: 'Rohan Kulkarni', course_code: 'UE25AI3301', ia1: 19, ia2: 18, lab: 10 },
  { id: 4, student_usn: '4GM25AI018', student_name: 'Varun Acharya', course_code: 'UE25AI3301', ia1: 9, ia2: 11, lab: 5 },
  { id: 5, student_usn: '4GM25CS004', student_name: 'Siddharth Verma', course_code: 'UE25CS3302', ia1: 16, ia2: 17, lab: 8 },
  { id: 6, student_usn: '4GM25CS009', student_name: 'Kavya Hegde', course_code: 'UE25CS3302', ia1: 12, ia2: 13, lab: 7 },
  { id: 7, student_usn: '4GM25CS021', student_name: 'Ishita Chatterjee', course_code: 'UE25CS3302', ia1: 20, ia2: 19, lab: 10 },
  { id: 8, student_usn: '4GM24CS012', student_name: 'Pranav Deshmukh', course_code: 'UE25CS5301', ia1: 17, ia2: 18, lab: 9 },
  { id: 9, student_usn: '4GM24CS018', student_name: 'Meghana Bhat', course_code: 'UE25CS5301', ia1: 8, ia2: 10, lab: 6 },
  { id: 10, student_usn: '4GM24CS025', student_name: 'Aditya Menon', course_code: 'UE25CS5301', ia1: 15, ia2: 14, lab: 8 }
];

export const MONTHLY_ATTENDANCE_TREND = [
  { month: 'Jun', attendance: 84.2, target: 75 },
  { month: 'Jul', attendance: 82.8, target: 75 },
  { month: 'Aug', attendance: 80.5, target: 75 },
  { month: 'Sep', attendance: 79.1, target: 75 },
  { month: 'Oct', attendance: 77.6, target: 75 },
  { month: 'Nov', attendance: 79.4, target: 75 }
];