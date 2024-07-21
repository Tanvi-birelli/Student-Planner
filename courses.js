document.addEventListener('DOMContentLoaded', () => {
    const coursesContainer = document.getElementById('courses-container');
    const addCourseBtn = document.getElementById('add-course-btn');

    addCourseBtn.addEventListener('click', () => {
        openModal('addCourseModal');
    });

    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    fetch('/api/courses', {
        headers: { 'x-auth-token': token }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(courses => {
        if (!Array.isArray(courses)) {
            throw new Error('Expected an array of courses');
        }
        displayCourses(courses);
    })
    .catch(error => console.error('Fetch error:', error));
});

function displayCourses(courses) {
    const coursesContainer = document.getElementById('courses-container');
    coursesContainer.innerHTML = '';

    courses.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('card');
        courseDiv.innerHTML = `
            <h2>${course.title}</h2>
            <p>Code: ${course.code}</p>
            <p>Instructor: ${course.instructor}</p>
            <button class="view-btn" data-course='${JSON.stringify(course)}'>View More</button>
            <button class="edit-btn" data-course='${JSON.stringify(course)}'>Edit</button>
            <button class="delete-btn" data-id='${course._id}'>Delete</button>
        `;
        coursesContainer.appendChild(courseDiv);
    });

    attachCourseEventListeners();
}

function attachCourseEventListeners() {
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', () => {
            const course = JSON.parse(button.getAttribute('data-course'));
            openModal('viewCourseModal', course);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const course = JSON.parse(button.getAttribute('data-course'));
            openModal('editCourseModal', course);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const courseId = button.getAttribute('data-id');
            deleteCourse(courseId);
        });
    });
}

function addCourse() {
    const form = document.getElementById('addCourseForm');
    const formData = new FormData(form);

    const token = localStorage.getItem('authToken');
    fetch('/api/courses', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(() => {
        closeModal('addCourseModal');
        location.reload();
    })
    .catch(error => console.error('Add course error:', error));
}

function editCourse() {
    const form = document.getElementById('editCourseForm');
    const formData = new FormData(form);
    const courseId = formData.get('courseId');

    const token = localStorage.getItem('authToken');
    fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'x-auth-token': token },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(() => {
        closeModal('editCourseModal');
        location.reload();
    })
    .catch(error => console.error('Edit course error:', error));
}

function deleteCourse(courseId) {
    const token = localStorage.getItem('authToken');
    fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
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
    .catch(error => console.error('Delete course error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    const syllabusFormatSelect = document.getElementById('syllabusFormat');
    const textContentWrapper = document.getElementById('textContentWrapper');
    const fileUploadWrapper = document.getElementById('fileUploadWrapper');
    
    function updateSyllabusFields() {
        const format = syllabusFormatSelect.value;
        if (format === 'text') {
            textContentWrapper.style.display = 'block';
            fileUploadWrapper.style.display = 'none';
        } else {
            textContentWrapper.style.display = 'none';
            fileUploadWrapper.style.display = 'block';
        }
    }

    syllabusFormatSelect.addEventListener('change', updateSyllabusFields);
    updateSyllabusFields(); // Initialize based on default or existing value
});
