document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks-container');
    const addTaskBtn = document.getElementById('add-task-btn');

    addTaskBtn.addEventListener('click', () => {
        openModal('addTaskModal');
    });

    const token = localStorage.getItem('authToken');
    fetch('/api/tasks', {
        headers: {
            'x-auth-token': token
        }
    })
    .then(response => response.json())
    .then(tasks => {
        tasks.forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.classList.add('card');
            taskCard.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Priority: ${task.priority}</p>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
            tasksContainer.appendChild(taskCard);

            const editBtn = taskCard.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                openModal('editTaskModal', task);
            });

            const deleteBtn = taskCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                deleteTask(task._id);
            });
        });
    })
    .catch(err => console.error(err));
});

function openModal(modalId, task) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';

    if (task) {
        document.getElementById('taskId').value = task._id;
        document.getElementById('taskTitle').value = task.title;
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function addTask() {
    const token = localStorage.getItem('authToken');
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({ title, description, dueDate, priority })
    })
    .then(response => response.json())
    .then(task => {
        closeModal('addTaskModal');
        location.reload();
    })
    .catch(err => console.error(err));
}

function editTask() {
    const token = localStorage.getItem('authToken');
    const id = document.getElementById('editTaskFormTaskId').value;
    const title = document.getElementById('editTaskFormTaskTitle').value;
    const description = document.getElementById('editTaskFormTaskDescription').value;
    const dueDate = document.getElementById('editTaskFormTaskDueDate').value;
    const priority = document.getElementById('editTaskFormTaskPriority').value;

    fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({ title, description, dueDate, priority })
    })
    .then(response => response.json())
    .then(task => {
        closeModal('editTaskModal');
        location.reload();
    })
    .catch(err => console.error(err));
}

function deleteTask(id) {
    const token = localStorage.getItem('authToken');
    fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': token
        }
    })
    .then(response => response.json())
    .then(() => {
        location.reload();
    })
    .catch(err => console.error(err));
}
