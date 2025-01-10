# Simple Quiz 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)

> **Create and take quizzes quickly by simply uploading a JSON file!**

Simple Quiz is a lightweight and user-friendly web application designed to streamline the process of creating quizzes. Just upload a JSON file, and you can instantly generate a fully functional quiz. With features like result tracking and file management, QuizMaster is the perfect tool for educators, students, or anyone who needs a fast and flexible quiz solution.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [JSON Format](#json-format)
- [License](#license)

---

## Features

- 📂 **Upload JSON Files**: Easily upload quiz data in JSON format to generate a quiz.
- 📝 **Real-time Quiz Taking**: Answer questions directly in the app and get immediate feedback.
- 📊 **Result Tracking**: Automatically calculates and displays quiz results.
- 💾 **File Management**: View and manage uploaded JSON files for future use.
- 🌐 **Browser-based**: No installation required; simply run in any modern web browser.

---

## Demo

Check out a live demo of QuizMaster here: [https://vinhngph.github.io/simple-quiz/](#)

---

## Installation

Follow these steps to set up Simple Quiz locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/vinhngph/simple-quiz.git
   cd simple-quiz

---

## JSON Format

To use this application, your JSON file should follow the structure below:

```json
[
    {
        "question": "Which of the following are programming languages? (Multiple choice)",
        "options": ["Python", "HTML", "CSS", "JavaScript"],
        "answers": [0, 3]
    },
    {
        "question": "What is the boiling point of water? (Single choice)",
        "options": ["100°C", "90°C", "50°C", "120°C"],
        "answers": [0]
    }
]
```

---

## License
This project is licensed under the MIT License.
