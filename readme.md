# Task Board Web App

A simple task management board built with HTML, CSS, JavaScript, and Flask.  
Supports normal tasks and scheduled tasks with date and time, with user authentication.

## Features

- **User Authentication**  
  - Sign up and log in to access your tasks.  
  - Passwords are securely hashed.  
  - Sessions keep users logged in.  

- **Task Board**  
  - **To Do / In Progress / Completed** columns (Kanban-style).  
  - **Add normal tasks** quickly with a text input.  
  - **Schedule tasks** for a future date/time using an inline calendar.  
  - **Move tasks** between columns using arrow buttons.  
  - **Delete tasks** with a fade-out animation.  
  - **Expand task details** to see scheduled date/time.  
  - **Tasks persist** in localStorage per user session.  

- **UI & UX**  
  - Hover effects on tasks and buttons.  
  - Completed tasks are crossed out.  
  - Inline Flatpickr calendar for scheduling tasks.  
  - Centered buttons for scheduled tasks.  
  - **Dark mode toggle** available on all pages.  
  - TaskBoard header is clickable to go back to the homepage.  

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
Navigate to the project folder:

bash
Copiar código
cd <project-folder>
Install Python dependencies:

bash
Copiar código
pip install flask werkzeug
Run the Flask app:

bash
Copiar código
python app.py
Open your browser and go to http://127.0.0.1:5000.

Usage
Sign up for a new account or log in with existing credentials.

After logging in, you will be redirected to the Task Board.

Add tasks using the input field:

Click the "Add Task" button for immediate tasks.

Click the calendar icon to schedule a task, pick date/time, then click "Add Scheduled Task".

Manage tasks:

Use the left/right arrows to move tasks between columns.

Click the trash icon to delete a task.

Click the ellipsis button to expand task details.

Theme: Use the top-right moon/sun icon to toggle dark/light mode.

Dependencies
Font Awesome for icons.

Flatpickr for the inline calendar.

Flask and Werkzeug for backend authentication and session management.

Notes
Each user has a separate session; tasks are saved in localStorage.

The TaskBoard header <h1> is clickable and returns to the homepage.

Dark mode is persistent across pages using localStorage.