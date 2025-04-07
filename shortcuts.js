document.addEventListener("keydown", (e) => {
    if (e.key) {
        e.preventDefault();

        if (!isNaN(e.key) && e.key.trim() !== '') {
            document.querySelector(`#q${Number(e.key) - 1}`).click();
        }
    }
})