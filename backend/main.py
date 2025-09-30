from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.staticfiles import StaticFiles

# --- Data Models ---
class Employee(BaseModel):
    id: int
    name: str
    cin: str
    post: str
    status: str

# --- Mock Data ---
mock_employees = [
    Employee(id=1, name="Ahmed Alami", cin="AB123456", post="Administrator", status="Active"),
    Employee(id=2, name="Fatima Zahra", cin="CD789012", post="HR Manager", status="Active"),
    Employee(id=3, name="Youssef Benali", cin="EF345678", post="Technician", status="Retired"),
]

app = FastAPI()

# --- API Endpoints ---
@app.get("/api/employees", response_model=List[Employee])
def get_employees():
    """
    Retrieve a list of all employees.
    """
    return mock_employees

# --- Serve Frontend ---
# This must be mounted after all API routes.
# It serves files from the 'frontend' directory. The path is relative to where the server is run.
app.mount("/", StaticFiles(directory="frontend", html=True), name="static")