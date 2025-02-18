    document.addEventListener("click", () => {
        const audio = document.getElementById("bg-music");
        audio.volume = 0.1;
        audio.play().catch(error => console.log("Автовоспроизведение заблокировано:", error));
    });
    function onPageLoad()
    {
        document.getElementById("bg-music").volume = 0.1;
    }
    function add(btn)
    {
        document.getElementById(btn).classList.add("active");
    }
    function rem(btn)
    {
        document.getElementById(btn).classList.remove("active");
    }
