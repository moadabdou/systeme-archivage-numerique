document.addEventListener('DOMContentLoaded', () => {
    const employeeListContainer = document.getElementById('employee-list-container');
    const addEmployeeForm = document.getElementById('add-employee-form');

    /**
     * Fetches employees from the API and displays them on the page.
     */
    const fetchAndDisplayEmployees = async () => {
        try {
            const response = await fetch('/api/employees');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const employees = await response.json();

            // Clear the container
            employeeListContainer.innerHTML = '';

            if (employees.length === 0) {
                employeeListContainer.innerHTML = '<p>No employee data found.</p>';
                return;
            }

            // Create and append a card for each employee
            employees.forEach(employee => {
                const card = document.createElement('div');
                card.className = 'employee-card';
                card.innerHTML = `
                    <h4>${employee.name}</h4>
                    <p><strong>CIN:</strong> ${employee.cin}</p>
                    <p><strong>Poste:</strong> ${employee.post}</p>
                    <p><strong>Statut:</strong> ${employee.status}</p>
                `;
                employeeListContainer.appendChild(card);
            });
        } catch (error) {
            employeeListContainer.innerHTML = `<p>Error loading employee data: ${error.message}.</p>`;
            console.error('Error fetching employee data:', error);
        }
    };

    /**
     * Handles the submission of the "Add Employee" form.
     */
    addEmployeeForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(addEmployeeForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Clear the form and refresh the employee list
            addEmployeeForm.reset();
            await fetchAndDisplayEmployees();

        } catch (error) {
            alert(`Failed to add employee: ${error.message}`);
            console.error('Error adding employee:', error);
        }
    });

    // Initial load of employee data
    fetchAndDisplayEmployees();
});