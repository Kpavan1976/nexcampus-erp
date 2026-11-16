from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    identifier = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # Admin, Faculty, Student
    department = Column(String, default="Administration")
    usn = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    usn = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    department = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)
    section = Column(String, nullable=False)
    batch = Column(String, nullable=False)
    attendance_pct = Column(Float, default=80.0)
    classes_attended = Column(Integer, default=64)
    total_classes = Column(Integer, default=80)
    cgpa = Column(Float, default=8.0)
    fee_status = Column(String, default="Paid")
    fee_due = Column(Integer, default=0)
    guardian_contact = Column(String, nullable=False)
    subject_breakdown = Column(JSON, default=list)


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    faculty_code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    department = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    department = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)
    credits = Column(Integer, nullable=False)
    faculty_id = Column(Integer, ForeignKey("faculty.id"))
    faculty_name = Column(String, nullable=False)


class InternalMark(Base):
    __tablename__ = "internal_marks"

    id = Column(Integer, primary_key=True, index=True)
    student_usn = Column(String, index=True, nullable=False)
    student_name = Column(String, nullable=False)
    course_code = Column(String, index=True, nullable=False)
    ia1 = Column(Float, default=0.0)
    ia2 = Column(Float, default=0.0)
    lab = Column(Float, default=0.0)