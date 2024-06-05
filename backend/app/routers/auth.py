from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.models import Token, UserInDB
from app.utils import (
    authenticate_user,
    create_access_token,
    get_current_user_id,
)
from app.db import get_session


router = APIRouter(prefix="/auth")


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session),
) -> Token:
    user = authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer", user=user)


@router.get("/verify-token")
async def verify_access_token(
    user_id: Annotated[int, Depends(get_current_user_id)],
    session: Session = Depends(get_session),
) -> UserInDB:
    return session.get(UserInDB, user_id)
