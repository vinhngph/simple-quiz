document.addEventListener("keydown", (e) => {
    if (e.key) {
        e.preventDefault();

        if (!isNaN(e.key) && e.key.trim() !== '') {
            document.querySelector(`#q${Number(e.key) - 1}`).click();
        } else if (e.code === "Space") {
            e.preventDefault();

            const btnNext = document.querySelector(".btn-next");
            if (!btnNext.disabled && !document.querySelector(".quiz-container").classList.contains("hidden")) {
                btnNext.click();
            }
        }
    }
})