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
    function TTTmenu(isEnter)
    {
        document.getElementById("btn1").style.display = isEnter ? "none" : "unset";
        document.getElementById("btn2").style.display = isEnter ? "none" : "unset";
        document.getElementById("btn3").style.display = !isEnter ? "none" : "unset";
        document.getElementById("btn4").style.display = !isEnter ? "none" : "unset";
        document.getElementById("returnBtn").style.display = !isEnter ? "none" : "unset";
        document.getElementById("logo").innerText = isEnter ? "Ultimate TicTacToe" : "EUGENE's MEGA ULTRA SUPER DUPER GAMES";
    }
