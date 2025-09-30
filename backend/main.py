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

class CreateEmployeePayload(BaseModel):
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

@app.post("/api/employees", response_model=Employee, status_code=201)
def create_employee(payload: CreateEmployeePayload):
    """
    Create a new employee record.
    """
    # In a real app, ID would be handled by the database.
    new_id = max(emp.id for emp in mock_employees) + 1 if mock_employees else 1

    new_employee = Employee(
        id=new_id,
        name=payload.name,
        cin=payload.cin,
        post=payload.post,
        status=payload.status,
    )

    mock_employees.append(new_employee)
    return new_employee

# --- Serve Frontend ---
# This must be mounted after all API routes.
# It serves files from the 'frontend' directory. The path is relative to where the server is run.
app.mount("/", StaticFiles(directory="frontend", html=True), name="static")