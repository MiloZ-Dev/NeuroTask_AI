from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from core.database import SessionLocal
from models.task import Task, TaskStatus
from schemas.task import TaskCreate, TaskUpdate, TaskRead, TaskStatusUpdate
from services.ai_service import generate_task_description, summarize_pending_tasks, suggest_priorities
from typing import List

router = APIRouter()

# dependency for DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/",)
def say_hello():
    return {"message": "Hello, this is the Task Router!"}

# Get all tasks 
@router.get("/Task", response_model=List[TaskRead])
def read_task(status: TaskStatus = Query(None), db: Session = Depends(get_db)):
    if status:
        tasks = db.query(Task).filter(Task.status == status).all()
    else:
        tasks = db.query(Task).all()
    return tasks

# Summarize pending tasks with AI
@router.get("/Task/summary")
def task_summary(db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.status != "completed").all()
    summary = summarize_pending_tasks(tasks)
    return {"summary": summary}

# Suggest task priorities with AI 
@router.get("/Task/suggest_priorities")
def suggest_task_priorities(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    priorities = suggest_priorities(tasks)
    return {"priorities": priorities}

#  Create a new task
@router.post("/Task", response_model=TaskRead)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


# Autocomplete task description using AI
@router.post("/Task/autocomplete")
def autocomplete_task_description(title: str):
    description = generate_task_description(title)
    return {"title": title, "description": description}


# Update a task
@router.put("/Task/{task_id}", response_model=TaskRead)
def update_task(task_id: str, task_update: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.status is not None:
        task.status = task_update.status
    
    db.commit()
    db.refresh(task)
    return task

# Update task status
@router.put("/Task/{task_id}/status", response_model=TaskRead)
def update_task_status(task_id: str, task_status_update: TaskStatusUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task_status_update.status is not None:
        task.status = task_status_update.status
    
    task.status = task_status_update.status
    db.commit()
    db.refresh(task)
    return task

# Delete a task
@router.delete("/Task/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted successfully"}