var buttonsToHide = ["btn1", "btn2"];
var buttonsToShow = ["btn3", "btn4", "returnBtn"];

function add(btn){ document.getElementById(btn).classList.add("active"); }
function rem(btn){ document.getElementById(btn).classList.remove("active"); }

document.addEventListener("click", () => {
    const audio = document.getElementById("bg-music");
    audio.play().catch(error => console.log("Заблокировано:", error));
});
function TTTmenu(isEnter)
{
    buttonsToHide.forEach(buttonId => { document.getElementById(buttonId).style.display = isEnter ? "none" : "unset"; });
    buttonsToShow.forEach(buttonId => { document.getElementById(buttonId).style.display = isEnter ? "unset" : "none"; });

    document.getElementById("logo").innerText = isEnter ? "Ultimate TicTacToe" : "EUGENE's MEGA ULTRA SUPER DUPER GAMES";
}
