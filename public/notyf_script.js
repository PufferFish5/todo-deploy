const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    dismissible: true
});

document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('addForm');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            //const form = event.target;
            const titleInput = document.getElementById('titleInput'); 
            const descriptionInput = document.getElementById('descriptionInput');
            const prioritySelect = document.getElementById('prioritySelect');

            const title = titleInput.value;
            const description = descriptionInput.value;
            const priority = parseInt(prioritySelect.value, 10);

            const taskData = {
                title: title,
                description: description,
                priority: priority
            };
            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });

                const result = response.status !== 204 ? await response.json() : {};

                if (response.ok) {
                    const message = result.title ? `Task "${result.title}" added` : (result.message);   
                    notyf.success(message);
                    titleInput.value = '';
                    descriptionInput.value = ''; 
                    prioritySelect.value = '3';
                } else { 
                    const errorMessage = result.error;
                    notyf.error(errorMessage);
                }

            } catch (error) {
                console.error('Network error:', error);
                notyf.error('Connection problem?');
            }
        });
    }
});