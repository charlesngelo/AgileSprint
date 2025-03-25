// Select DOM elements
const projectForm = document.getElementById('project-form');
const projectNameInput = document.getElementById('project-name');
const projectDescInput = document.getElementById('project-desc');
const projectsList = document.getElementById('projects-list');
const taskProjectDropdown = document.getElementById('task-project');
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskStatusDropdown = document.getElementById('task-status');
const openTasksList = document.getElementById('open-tasks');
const inProgressTasksList = document.getElementById('in-progress-tasks');
const completedTasksList = document.getElementById('completed-tasks');

// Load saved projects from localStorage on page load
document.addEventListener('DOMContentLoaded', loadProjects);

// Event listener for adding a new project
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const projectName = projectNameInput.value.trim();
    const projectDesc = projectDescInput.value.trim();

    if (!projectName) {
        alert('Project name is required!');
        return;
    }

    // Save the project to localStorage
    saveProjectToLocalStorage(projectName, projectDesc);

    // Clear input fields
    projectNameInput.value = '';
    projectDescInput.value = '';

    // Reload projects list and dropdown
    loadProjects();
});

// Event listener for adding a new task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskTitle = taskTitleInput.value.trim();
    const taskProject = taskProjectDropdown.value;
    const taskStatus = taskStatusDropdown.value;

    if (!taskTitle || !taskProject) {
        alert('Task title and project are required!');
        return;
    }

    // Save the task to localStorage
    saveTaskToLocalStorage(taskTitle, taskProject, taskStatus);

    // Clear input fields
    taskTitleInput.value = '';

    // Reload tasks on Kanban board
    loadTasksOnKanban();
});

// Save a new project to localStorage
function saveProjectToLocalStorage(name, description) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    
    // Add new project to the array
    projects.push({ name, description });

    // Save updated array back to localStorage
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Load projects from localStorage and display them
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];

    // Clear current list and dropdown
    projectsList.innerHTML = '';
    taskProjectDropdown.innerHTML = '<option value="">Select a Project</option>';

    // Populate the list and dropdown with saved projects
    projects.forEach((project) => {
        // Add to the projects list
        const li = document.createElement('li');
        li.textContent = `${project.name}: ${project.description}`;
        projectsList.appendChild(li);

        // Add to the task dropdown
        const option = document.createElement('option');
        option.value = project.name; // Use the name as the value
        option.textContent = project.name; // Display only the name in dropdown
        taskProjectDropdown.appendChild(option);
    });
}

// Save a new task to localStorage
function saveTaskToLocalStorage(title, project, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Add new task to the array
    tasks.push({ title, project, status });

    // Save updated array back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage and display them on the Kanban board
function loadTasksOnKanban() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Clear current lists
    openTasksList.innerHTML = '';
    inProgressTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';

    // Populate the lists with saved tasks
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const taskText = document.createElement('span');
        taskText.textContent = `${task.title} - ${task.project}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.onclick = () => editTask(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteTask(index);

        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        switch (task.status) {
            case 'Open':
                openTasksList.appendChild(li);
                break;
            case 'In Progress':
                inProgressTasksList.appendChild(li);
                break;
            case 'Completed':
                completedTasksList.appendChild(li);
                break;
            default:
                console.error('Invalid task status:', task.status);
        }
    });
}

// Function to edit a task
function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (index >= tasks.length) {
        alert('Invalid task index!');
        return;
    }

    const task = tasks[index];

    // Prompt user for new task details
    const newTitle = prompt('Enter new task title:', task.title);
    const newProject = prompt('Enter new project name:', task.project);
    const newStatus = prompt('Enter new status (Open, In Progress, Completed):', task.status);

    if (!newTitle || !newProject || !newStatus) {
        alert('All fields are required!');
        return;
    }

    // Update task details
    task.title = newTitle;
    task.project = newProject;
    task.status = newStatus;

    // Save updated tasks back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Reload tasks on Kanban board
    loadTasksOnKanban();
}

// Function to delete a task
function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (index >= tasks.length) {
        alert('Invalid task index!');
        return;
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    // Remove task from array
    tasks.splice(index, 1);

    // Save updated tasks back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Reload tasks on Kanban board
    loadTasksOnKanban();
}
