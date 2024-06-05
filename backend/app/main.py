from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import engine, SQLModel

from app.routers import auth, users, todos

origins = ["https://likey-todos.netlify.app"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(todos.router)


SQLModel.metadata.create_all(engine)
