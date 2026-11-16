import secrets
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import Base, engine, get_db, SessionLocal
from models import Student, Faculty, Course, InternalMark, User
from schemas import (
    StudentCreate,
    StudentUpdate,
    StudentOut,
    BulkAttendancePayload,
    MarkUpdateItem,
    CourseCreate,
    LoginRequest,
    LoginResponse,
)
from seed import seed_database, hash_password

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NexCampus Engineering University ERP API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "NexCampus ERP"}


@app.post("/api/auth/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    clean_id = payload.identifier.strip()
    user = db.query(User).filter(User.identifier.ilike(clean_id)).first()
    if not user or user.password_hash != hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid Institutional ID/Email or Password")

    return LoginResponse(
        token=secrets.token_hex(24),
        identifier=user.identifier,
        full_name=user.full_name,
        role=user.role,
        department=user.department,
        usn=user.usn,
    )


@app.get("/api/students", response_model=List[StudentOut])
def list_students(db: Session = Depends(get_db)):
    return db.query(Student).order_by(Student.usn.asc()).all()


@app.post("/api/students", response_model=StudentOut)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    if db.query(Student).filter(Student.usn == payload.usn).first():
        raise HTTPException(status_code=400, detail="USN already exists")
    data = payload.model_dump()
    if not data.get("subject_breakdown"):
        dept = data["department"]
        sem = data["semester"]
        att = data["classes_attended"]
        tot = data["total_classes"]
        data["subject_breakdown"] = [
            {"code": f"UE25{dept[:2]}{sem}301", "subject": "Core Engineering I", "attended": att // 3, "total": tot // 3},
            {"code": f"UE25{dept[:2]}{sem}302", "subject": "Core Engineering II", "attended": att // 3, "total": tot // 3},
            {"code": f"UE25{dept[:2]}{sem}303", "subject": "Laboratory Practice", "attended": att - 2 * (att // 3), "total": tot - 2 * (tot // 3)},
        ]
    student = Student(**data)
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@app.put("/api/students/{student_id}", response_model=StudentOut)
def update_student(student_id: int, payload: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in payload.model_dump().items():
        setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return student


@app.delete("/api/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"deleted": True, "id": student_id}


@app.post("/api/attendance/bulk")
def submit_bulk_attendance(payload: BulkAttendancePayload, db: Session = Depends(get_db)):
    updated = 0
    for rec in payload.records:
        student = db.query(Student).filter(Student.usn == rec.usn).first()
        if student:
            student.total_classes += 1
            if rec.status in ("Present", "Late"):
                student.classes_attended += 1
            student.attendance_pct = round(
                (student.classes_attended / student.total_classes) * 100, 1
            )
            updated += 1
    db.commit()
    return {"updated_students": updated, "course_code": payload.course_code}


@app.get("/api/marks")
def list_marks(db: Session = Depends(get_db)):
    return db.query(InternalMark).all()


@app.post("/api/marks/bulk")
def save_bulk_marks(items: List[MarkUpdateItem], db: Session = Depends(get_db)):
    for item in items:
        existing = (
            db.query(InternalMark)
            .filter(
                InternalMark.student_usn == item.student_usn,
                InternalMark.course_code == item.course_code,
            )
            .first()
        )
        if existing:
            existing.ia1 = item.ia1
            existing.ia2 = item.ia2
            existing.lab = item.lab
        else:
            db.add(InternalMark(**item.model_dump()))
    db.commit()
    return {"saved": len(items)}


@app.get("/api/faculty")
def list_faculty(db: Session = Depends(get_db)):
    return db.query(Faculty).all()


@app.get("/api/courses")
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


@app.post("/api/courses")
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(**payload.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course