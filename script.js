const correctSound = new Audio("./assets/correct.m4a");
const incorrectSound = new Audio("./assets/incorrect.m4a");
const doneSound = new Audio("./assets/done.opus");

let isSoundEnabled = true;

document.getElementById("sound-toggle").addEventListener("click", function () {
    isSoundEnabled = !isSoundEnabled;
    this.textContent = isSoundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
});

function playSound(sound) {
    if (isSoundEnabled) {
        sound.play();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
                    questions = shuffleArray(parsedQuestions);
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
    <p>${currentQuestionIndex + 1} / ${questions.length}</p>
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
            playSound(correctSound);
            score++;
        } else {
            playSound(incorrectSound);
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
        playSound(doneSound);
        document.querySelector(".next").style.display = "none";
    }
}
