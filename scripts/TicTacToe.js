var isZero = false;
var isFinished = false;
var dataSub = "";
var [secondsX, minutesX] = [0, 5];
var [secondsO, minutesO] = [0, 5];
var interval = null;

function add(btn){ document.getElementById(btn).classList.add("active"); }
function rem(btn){ document.getElementById(btn).classList.remove("active"); }

function onPageLoad() 
{
    let table = document.getElementById("mainTable");
    let tbody = table.querySelector("tbody");  
    let content = "";

    if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
    }
    for(let a = 0; a <= 2; a++)
    {
        content += "<tr>"
        for(let b = 0; b <= 2; b++)
        {
            let mT = `${a}-${b}`;
            content += `
            <td>
                <div id="${mT}"></div>
                <table data-sub="${mT}">
                    <tr>
                        <td><div data-main="${mT}" data-sub="0-0"></div></td>
                        <td><div data-main="${mT}" data-sub="0-1"></div></td>
                        <td><div data-main="${mT}" data-sub="0-2"></div></td>
                    </tr>
                    <tr>
                        <td><div data-main="${mT}" data-sub="1-0"></div></td>
                        <td><div data-main="${mT}" data-sub="1-1"></div></td>
                        <td><div data-main="${mT}" data-sub="1-2"></div></td>
                    </tr>
                    <tr>
                        <td><div data-main="${mT}" data-sub="2-0"></div></td>
                        <td><div data-main="${mT}" data-sub="2-1"></div></td>
                        <td><div data-main="${mT}" data-sub="2-2"></div></td>
                    </tr>
                </table>
            </td>`;
        }
        content += "</tr>";
    }
    tbody.innerHTML += content;

    document.querySelectorAll("#mainTable > tbody > tr > td > div").forEach(div => {
      const subTable = document.querySelector(`table[data-sub='${div.id}']`);
      if (subTable) div.style.width = `${subTable.offsetWidth - 10}px`;
    });

    document.getElementById("bg-music").querySelector("source").src = "audio/music/game" + Math.floor(Math.random() * 2) + ".mp3";
    document.getElementById("bg-music").load();
    document.getElementById("bg-music").play();
    start();
}

function start()
{
    isFinished = false;
    isZero = false;
    dataSub = "";

    document.querySelectorAll("#mainTable table").forEach(table => {
        table.style.backgroundColor = "rgb(150, 150, 150)";
        table.querySelectorAll("div").forEach(button => (button.innerText = ""));
    });
    document.querySelectorAll("#mainTable > tbody > tr > td > div").forEach(table => {
        table.innerText = "";
        table.style.display = "none";
    });

    clearInterval(interval);
    interval = null;
    [secondsX, minutesX] = [0, 5];
    [secondsO, minutesO] = [0, 5];

    document.getElementById("timerO").innerText = "5:00";
    document.getElementById("timerX").innerText = "5:00";
    document.getElementById("turn").innerText = "X";

    Object.assign(document.getElementById("turn").style, {
      color: "red",
      textShadow: "0 0 8px rgba(256, 0, 0, 0.5), 0 0 15px rgba(256, 0, 0, 0.5)"
  });
}

document.addEventListener("click", function(event) {
    if(!event.target.tagName === "DIV") return;

    let targetMain = event.target.getAttribute("data-main");
    let targetSub = event.target.getAttribute("data-sub");

    if(isFinished || event.target.innerText || (dataSub && targetMain != dataSub)) return;

    if(interval === null) interval = setInterval(displayTimer, 1000);
    if(dataSub) document.querySelector(`table[data-sub="${dataSub}"]`).style.backgroundColor = "unset";
    event.target.style.color = isZero ? "blue" : "red";

    let turn = document.getElementById("turn");
    event.target.innerText = isZero 
    ? (turn.style.color = "red", turn.style.textShadow = "0 0 8px rgba(256, 0, 0, 0.5), 0 0 15px rgba(256, 0, 0, 0.5)", turn.innerText = "X", "O") 
    : (turn.style.color = "blue", turn.style.textShadow = "0 0 8px rgba(0, 0, 256, 0.5), 0 0 15px rgba(0, 0, 256, 0.5)", turn.innerText = "O", "X");
    isZero = !isZero;

    checkWinner(targetMain);
    checkWinner(false);
    dataSub = document.getElementById(targetSub).style.display === "unset" ? "" : targetSub;
    
    let tables = document.querySelectorAll(".mainTable table");
    tables.forEach(table => table.style.backgroundColor = dataSub ? "rgb(100, 100, 100)" : "rgb(150, 150, 150)");
    if(dataSub) document.querySelector(`table[data-sub="${dataSub}"]`).style.backgroundColor = "rgb(150, 150, 150)";
});


function checkWinner(dataMain)
{
    let buttons = dataMain 
    ? document.querySelector(`table[data-sub="${dataMain}"]`).querySelectorAll("div") 
    : document.querySelectorAll("#mainTable > tbody > tr > td > div");

    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6] 
    ];

    for (const [a, b, c] of winningCombinations) {
        let value = buttons[a].innerText;
        if (value && value === buttons[b].innerText && value === buttons[c].innerText) {
            return displayWinner(value, dataMain);
        }
    }

    for (let a = 0; a <= 8; a++) {
      if (dataMain ? buttons[a].innerText === "" : buttons[a].style.display === "none")return;
    }
    displayWinner("draw", dataMain);
}

function displayWinner(winner, table = false)
{
    if(table)
    {
        document.getElementById(table).style.color = winner == "O" ? "blue" : "red";
        document.getElementById(table).innerText = winner == "draw" ? "" :  winner;
        document.getElementById(table).style.display = "unset";
    }
    else
    {
      alert(winner == "X" ? "Победил крестик!" : winner == "O" ? "Победил нолик!" : minutesO > minutesX || (minutesO == minutesX && secondsO > secondsX) ? "Победил нолик по времени!" : minutesX > minutesO || (minutesX == minutesO && secondsX > secondsO) ? "Победил крестик по времени!" : "Ничья!");
      isFinished = true;
      clearInterval(interval);
      interval = null
    } 
}

function displayTimer()
{
  if(isZero)
  {
    if(secondsO == 0) 
    {
      minutesO--;
      secondsO += 59;
    }
    else secondsO--;
    if(secondsO < 10) document.getElementById("timerO").innerText = `${minutesO}:0${secondsO}`;
    else document.getElementById("timerO").innerText = `${minutesO}:${secondsO}`;
    if(secondsO == 0 && minutesO == 0) displayWinner("X");
  }
  else
  {
    if(secondsX == 0) 
      {
        minutesX--;
        secondsX += 59;
      }
      else secondsX--;
      if(secondsX < 10)document.getElementById("timerX").innerText = `${minutesX}:0${secondsX}`;
      else document.getElementById("timerX").innerText = `${minutesX}:${secondsX}`;
      if(secondsX == 0 && minutesX == 0) displayWinner("O");
  }
}
