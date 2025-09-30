document.addEventListener('DOMContentLoaded', () => {
    const employeeListContainer = document.getElementById('employee-list-container');
    const addEmployeeForm = document.getElementById('add-employee-form');
    const formTitle = document.querySelector('#add-employee-section h3');
    const formSubmitButton = addEmployeeForm.querySelector('button[type="submit"]');

    let currentEmployees = [];
    let editMode = {
        active: false,
        employeeId: null,
    };

    /**
     * Resets the form to its initial "add employee" state.
     */
    const resetFormToCreateMode = () => {
        addEmployeeForm.reset();
        editMode = { active: false, employeeId: null };
        formTitle.textContent = 'Ajouter un Nouvel Employé';
        formSubmitButton.textContent = 'Ajouter l\'Employé';
    };

    /**
     * Fetches employees from the API and displays them on the page.
     */
    const fetchAndDisplayEmployees = async () => {
        try {
            const response = await fetch('/api/employees');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            currentEmployees = await response.json();
            employeeListContainer.innerHTML = '';

            if (currentEmployees.length === 0) {
                employeeListContainer.innerHTML = '<p>No employee data found.</p>';
                return;
            }

            currentEmployees.forEach(employee => {
                const card = document.createElement('div');
                card.className = 'employee-card';
                card.innerHTML = `
                    <div class="employee-details">
                        <h4>${employee.name}</h4>
                        <p><strong>CIN:</strong> ${employee.cin}</p>
                        <p><strong>Poste:</strong> ${employee.post}</p>
                        <p><strong>Statut:</strong> ${employee.status}</p>
                    </div>
                    <div class="employee-actions">
                        <button class="edit-btn" data-id="${employee.id}">Modifier</button>
                        <button class="delete-btn" data-id="${employee.id}">Supprimer</button>
                    </div>
                `;
                employeeListContainer.appendChild(card);
            });
        } catch (error) {
            employeeListContainer.innerHTML = `<p>Error loading employee data: ${error.message}.</p>`;
            console.error('Error fetching data:', error);
        }
    };

    /**
     * Handles the submission of the employee form for both creating and updating.
     */
    addEmployeeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addEmployeeForm);
        const payload = Object.fromEntries(formData.entries());

        const url = editMode.active ? `/api/employees/${editMode.employeeId}` : '/api/employees';
        const method = editMode.active ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            resetFormToCreateMode();
            await fetchAndDisplayEmployees();

        } catch (error) {
            alert(`Failed to save employee: ${error.message}`);
            console.error('Error saving employee:', error);
        }
    });

    /**
     * Handles clicks within the employee list for edit and delete actions.
     */
    employeeListContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const employeeId = parseInt(target.dataset.id, 10);

        // --- Edit Action ---
        if (target.classList.contains('edit-btn')) {
            const employee = currentEmployees.find(emp => emp.id === employeeId);
            if (!employee) return;

            addEmployeeForm.elements.name.value = employee.name;
            addEmployeeForm.elements.cin.value = employee.cin;
            addEmployeeForm.elements.post.value = employee.post;
            addEmployeeForm.elements.status.value = employee.status;

            editMode = { active: true, employeeId: employee.id };
            formTitle.textContent = 'Modifier l\'Employé';
            formSubmitButton.textContent = 'Mettre à Jour';
            addEmployeeForm.scrollIntoView({ behavior: 'smooth' });
        }

        // --- Delete Action ---
        if (target.classList.contains('delete-btn')) {
            if (confirm(`Êtes-vous sûr de vouloir supprimer cet employé (ID: ${employeeId})?`)) {
                try {
                    const response = await fetch(`/api/employees/${employeeId}`, { method: 'DELETE' });
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
                    }
                    await fetchAndDisplayEmployees();
                } catch (error) {
                    alert(`Failed to delete employee: ${error.message}`);
                    console.error('Error deleting employee:', error);
                }
            }
        }
    });

    // Initial load of employee data
    fetchAndDisplayEmployees();
});