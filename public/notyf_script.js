const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    dismissible: true
});

document.addEventListener('DOMContentLoaded', () => {
    const saveTokenBtn = document.getElementById('saveTokenBtn');
    if (saveTokenBtn) {
        saveTokenBtn.addEventListener('click', () => {
            const tokenInput = document.getElementById('manualTokenInput');
            const token = tokenInput.value.trim();

            if (token) {
                const cleanToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token; 
                localStorage.setItem('jwtToken', cleanToken);
                notyf.success('JWT Токен успішно збережено в localStorage!');
                console.log('Token saved:', cleanToken);
            } else {
                notyf.error('Вставте дійсний токен.');
            }
        });
        const savedToken = localStorage.getItem('jwtToken');
        if (savedToken) {
            document.getElementById('manualTokenInput').value = savedToken;
        }
    }

    const addTaskForm = document.getElementById('addForm');

    if (addTaskForm) {
        addTaskForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            const token = localStorage.getItem('jwtToken'); 
        
            if (!token) {
                notyf.error('Authentication required. Please log in.');
                return;
            }

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
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(taskData)
                });

                if (response.status === 401 || response.status === 403) {
                     notyf.error('Your session has expired or is invalid. Please log in again.');
                     return;
                }

                const result = await response.json();
                if (response.ok) {
                    const message = result.title ? `Task "${result.title}" added` : (result.message || 'Task added successfully!');
                    notyf.success(message);
                    titleInput.value = '';
                    descriptionInput.value = ''; 
                    prioritySelect.value = '3';

                } else { 
                    const errorMessage = result.error || result.message || 'An unknown error occurred.';
                    notyf.error(errorMessage);
                }

            } catch (error) {
                console.error('Network error or JSON parsing failed:', error);
                notyf.error('Connection problem or server is down.');
            }
        });
    }
});

