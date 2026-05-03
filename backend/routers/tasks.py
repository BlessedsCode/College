from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from database import get_db
from auth import get_current_user
import models

router = APIRouter()


# --- Schemas ---
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    completed: bool
    created_at: datetime
    owner_id: int

    model_config = {"from_attributes": True}


# --- Routes ---
@router.get("/", response_model=list[TaskOut])
def get_tasks(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task_data: TaskCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = models.Task(
        title=task_data.title,
        description=task_data.description,
        owner_id=current_user.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task_data: TaskUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for field, value in task_data.model_dump(exclude_none=True).items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
