from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.db import get_session
from app.models import Todo, TodoInDB, UserInDB
from app.utils import get_current_user_id


router = APIRouter(prefix="/todos")


@router.get("/")
async def get_todos(
    user_id: Annotated[int, Depends(get_current_user_id)],
    session: Session = Depends(get_session),
) -> list[TodoInDB]:
    todos = session.get(UserInDB, user_id).todos
    return sorted(todos, key=lambda todo: todo.id)


@router.post("/")
async def add_todo(
    todo: Todo,
    user_id: Annotated[int, Depends(get_current_user_id)],
    session: Session = Depends(get_session),
) -> TodoInDB:
    todo_in_db = TodoInDB(title=todo.title, user_id=user_id)
    session.add(todo_in_db)
    session.commit()
    session.refresh(todo_in_db)
    return todo_in_db


@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: int,
    user_id: Annotated[int, Depends(get_current_user_id)],
    session: Session = Depends(get_session),
) -> TodoInDB:
    todo_in_db = session.get(TodoInDB, todo_id)
    if not todo_in_db:
        raise HTTPException(status_code=404, detail="Todo doesn't exist!")
    if todo_in_db.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not your todo!")
    session.delete(todo_in_db)
    session.commit()
    return todo_in_db


@router.put("/{todo_id}")
async def toggle_todo(
    todo_id: int,
    user_id: Annotated[int, Depends(get_current_user_id)],
    session: Session = Depends(get_session),
) -> TodoInDB:
    todo = session.get(TodoInDB, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo doesn't exist!")
    if todo.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not your todo!")
    todo.completed = not todo.completed
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo
