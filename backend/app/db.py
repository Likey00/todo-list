from sqlmodel import Session, create_engine
from sqlmodel import SQLModel
from sqlalchemy import URL
import os

postgres_url = URL.create(
    "postgresql",
    username=os.environ.get("DB_USER"),
    password=os.environ.get("DB_PASSWORD"),
    host=os.environ.get("DB_HOST"),
    database="postgres"
)
engine = create_engine(postgres_url)


def get_session():
    with Session(engine) as session:
        yield session
