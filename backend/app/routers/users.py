from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.db import get_session
from app.models import UserInDB
from app.utils import get_db_user, pwd_context


router = APIRouter(prefix="/users")


@router.post("/register")
async def register(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session),
) -> UserInDB:
    if get_db_user(form_data.username, session) is not None:
        raise HTTPException(status_code=409, detail="Username already exists")
    new_db_user = UserInDB(
        username=form_data.username,
        hashed_password=pwd_context.hash(form_data.password),
    )
    session.add(new_db_user)
    session.commit()
    session.refresh(new_db_user)

    return new_db_user
