from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PaperSearchRequest(BaseModel):
    session: str
    course: str
    subject_code: str


class PaperSearchRequest(BaseModel):

    session: str
    course: str
    subject_code: str