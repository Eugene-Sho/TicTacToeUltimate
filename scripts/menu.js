const tg = window.Telegram.WebApp;
    tg.setHeaderColor("#1a1a1a");
    tg.isClosingConfirmationEnabled = true;
    tg.isVerticalSwipesEnabled = false;
    tg.expand();

    document.addEventListener("click", () => {
        const audio = document.getElementById("bg-music");
        audio.volume = 0.1;
        audio.play().catch(error => console.log("Автовоспроизведение заблокировано:", error));
    });