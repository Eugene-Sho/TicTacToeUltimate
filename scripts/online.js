var userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
var firstName = window.Telegram.WebApp.initDataUnsafe?.user?.first_name;
if (!userId) {
    console.log("Не удалось получить ID Telegram");
    userId = Math.floor(100000000 + Math.random() * 900000000);
    
}
if(!firstName)
{
    console.log("Не удалось получить имя Telegram");
    firstName = "Неизвестный";
}
var interval1 = null;
var interval2 = null;
var randomNumber = Math.floor(100000000 + Math.random() * 900000000);

function onPageLoad()
{
    findMatch();
}

async function findMatch() {
    document.getElementById("playBtn").style.display = "none";
    document.getElementById("game-board").innerHTML = "";
    document.getElementById("whose-turn").innerText = "Looking for opponent...";
    const response = await fetch("https://dweller.mooo.com/find-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userId: userId,
            firstName: firstName
        })
    });

    const result = await response.json();
    console.log(result);
    if (!result.found) {
        checkMatchStatus();
    } else {
        document.getElementById("returnBtn").style.display = "none";
        displayBoard(result.whoseTurn);
    }
}

async function checkMatchStatus() {
    interval1 = setInterval(async () => {
        let dots = document.getElementById("whose-turn").innerText.slice(20);
        document.getElementById("whose-turn").innerText = dots.length == 3 ? document.getElementById("whose-turn").innerText.slice(0, -2) : document.getElementById("whose-turn").innerText + ".";
        const response = await fetch(`https://dweller.mooo.com/match-status?userId=${userId}`);
        const result = await response.json();
        console.log(result);
        if (result.found) {
            clearInterval(interval1);
            interval1 = null;
            document.getElementById("returnBtn").style.display = "none";
            displayBoard(result.whoseTurn);
        }
    }, 1000);
}

function cancelMatchmaking() {
    fetch(`https://dweller.mooo.com/cancel-match?userId=${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.ok) {
            console.log("Пользователь удален из списка ожидания");
        } else {
            console.error("Ошибка при отмене");
        }
    }).catch(error => {
        console.error("Ошибка в сети: ", error);
    });
    clearInterval(interval1);
    interval1 = null;
    loadPage("menu", true);
}

async function getGameState()
{
    interval2 = setInterval(async () => {
        const response = await fetch(`https://dweller.mooo.com/game-state?userId=${userId}`);
        const data = await response.json();
        for(let y = 0; y < 3; y++)
        {
            for(let x = 0; x < 3; x++)
            {
                document.getElementById(`${y}-${x}`).style.color = data.board[y][x] == "X" ? "red" : "blue";
                document.getElementById(`${y}-${x}`).innerText = data.board[y][x];
            }
        }
        if(data.whoIsWinner != "") 
        {
            if(data.whoIsWinner != "draw") document.getElementById("whose-turn").innerText = data.whoseTurn == userId ? "You lose :(" : "You won :)";
            else document.getElementById("whose-turn").innerText = "Draw :|";
            document.getElementById("playBtn").style.display = "unset";
            document.getElementById("returnBtn").style.display = "unset";
            clearInterval(interval2);
            interval2 = null;
        }
        else document.getElementById("whose-turn").innerText = data.whoseTurn == userId ? "Your turn" : "Opponents turn";;
    }, 1000);
}

function displayBoard(whoseTurn)
{
    document.getElementById("whose-turn").innerText = whoseTurn == userId ? "Your turn" : "Opponents turn";

    const boardElement = document.getElementById("game-board");
    boardElement.innerHTML = '';

    for(let y = 0; y < 3; y++)
    {
        const row = document.createElement("div");
        row.className = "row";

        for (let x = 0; x < 3; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = y + "-" + x;
            cell.textContent = "";
            cell.onclick = () => makeMove(y, x);
            row.appendChild(cell);
        }
        
        boardElement.appendChild(row);
    }
    getGameState();
}   

function makeMove(y, x)
{
    if(interval2 == null) return;
    fetch(`https://dweller.mooo.com/make-move`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            UserId: userId,
            X: x,
            Y: y
        }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("whose-turn").innerText = data.whoseTurn == userId ? "Your turn" : "Opponents turn";
        document.getElementById(`${y}-${x}`).style.color = data.isX ? "red" : "blue";
        document.getElementById(`${y}-${x}`).innerText = data.isX ? "X" : "O";
        if(data.whoIsWinner != "") 
        {
            if(data.whoIsWinner != "draw") document.getElementById("whose-turn").innerText = "You won :)";
            else document.getElementById("whose-turn").innerText = "Draw :|";
            document.getElementById("playBtn").style.display = "unset";
            document.getElementById("returnBtn").style.display = "unset";
            clearInterval(interval2);
            interval2 = null;
        }
    })
    .catch(error => {
        console.error("Ошибка", error);
    });
}
