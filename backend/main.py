from fastapi import FastAPI, HTTPException, Response, status
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

@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int):
    """
    Delete an employee record by its ID.
    """
    global mock_employees
    employee_to_delete = next((emp for emp in mock_employees if emp.id == employee_id), None)

    if not employee_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Employee with id {employee_id} not found")

    mock_employees = [emp for emp in mock_employees if emp.id != employee_id]
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.put("/api/employees/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, payload: CreateEmployeePayload):
    """
    Update an existing employee's details.
    """
    global mock_employees
    employee_to_update = next((emp for emp in mock_employees if emp.id == employee_id), None)

    if not employee_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Employee with id {employee_id} not found")

    # Update the fields
    employee_to_update.name = payload.name
    employee_to_update.cin = payload.cin
    employee_to_update.post = payload.post
    employee_to_update.status = payload.status

    return employee_to_update

# --- Serve Frontend ---
# This must be mounted after all API routes.
# It serves files from the 'frontend' directory. The path is relative to where the server is run.
app.mount("/", StaticFiles(directory="frontend", html=True), name="static")