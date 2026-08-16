from fastapi import FastAPI
from app.database import Base, engine
from app.models import User
from app.routes.auth import router as auth_router
from app.auth import hash_password
from fastapi.middleware.cors import CORSMiddleware
from app.routes import papers
from app.routes import password
from app.routes.important_questions import router as important_questions_router
from app.models_otp import RegistrationOTP



app = FastAPI(
    title="GTU AI Study Assistant API",
    description="Backend API for GTU AI Study Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


app.include_router(auth_router)
app.include_router(papers.router)
app.include_router(password.router)
app.include_router(
    important_questions_router
)

@app.get("/")
def home():
    return {
        "message": "Welcome to GTU AI Study Assistant API"
    }