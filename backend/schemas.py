from pydantic import BaseModel
from typing import List, Optional, Any


class StudentBase(BaseModel):
    usn: str
    full_name: str
    email: str
    phone: str
    department: str
    semester: int
    section: str
    batch: str
    attendance_pct: float
    classes_attended: int = 64
    total_classes: int = 80
    cgpa: float
    fee_status: str
    fee_due: int = 0
    guardian_contact: str
    subject_breakdown: Optional[List[Any]] = []


class StudentCreate(StudentBase):
    pass


class StudentUpdate(StudentBase):
    pass


class StudentOut(StudentBase):
    id: int

    class Config:
        from_attributes = True


class AttendanceRecord(BaseModel):
    usn: str
    status: str  # Present, Absent, Late


class BulkAttendancePayload(BaseModel):
    course_code: str
    date: str
    records: List[AttendanceRecord]


class MarkUpdateItem(BaseModel):
    student_usn: str
    student_name: str
    course_code: str
    ia1: float
    ia2: float
    lab: float


class CourseCreate(BaseModel):
    code: str
    title: str
    department: str
    semester: int
    credits: int
    faculty_id: int
    faculty_name: str


class LoginRequest(BaseModel):
    identifier: str
    password: str
    role: Optional[str] = "Admin"


class LoginResponse(BaseModel):
    token: str
    identifier: str
    full_name: str
    role: str
    department: str
    usn: Optional[str] = None