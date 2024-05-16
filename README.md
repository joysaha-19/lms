
# Lesson Management System

## Overview

The Lesson Management System is an educational platform that allows users to register either as students or teachers. It provides flexible access to educational resources and course management capabilities.

### Features

- **Registration**: Users sign up as both students and teachers.
- **Course Access**: The first lecture of each course is available for free to all registered students, providing a preview of the course content. To access subsequent lectures, students must purchase the course.
- **Course Management**: Teachers have the ability to add and edit courses within the platform.
- **Analytics**: Teachers receive updates on enrollment numbers and earnings per course, helping them understand which courses are most popular and profitable.

## Technology Stack

This application uses the following technologies:

- **Frontend**: React.js, HTML, CSS, Material-UI
  - **React.js**: Handles the UI components and state management.
  - **HTML/CSS**: Used for markup and styling.
  - **Material-UI**: A React UI framework that provides ready-to-use components that follow material design principles.
  
- **Backend**: Node.js with Express
  - **Node.js**: The runtime environment for running JavaScript on the server.
  - **Express**: A web application framework for Node.js, designed for building web applications and APIs.
  
- **Database**: MongoDB
  - **MongoDB**: A NoSQL database used to store application data in a flexible, JSON-like format.

## Installation and Setup

Follow these instructions to set up the app locally.

### Prerequisites

You need to have Node.js and MongoDB installed on your computer. Download Node.js from [Node.js website](https://nodejs.org/) and MongoDB from [MongoDB website](https://www.mongodb.com/try/download/community) if you haven't installed them yet.

### Cloning the Repository

Start by cloning the repository to your local machine. To do this, run the following command in your terminal:

```bash
git clone <repository-url>
```

Replace `<repository-url>` with the URL of the repository.

### Setting Up the Backend

1. Navigate to the backend directory from the root of the cloned repository:

    ```bash
    cd backend
    ```

2. Install all required dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

### Setting Up the Frontend

1. Open a new terminal and navigate to the frontend directory from the root of the cloned repository:

    ```bash
    cd frontend
    ```

2. Install all required dependencies:

    ```bash
    npm install
    ```

3. Start the frontend application:

    ```bash
    npm start
    ```

This will run the frontend of the Lesson Management System on your local machine, and you should be able to access it through your web browser at `http://localhost:3000`.

## Usage

After setting up both the frontend and backend, navigate to `http://localhost:3000` in your web browser to start using the application. Register as a student or teacher to explore the functionalities provided by the Lesson Management System.

