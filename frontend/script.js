document.addEventListener('DOMContentLoaded', () => {
    const employeeListContainer = document.getElementById('employee-list-container');

    // Fetch employee data from the backend API
    fetch('/api/employees')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(employees => {
            // Clear the "Loading..." message
            employeeListContainer.innerHTML = '';

            if (employees.length === 0) {
                employeeListContainer.innerHTML = '<p>No employee data found.</p>';
                return;
            }

            // Create and append a card for each employee
            employees.forEach(employee => {
                const card = document.createElement('div');
                card.className = 'employee-card';

                const name = document.createElement('h4');
                name.textContent = employee.name;

                const cin = document.createElement('p');
                cin.textContent = `CIN: ${employee.cin}`;

                const post = document.createElement('p');
                post.textContent = `Poste: ${employee.post}`;

                const status = document.createElement('p');
                status.textContent = `Statut: ${employee.status}`;

                card.appendChild(name);
                card.appendChild(cin);
                card.appendChild(post);
                card.appendChild(status);

                employeeListContainer.appendChild(card);
            });
        })
        .catch(error => {
            employeeListContainer.innerHTML = `<p>Error loading employee data: ${error.message}. Is the backend server running?</p>`;
            console.error('Error fetching employee data:', error);
        });
});