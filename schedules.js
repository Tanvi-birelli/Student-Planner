document.addEventListener('DOMContentLoaded', () => {
    const schedulesContainer = document.getElementById('schedules-container');
    const addScheduleBtn = document.getElementById('add-schedule-btn');

    addScheduleBtn.addEventListener('click', () => {
        openModal('addScheduleModal');
    });

    // Fetch schedules from backend
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    fetch('/api/schedules', {
        headers: {
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(schedules => {
        if (!Array.isArray(schedules)) {
            throw new Error('Expected an array of schedules');
        }

        schedules.forEach(schedule => {
            const scheduleCard = document.createElement('div');
            scheduleCard.classList.add('card');
            scheduleCard.innerHTML = `
                <h3>${schedule.course}</h3>
                <p>Day: ${schedule.day}</p>
                <p>Time: ${schedule.startTime} - ${schedule.endTime}</p>
                <p>Location: ${schedule.location}</p>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
            schedulesContainer.appendChild(scheduleCard);

            const editBtn = scheduleCard.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                openModal('editScheduleModal', schedule);
            });

            const deleteBtn = scheduleCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                deleteSchedule(schedule._id);
            });
        });
    })
    .catch(err => console.error('Fetch error:', err));
});

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
}

function addSchedule() {
    const token = localStorage.getItem('authToken');
    const course = document.getElementById('scheduleCourse').value;
    const day = document.getElementById('scheduleDay').value;
    const startTime = document.getElementById('scheduleStartTime').value;
    const endTime = document.getElementById('scheduleEndTime').value;
    const location = document.getElementById('scheduleLocation').value;

    fetch('/api/schedules', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({ course, day, startTime, endTime, location })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(() => {
        closeModal('addScheduleModal');
        window.location.reload(); // Refresh to show new schedule
    })
    .catch(err => console.error('Error adding schedule:', err));
}

function editSchedule() {
    const token = localStorage.getItem('authToken');
    const id = document.getElementById('editScheduleFormScheduleId').value;
    const course = document.getElementById('editScheduleFormScheduleCourse').value;
    const day = document.getElementById('editScheduleFormScheduleDay').value;
    const startTime = document.getElementById('editScheduleFormScheduleStartTime').value;
    const endTime = document.getElementById('editScheduleFormScheduleEndTime').value;
    const location = document.getElementById('editScheduleFormScheduleLocation').value;

    fetch(`/api/schedules/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({ course, day, startTime, endTime, location })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(() => {
        closeModal('editScheduleModal');
        window.location.reload();  // Refresh to show updated schedule
    })
    .catch(err => console.error('Error editing schedule:', err));
}

function deleteSchedule(id) {
    const token = localStorage.getItem('authToken');
    fetch(`/api/schedules/${id}`, { 
        method: 'DELETE',
        headers: {
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(() => {
        window.location.reload();  // Refresh to remove deleted schedule
    })
    .catch(err => console.error('Error deleting schedule:', err));
}

function openModal(modalId, schedule = null) {
    const modal = document.getElementById(modalId);
    if (schedule) {
        populateModalFields(modalId, schedule);
    }
    modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}
