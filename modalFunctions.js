// Define updateSyllabusFields globally
function updateSyllabusFields() {
    const syllabusFormatSelect = document.getElementById('editCourseFormSyllabusFormat');
    const textContentWrapper = document.getElementById('editCourseFormTextContentWrapper');
    const fileUploadWrapper = document.getElementById('editCourseFormFileUploadWrapper');
    
    const format = syllabusFormatSelect.value;
    if (format === 'text') {
        textContentWrapper.style.display = 'block';
        fileUploadWrapper.style.display = 'none';
    } else {
        textContentWrapper.style.display = 'none';
        fileUploadWrapper.style.display = 'block';
    }
}

// Existing code...
function openModal(modalId, data = null) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';

    const form = modal.querySelector('form');
    if (form) {
        form.reset();
        const submitHandler = getSubmitHandler(modalId);
        form.removeEventListener('submit', submitHandler);
        form.addEventListener('submit', submitHandler);
    }

    if (data) {
        fillModalData(modalId, data);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error(`Modal with ID "${modalId}" not found.`);
    }
}

function getSubmitHandler(modalId) {
    switch (modalId) {
        case 'addCourseModal':
            return addCourseListener;
        case 'editCourseModal':
            return editCourseListener;
        case 'viewCourseModal':
            return viewCourseListener;
        case 'addResourceModal':
            return addResourceListener;
        case 'editResourceModal':
            return editResourceListener;
        case 'addTaskModal':
            return addTaskListener;
        case 'editTaskModal':
            return editTaskListener;
        case 'addScheduleModal':
            return addScheduleListener;
        case 'editScheduleModal':
            return editScheduleListener;
        default:
            return () => {};
    }
}

function fillModalData(modalId, data) {
    console.log('Filling modal with data:', data);
    let syllabusContainer;
    switch (modalId) {
        case 'editCourseModal':
            document.getElementById('editCourseFormCourseId').value = data._id;
            document.getElementById('editCourseFormCourseTitle').value = data.title;
            document.getElementById('editCourseFormCourseCode').value = data.code;
            document.getElementById('editCourseFormCourseInstructor').value = data.instructor;

            const syllabusFormatSelect = document.getElementById('editCourseFormSyllabusFormat');
            const textContentWrapper = document.getElementById('editCourseFormTextContentWrapper');
            const fileUploadWrapper = document.getElementById('editCourseFormFileUploadWrapper');

            syllabusFormatSelect.value = data.syllabus.format;
            updateSyllabusFields(); // Call to set visibility based on the format

            switch (data.syllabus.format) {
                case 'image':
                    textContentWrapper.style.display = 'none';
                    fileUploadWrapper.style.display = 'block';
                    break;
                case 'pdf':
                    textContentWrapper.style.display = 'none';
                    fileUploadWrapper.style.display = 'block';
                    break;
                case 'text':
                    textContentWrapper.style.display = 'block';
                    fileUploadWrapper.style.display = 'none';
                    document.getElementById('editCourseFormSyllabusContent').textContent = data.syllabus.content;
                    break;
                default:
                    textContentWrapper.style.display = 'none';
                    fileUploadWrapper.style.display = 'none';
                    break;
            }
            break;
            case 'viewCourseModal':
                document.getElementById('modal-course-title').textContent = data.title;
                document.getElementById('modal-course-code').textContent = `Code: ${data.code}`;
                document.getElementById('modal-course-instructor').textContent = `Instructor: ${data.instructor}`;
                
                syllabusContainer = document.getElementById('modal-syllabus');
                syllabusContainer.innerHTML = '';
                switch (data.syllabus.format) {
                    case 'image':
                        const imgElement = document.createElement('img');
                        imgElement.src = data.syllabus.content;
                        imgElement.alt = 'Syllabus Image';
                        imgElement.style.width = '100%';
                        imgElement.style.height = 'auto';
                        syllabusContainer.appendChild(imgElement);
                        break;
                    case 'pdf':
                        const linkElement = document.createElement('a');
                        linkElement.href = data.syllabus.content;
                        linkElement.textContent = 'Open Syllabus (PDF)';
                        linkElement.target = '_blank'; // Opens in a new tab
                        syllabusContainer.appendChild(linkElement);
                        break;
                    case 'text':
                        const textElement = document.createElement('pre');
                        textElement.textContent = data.syllabus.content;
                        syllabusContainer.appendChild(textElement);
                        break;
                    default:
                        syllabusContainer.textContent = 'Unsupported format';
                        break;
                }
                break;
        case 'editResourceModal':
            document.getElementById('editResourceFormResourceId').value = data._id;
            document.getElementById('editResourceFormResourceTitle').value = data.title;
            document.getElementById('editResourceFormResourceLink').value = data.link;
            break;
        case 'editTaskModal':
            document.getElementById('editTaskFormTaskId').value = data._id;
            document.getElementById('editTaskFormTaskTitle').value = data.title;
            document.getElementById('editTaskFormTaskDescription').value = data.description;
            document.getElementById('editTaskFormTaskDueDate').value = data.dueDate.split('T')[0];
            document.getElementById('editTaskFormTaskPriority').value = data.priority;
            break;
        case 'editScheduleModal':
            document.getElementById('editScheduleFormScheduleId').value = data._id;
            document.getElementById('editScheduleFormScheduleCourse').value = data.course;
            document.getElementById('editScheduleFormScheduleDay').value = data.day;
            document.getElementById('editScheduleFormScheduleStartTime').value = data.startTime;
            document.getElementById('editScheduleFormScheduleEndTime').value = data.endTime;
            document.getElementById('editScheduleFormScheduleLocation').value = data.location;
            break;
    }
}

// Define event listeners
function addCourseListener(event) {
    event.preventDefault();
    addCourse();
}

function editCourseListener(event) {
    event.preventDefault();
    editCourse();
}

function addResourceListener(event) {
    event.preventDefault();
    addResource();
}

function editResourceListener(event) {
    event.preventDefault();
    editResource();
}

function addTaskListener(event) {
    event.preventDefault();
    addTask();
}

function editTaskListener(event) {
    event.preventDefault();
    editTask();
}

function addScheduleListener(event) {
    event.preventDefault();
    addSchedule();
}

function editScheduleListener(event) {
    event.preventDefault();
    editSchedule();
}

function viewCourseListener(event){
    event.preventDefault();
    viewCourse();
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
};