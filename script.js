// TASK STORAGE FUNCTIONS
// Helper function to save tasks to local storage
function saveTasks(tasks) {
    // Save the tasks array as a JSON string in local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Helper function to load tasks from local storage
function loadTasks() {
    // Retrieve the tasks JSON string from local storage and parse it into an array
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// DATE FORMATTING FUNCTION
function formatDate(dateString) {
    // Check if the input date string is empty
    if (!dateString) return '';
    
    // Define date formatting options
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    
    // Format the date string using the defined options
    return new Date(dateString).toLocaleString('en-US', options);
}

// TASK EDITING FUNCTION
function editTask(index) {
    // Load the current list of tasks
    const tasks = loadTasks();
    
    // Prompt the user to edit the task's text and store the new text
    const newText = prompt('Edit your task:', tasks[index].text);
    
    // Check if the user provided new text
    if (newText) {
        // Update the task's text with the new text
        tasks[index].text = newText;
        
        // Save the updated tasks list to local storage
        saveTasks(tasks);
        
        // Render the updated tasks on the web page
        renderTasks();
    }
}

// TASK RENDERING FUNCTION
function renderTasks() {
    // Get the task list element from the HTML
    const taskList = document.getElementById('taskList');
    
    // Clear existing tasks in the task list
    taskList.innerHTML = '';
    
    // Load the current list of tasks
    const tasks = loadTasks();

    //Generates a sample task if the local storage is empty.
    if (tasks.length === 0) {
        tasks.push({
            number: 999,
            text: "This is an example task, add your own to be able to replace it.",
            created: new Date().toISOString(),
            completed: null,
            isDone: false
        });
    }

    
    
    // Iterate through each task and create HTML elements to display them
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
    <div class="row align-items-center">
        <div class="col-md-1">${task.number}</div>
        <div class="col-md-4">${task.text}</div>
        <div class="col-md-2">${formatDate(task.created)}</div>
        <div class="col-md-2">${formatDate(task.completed)}</div>
        <div class="col-md-3">
                <button class="btn btn-success btn-sm mr-1 complete-btn">
                    <i class="fas fa-check"></i></button>
                <button class="btn btn-warning btn-sm mr-1 edit-btn">
                    <i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm delete-btn">
                    <i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
        
        // Add event listeners for completing, editing, and deleting tasks. When "Complete" is clicked, it toggles the task's completion status and updates the completion date.        
        li.querySelector('.complete-btn').addEventListener('click', () => {
            task.isDone = !task.isDone;
            task.completed = task.isDone ? new Date().toISOString() : null;
            saveTasks(tasks);
            renderTasks();
        });

        // "Edit" triggers the editing of the task's text
        li.querySelector('.edit-btn').addEventListener('click', () => editTask(index));

        // "Delete" removes the task from the list.
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        });
        
        // Append the task HTML element to the task list
        taskList.appendChild(li);
    });
}

// TASK ADDITION FUNCTION
function addTask(taskText) {
    // Load existing tasks from local storage or initialize an empty array
    const tasks = loadTasks();

    // Retrieve the current task counter from local storage or use '0' if it doesn't exist
    const taskCounter = localStorage.getItem('taskCounter') || '0';

    // Increment the task counter by 1 and convert it to an integer (base 10)
    const newTaskNumber = parseInt(taskCounter, 10) + 1;

    // Get the current date and time and store it as the creation date
    const creationDate = new Date().toISOString();

    // Create a new task object with task number, text, creation date, completion date (null for now), and completion status (false)
    tasks.push({ number: newTaskNumber, text: taskText, created: creationDate, completed: null, isDone: false });

    // Update the task counter in local storage with the new value converted to a string
    localStorage.setItem('taskCounter', newTaskNumber.toString());

    // Save the updated tasks list to local storage
    saveTasks(tasks);

    // Render the updated tasks on the web page
    renderTasks();
}

// TASK SORTING FUNCTION
// This function sorts the list of tasks based on the specified sorting criteria, which can be 'number', 'text', 'created', or 'completed'.
// - When sorting by 'number', tasks are arranged in ascending order of task numbers.
// - When sorting by 'text', tasks are sorted alphabetically by their text content.
// - When sorting by 'created', tasks are sorted by their creation date in ascending order.
// - When sorting by 'completed', tasks are sorted by their completion date, with incomplete tasks appearing first.
// After sorting, the updated task list is saved to local storage, and the tasks are re-rendered on the web page to reflect the new order.
function sortTasks(sortBy) {
    let tasks = loadTasks();
    if (sortBy === 'number') {
        tasks.sort((a, b) => a.number - b.number);
    } else if (sortBy === 'text') {
        tasks.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortBy === 'created') {
        tasks.sort((a, b) => new Date(a.created) - new Date(b.created));
    } else if (sortBy === 'completed') {
        tasks.sort((a, b) => {
            if (a.completed === null) return 1;
            if (b.completed === null) return -1;
            return new Date(a.completed) - new Date(b.completed);
        });
    }
    saveTasks(tasks);
    renderTasks();
}

// Event listeners for adding tasks and sorting
document.addEventListener('DOMContentLoaded', function() {
    // Initialize taskCounter if it doesn't exist
    if (!localStorage.getItem('taskCounter')) {
        localStorage.setItem('taskCounter', '0');
    }

    // Add event listener for the "Add Task" button
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        // Prompt the user to enter a new task
        const taskText = prompt('Enter a new task:');
        if (taskText) {
            // If the user provided a task, add it to the list
            addTask(taskText);
        }
    });

    // Add event listeners for sorting buttons
    document.querySelectorAll('.task-sort').forEach(element => {
        element.addEventListener('click', () => {
            // Sort tasks based on the selected sorting option
            sortTasks(element.getAttribute('data-sort'));
        });
    });

    // Initial rendering of tasks on page load
    renderTasks();
});
