```markdown
# 📚 Biblioteca Familiar - Frontend

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made with Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/style-CSS3-264de4.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/markup-HTML5-e34c26.svg)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)

This repository contains the frontend source code for the **Biblioteca Familiar** (Family Library) project.  
It is a modern, responsive **Single-Page Application (SPA)** built with pure **Vanilla JavaScript, HTML5, and CSS3**, designed to interact with a separate Flask backend API.

The application provides a user-friendly interface for families to manage their personal book collection, track loans, and engage with their reading through gamification elements.

---

## ✨ Key Features

- **Single-Page Application (SPA):** Seamless user experience with no page reloads, managed entirely by a custom JavaScript router.  
- **Responsive Design:** Mobile-first layout that adapts to all screen sizes.  
- **Modular JavaScript Architecture:** Clean, encapsulated modules for Books, Members, and Loans.  
- **Dynamic Data Rendering:** Asynchronous fetching and rendering of backend data.  
- **Interactive UI:** Modals, tabs, and real-time search functionality.  
- **Gamification:** Member rankings, points, and levels to encourage engagement.  
- **Complete CRUD Functionality:** Manage books, members, and loans easily.  

---

## 🛠️ Technologies Used

- **HTML5:** Semantic markup and structure.  
- **CSS3:** Layout (Flexbox/Grid), styling, and animations. Modularized stylesheets.  
- **Vanilla JavaScript (ES6+):** SPA router, API communication, DOM manipulation, and event handling.  

---

## 📂 Project Structure

```

biblioteca-familiar-frontend/
├── 📄 index.html         # SPA entry point
├── 📁 css/
│   ├── style.css         # Global styles, variables, and layout
│   ├── cards.css         # Styles for card-like components
│   └── responsive.css    # Media queries for different devices
└── 📁 js/
├── app.js            # Core application controller and router
├── api.js            # Centralized API communication layer
├── utils.js          # Helper functions (modals, toasts, etc.)
├── config.js         # Config, constants, and API endpoints
├── dashboard.js      # Dashboard logic
├── livros.js         # Book catalog logic
├── membros.js        # Family members logic
├── emprestimos.js    # Loan management logic
└── wishlist.js       # Wishlist logic

````

---

## 🚀 Getting Started

To run this frontend application locally, you will need a running instance of the **biblioteca-familiar-backend** project.

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).  
- A local web server to serve the `index.html` file (Python’s built-in server works well).  

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/biblioteca-familiar-frontend.git
   cd biblioteca-familiar-frontend
````

2. **Ensure the backend is running**
   The backend API must be available at `http://localhost:5000`.
   Follow the backend setup instructions in its [README](../biblioteca-familiar-backend/README.md).

3. **Serve the application**
   Using Python 3:

   ```bash
   python -m http.server 8080
   ```

4. **Open in your browser**
   Visit: [http://localhost:8080](http://localhost:8080)

The app should now be running and connected to your backend.

---

## ✍️ Author

**Henoc** – Initial work & development

---

```
```
