document.addEventListener('DOMContentLoaded', () => {
    const resourcesContainer = document.getElementById('resources-container');
    const addResourceBtn = document.getElementById('add-resource-btn');

    addResourceBtn.addEventListener('click', () => {
        openModal('addResourceModal');
    });

    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    fetch('/api/resources', {
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
    .then(resources => {
        if (!Array.isArray(resources)) {
            throw new Error('Expected an array of resources');
        }
        resources.forEach(resource => {
            const resourceCard = document.createElement('div');
            resourceCard.classList.add('card');
            resourceCard.innerHTML = `
                <h3>${resource.title}</h3>
                <p><a href="${resource.link}" target="_blank">View Resource</a></p>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>`
            ;
            resourcesContainer.appendChild(resourceCard);

            const editBtn = resourceCard.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                openModal('editResourceModal', resource);
            });

            const deleteBtn = resourceCard.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                deleteResource(resource._id);
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

function addResource() {
    const title = document.getElementById('resourceTitle').value;
    const link = document.getElementById('resourceLink').value;

    const token = localStorage.getItem('authToken');
    fetch('/api/resources', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({ title, link })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(resource => {
        closeModal('addResourceModal');
        location.reload();
    })
    .catch(err => console.error('Add resource error:', err));
}

function editResource() {
    const id = document.getElementById('editResourceFormResourceId').value;
    const title = document.getElementById('editResourceFormResourceTitle').value;
    const link = document.getElementById('editResourceFormResourceLink').value;

    const token = localStorage.getItem('authToken');
    fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify({ title, link })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(resource => {
        closeModal('editResourceModal');
        location.reload();
    })
    .catch(err => console.error('Edit resource error:', err));
}

function deleteResource(id) {
    const token = localStorage.getItem('authToken');
    fetch(`/api/resources/${id}`, {
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
        location.reload();
    })
    .catch(err => console.error('Delete resource error:', err));
}