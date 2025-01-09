/**
 * Global variables
 */
const correctSound = new Audio("./assets/correct.m4a");
const incorrectSound = new Audio("./assets/incorrect.m4a");
const doneSound = new Audio("./assets/done.mp3");

let isSoundEnabled = true;

let currentQuestionIndex = 0;
let questions = [];
let score = 0;

// Handle sound effects
const handleSoundEffects = () => {
    isSoundEnabled = !isSoundEnabled;
    document.getElementById("sound-toggle").textContent = isSoundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
}
const playSound = (sound) => {
    if (isSoundEnabled) {
        sound.play();
    }
}
// --------------------------------------------------------------------------------------


/**
 * Uploading JSON file
 */
document.getElementById("json-upload").addEventListener("change", (changeEvent) => {
    const files = changeEvent.target.files;

    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            try {
                const parsedQuiz = JSON.parse(loadEvent.target.result);
                if (validateQuestions(parsedQuiz)) {
                    const id = "quiz_" + crypto.randomUUID();
                    localStorage.setItem(id, JSON.stringify(parsedQuiz));
                    addQuizName(id, file.name);
                    addList(id, file.name);
                } else {
                    showError("Invalid JSON format. Please upload a valid file.");
                }
            } catch (error) {
                showError("Invalid JSON format. Please upload a valid file.");

            }
        }
        reader.readAsText(file);
    })
})
const validateQuestions = (data) => {
    return Array.isArray(data) && data.every(q =>
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        Array.isArray(q.answers)
    )
}
const showError = (message) => {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}
const addList = (id, name) => {
    if (JSON.parse(localStorage.getItem("list_name")).length === 1) document.querySelector(".list-empty").classList.add("hidden");

    const quizList = document.querySelector(".quiz-list");

    const quizli = document.createElement("li");
    quizli.id = id;

    const quizliq = document.createElement("p");
    quizliq.textContent = name;
    quizliq.onclick = () => updateName(quizliq, id);
    quizli.appendChild(quizliq);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "quiz-buttons-container";

    const quizlibutton = document.createElement("button");
    quizlibutton.className = "btn-get-quiz";
    quizlibutton.value = id;
    quizlibutton.textContent = "TRY";
    quizlibutton.onclick = () => showQuiz(id);
    buttonsContainer.appendChild(quizlibutton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete-quiz";
    deleteButton.value = id;
    deleteButton.textContent = "DELETE";
    deleteButton.onclick = () => deleteQuiz(id);
    buttonsContainer.appendChild(deleteButton);

    quizli.appendChild(buttonsContainer);
    quizList.appendChild(quizli);
    document.querySelector(".quiz-stored").appendChild(quizList);
}

// Maping quiz stored name
const addQuizName = (id, name) => {
    if (localStorage.getItem("list_name") === null) {
        const newQuiz = [
            {
                "id": id,
                "name": name
            }
        ]
        localStorage.setItem("list_name", JSON.stringify(newQuiz));
    } else {
        const newQuiz = {
            "id": id,
            "name": name
        }
        let quizName = JSON.parse(localStorage.getItem("list_name"));
        quizName.push(newQuiz);
        localStorage.setItem("list_name", JSON.stringify(quizName));
    }
}

// --------------------------------------------------------------------------------------


/**
 * Doing quiz
 */
const showQuiz = (quizID) => {
    const quiz = JSON.parse(localStorage.getItem(quizID));
    questions = shuffleArray(quiz);

    document.querySelector(".upload-container").classList.add("hidden");
    document.querySelector(".quiz-stored").classList.add(("hidden"));
    document.querySelector(".btn-done").classList.add("hidden");

    document.querySelector(".quiz-container").classList.remove("hidden");
    document.querySelector(".btn-next").classList.remove("hidden");
    showQuestion();
}
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
const showQuestion = () => {
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

    document.querySelector(".btn-next").disabled = true;
}
const checkSelection = () => {
    const selectedOptions = Array.from(
        document.querySelectorAll(`#quiz-content input[type="checkbox"]:checked`)
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

        document.querySelector(".btn-next").disabled = false;
    }
}
const nextQuestion = () => {
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
        document.querySelector(".btn-next").classList.add("hidden");
        document.querySelector(".btn-done").classList.remove("hidden");
    }
}
// --------------------------------------------------------------------------------------

const deleteQuiz = (quizID) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
        localStorage.removeItem(quizID);

        let quizzes = JSON.parse(localStorage.getItem("list_name"));
        quizzes = quizzes.filter((quiz) => quiz.id !== quizID);

        if (quizzes.length === 0) {
            localStorage.removeItem("list_name");
        } else {
            localStorage.setItem("list_name", JSON.stringify(quizzes));
        }

        // Remove from UI
        const quizList = document.querySelector(".quiz-list");

        document.getElementById(quizID).remove();

        // Check if list is empty
        if (quizList.children.length === 0) {
            document.querySelector(".list-empty").classList.remove("hidden");
            return;
        }
    }
}

const updateName = (element, id) => {
    const originalText = element.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;

    element.replaceWith(input)

    input.focus();

    const saveSchanges = () => {
        const newText = input.value.trim() || originalText;

        let listName = JSON.parse(localStorage.getItem("list_name"));
        listName.forEach((quiz) => {
            if (quiz.id === id) {
                quiz.name = newText;
            }
        });
        localStorage.setItem("list_name", JSON.stringify(listName));

        const newElement = document.createElement(element.tagName.toLowerCase());
        newElement.textContent = newText;
        newElement.onclick = () => updateName(newElement, id);
        input.replaceWith(newElement);
    }

    input.addEventListener("blur", saveSchanges);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveSchanges();
    })
}

const loadQuizStored = () => {
    const quizzes = JSON.parse(localStorage.getItem("list_name"));
    if (quizzes === null) {
        document.querySelector(".list-empty").classList.remove("hidden");
        return;
    }
    document.querySelector(".list-empty").classList.add("hidden");
    const quizLength = quizzes.length;
    const quizList = document.querySelector(".quiz-list");

    for (let i = 0; i < quizLength; i++) {
        const quizID = quizzes[i].id;
        const quizName = quizzes[i].name;

        const quizli = document.createElement("li");
        quizli.id = quizID;

        const quizliq = document.createElement("p");
        quizliq.textContent = quizName;
        quizliq.onclick = () => updateName(quizliq, quizID);

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "quiz-buttons-container";

        const quizlibutton = document.createElement("button");
        quizlibutton.className = "btn-get-quiz";
        quizlibutton.value = quizID;
        quizlibutton.textContent = "TRY";
        quizlibutton.onclick = () => showQuiz(quizID);

        const deleteButton = document.createElement("button");
        deleteButton.className = "btn-delete-quiz";
        deleteButton.value = quizID;
        deleteButton.textContent = "DELETE";
        deleteButton.onclick = () => deleteQuiz(quizID);

        buttonsContainer.appendChild(quizlibutton);
        buttonsContainer.appendChild(deleteButton);

        quizli.appendChild(quizliq);
        quizli.appendChild(buttonsContainer);
        quizList.appendChild(quizli);
    }
}
// --------------------------------------------------------------------------------------

const closeQuiz = () => {
    document.querySelector(".upload-container").classList.remove("hidden");
    document.querySelector(".quiz-stored").classList.remove(("hidden"));
    document.querySelector(".quiz-container").classList.add("hidden");

    currentQuestionIndex = 0;
    questions = [];
    score = 0;
}

/**
 * Load first
 */
loadQuizStored();