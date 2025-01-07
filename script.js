let currentQuestionIndex = 0;
let questions = [];
let score = 0;

document.getElementById("json-upload").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const parsedQuestions = JSON.parse(e.target.result);

                if (validateQuestions(parsedQuestions)) {
                    questions = parsedQuestions;
                    document.querySelector(".upload-container").style.display = "none";
                    document.querySelector(".quiz-container").style.display = "block";
                    showQuestion();
                } else {
                    showError("Invalid JSON format. Please upload a valid file.");
                }
            } catch (error) {
                showError("Invalid JSON format. Please upload a valid file.");
            }
        };

        reader.readAsText(file);
    }
}

function showError(message) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function validateQuestions(data) {
    return Array.isArray(data) && data.every(q =>
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        Array.isArray(q.answers)
    );
}

function showQuestion() {
    const quizContent = document.getElementById("quiz-content");
    const question = questions[currentQuestionIndex];
    quizContent.innerHTML = `
    <div class="quiz-question">
      <p>${question.question}</p>
      <ul class="quiz-options">
        ${question.options
            .map(
                (option, index) => `
          <li>
            <input type="checkbox" id="q${index}" value="${index}" onclick="checkSelection()" />
            <label for="q${index}">${option}</label>
          </li>
        `
            )
            .join("")}
      </ul>
    </div>
  `;

    document.querySelector(".next").disabled = true;
}

function checkSelection() {
    const selectedOptions = Array.from(
        document.querySelectorAll(`input[type="checkbox"]:checked`)
    ).map(input => parseInt(input.value));

    const question = questions[currentQuestionIndex];
    const correctAnswers = question.answers.sort();

    if (selectedOptions.length === correctAnswers.length) {
        const allOptions = document.querySelectorAll(".quiz-options label");

        allOptions.forEach(label => {
            const value = parseInt(label.htmlFor.replace("q", ""));
            if (correctAnswers.includes(value)) {
                label.classList.add("correct");
            } else if (selectedOptions.includes(value)) {
                label.classList.add("incorrect");
            }
        });

        if (JSON.stringify(selectedOptions.sort()) === JSON.stringify(correctAnswers)) {
            score++;
        }

        document.querySelectorAll(".quiz-options input").forEach(input => {
            input.disabled = true;
        });

        document.querySelector(".next").disabled = false;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById("quiz-content").innerHTML = `
      <div class="quiz-summary">
        <p>Quiz completed! 🎉</p>
        <p>Your score: ${score} / ${questions.length}</p>
      </div>
    `;
        document.querySelector(".next").style.display = "none";
    }
}