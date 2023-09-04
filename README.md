# API Project README

Welcome to the documentation for your API project. This README provides an overview of the available endpoints and their functionality.

## Table of Contents

- [Introduction](#introduction)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Admin Endpoints](#admin-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Question Endpoints](#question-endpoints)

## Introduction

This API serves as a backend for a question-and-answer platform. It offers various endpoints for user management, authentication, and interacting with questions and answers. Below, you'll find details about how to use each endpoint.

## Authentication

Before using most of the endpoints, you need to authenticate. To do so, include an `Authorization` header with a valid access token in your request. The access token is obtained during registration or login and is used to identify the user making the request.

## Endpoints

### Admin Endpoints

#### 1. Block User (GET /api/admin/block/:id)

- **Description:** Block a single user by their ID.
- **Response:** `{"success": true, "message": "Block, unblock process is successful"}`

#### 2. Delete User (DELETE /api/admin/block/:id)

- **Description:** Delete a single user by their ID.
- **Response:** `{"success": true, "message": "User delete process is successful"}`

### Authentication Endpoints

#### 3. Register (POST /api/auth/register)

- **Description:** Register a user by providing their email, password, and name.
- **Response:** `{"success": true, "access_token": "token", "data": { "username", "email", "userId" }}`
- **Note:** An access token is added to cookies.

#### 4. Login (POST /api/auth/login)

- **Description:** Log in a user by providing their email and password.
- **Response:** `{"success": true, "access_token": "token", "data": { "username", "email", "userId" }}`
- **Note:** An access token is added to cookies.

#### 5. Forgot Password (POST /api/auth/forgotpassword)

- **Description:** Request a password reset link via email by providing the user's email.
- **Response:** `{"success": true, "message": "Mail sent"}`

#### 6. Upload Profile Image (POST /api/auth/upload)

- **Description:** Add a profile image by uploading a file.
- **Response:** `{"success": true, "message": "Upload successful", "data": user}`

#### 7. Logout (GET /api/auth/logout)

- **Description:** Log out the currently authenticated user.
- **Response:** `{"success": true, "message": "Logged out"}`

#### 8. Get Profile (GET /api/auth/profile)

- **Description:** Get profile information for the currently authenticated user.
- **Response:** `{"success": true, "data": user}`

#### 9. Reset Password (PUT /api/auth/resetpassword)

- **Description:** Reset a user's password using a token from queries.
- **Response:** `{"success": true, "data": user}`

### Question Endpoints

#### 10. Get Single Question (GET /api/question/id)

- **Description:** Get a single question with its answers and pagination of answers.
- **Response:** `{"success": true, "answerCount", "pagination", "data"}`

#### 11. Get All Questions (GET /api/question)

- **Description:** Get all questions with pagination.
- **Response:** `{"success": true, "questionCount", "pagination", "data"}`

#### 12. Ask a Question (POST /api/question/ask)

- **Description:** Ask a question by providing a title and content.
- **Response:** `{"success": true, "question"}`

#### 13. Edit a Question (PUT /api/question/:id/edit)

- **Description:** Edit a question by its ID.
- **Response:** `{"success": true, "question"}`

#### 14. Like a Question (GET /api/question/:id/like)

- **Description:** Like a question.
- **Response:** `{"success": true, "question"}`

#### 15. Undo Like a Question (GET /api/question/:id/undolike)

- **Description:** Undo a like on a question.
- **Response:** `{"success": true, "question"}`

#### 16. Delete a Question (DELETE /api/question/:id/delete)

- **Description:** Delete a question.
- **Response:** `{"success": true, "message": "Question is deleted"}`

#### 17. Post an Answer (POST /api/question/:id/answers/)

- **Description:** Post an answer to a question.
- **Response:** `{"success": true, "answer"}`

#### 18. Get All Answers (GET /api/question/:id/answers/)

- **Description:** Get all answers for a question.
- **Response:** `{"count", "success": true, "data"}`

#### 19. Get Single Answer (GET /api/question/:id/answers/:answerId)

- **Description:** Get a single answer for a question.
- **Response:** `{"success": true, "data"}`

#### 20. Edit an Answer (PUT /api/question/:id/answers/:answerId)

- **Description:** Edit an answer by its ID.
- **Response:** `{"success": true, "answer"}`

#### 21. Delete an Answer (DELETE /api/question/:id/answers/:answerId/delete)

- **Description:** Delete an answer by its ID.
- **Response:** `{"success": true, "message": "Answer Deleted"}`

#### 22. Like an Answer (GET /api/question/:id/answers/:answerId/like)

- **Description:** Like an answer.
- **Response:** `{"success": true, "message": "Answer liked"}`

#### 23. Undo Like an Answer (GET /api/question/:id/answers/:answerId/undolike)

- **Description:** Undo a like on an answer.
- **Response:** `{"success": true, "message": "Answer undoliked"}`

Feel free to explore and use these endpoints to build your question-and-answer platform. Remember to authenticate using the access token for protected routes.
