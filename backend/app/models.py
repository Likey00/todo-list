from pydantic import BaseModel
from sqlmodel import Field, SQLModel, Relationship


class UserInDB(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    hashed_password: str
    todos: list["TodoInDB"] = Relationship(back_populates="user")


class Todo(SQLModel):
    title: str


class TodoInDB(Todo, table=True):
    id: int | None = Field(default=None, primary_key=True)
    completed: bool = False
    user_id: int = Field(foreign_key="userindb.id")
    user: UserInDB = Relationship(back_populates="todos")


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserInDB
