# JavaScript AI Teacher - Frontend

## Overview

This is the frontend implementation for the JavaScript AI Teacher application. It provides a clean and user-friendly interface for interacting with the backend services. Users can log in, sign up, or access the application as a guest to chat with the AI teacher, who specializes in JavaScript.

---

## Features

- **Home Page**: Introduction to the app and navigation options.
- **Authentication**:
  - Sign Up: Create a new account.
  - Login: Access the application with registered credentials.
  - Guest Login: Explore the app without creating an account.
- **1-on-1 Chat Interface**:
  - Engage in real-time chat with the AI teacher.
  - Streaming-based response rendering for a conversational feel.
- **WebSocket Integration**: Supports chunk-based message appending for smooth and incremental responses.

---

## Technologies Used

- **React** (with TypeScript): Frontend framework for building UI components.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **WebSocket**: Enables real-time communication for chat functionality.

---

## Setup and Installation

### Prerequisites
- Node.js (v16 or above)
- npm or yarn

### Steps to Run the Frontend Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/romabulani/learnbot
   cd learnbot
   ```
2. Install dependencies and run:
  ```bash
    npm install
    npm run dev
  ```
---

## Deployment

The app is deployed on Vercel. You can try it out at: [https://learnbot-js.vercel.app/](https://learnbot-js.vercel.app/)

---
## Known Issues

Typing Issue: Some characters may be missing during typewriting animation. This will be addressed in future updates.

---

## License

This project is licensed under the MIT License.
