/*const user = window.Telegram.WebApp.initDataUnsafe?.user;
if (!user) {
    alert("Не удалось получить данные Telegram");
    throw new Error("Нет данных пользователя");
}
*/
var interval1 = null;
var interval2 = null;
const randomNumber = Math.floor(100000000 + Math.random() * 900000000);

async function findMatch() {
    const userId = randomNumber;
    const firstName = document.getElementById("firstName").value;
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
        document.getElementById("userId").style.display = "none";
        document.getElementById("firstName").style.display = "none";
        document.getElementById("playBtn").style.display = "none";
        document.getElementById("cancelBtn").style.display = "unset";
        checkMatchStatus();
    } else {
        alert("Матч найден");
        document.getElementById("userId").style.display = "none";
        document.getElementById("firstName").style.display = "none";
        document.getElementById("playBtn").style.display = "none";
        document.getElementById("cancelBtn").style.display = "none";
        displayBoard(result.whoseTurn);
    }
}

async function checkMatchStatus() {
    const userId = randomNumber;
    interval1 = setInterval(async () => {
        const response = await fetch(`https://dweller.mooo.com/match-status?userId=${userId}`);
        const result = await response.json();
        console.log(result);
        if (result.found) {
            clearInterval(interval1);
            interval1 = null;
            document.getElementById("userId").style.display = "none";
            document.getElementById("firstName").style.display = "none";
            document.getElementById("playBtn").style.display = "none";
            document.getElementById("cancelBtn").style.display = "none";
            displayBoard(result.whoseTurn);
        }
    }, 1000);
}

async function getGameState()
{
    const userId = randomNumber;
    interval2 = setInterval(async () => {
        const response = await fetch(`https://dweller.mooo.com/game-state?userId=${userId}`);
        const data = await response.json();
        for(let y = 0; y < 3; y++)
        {
            for(let x = 0; x < 3; x++)
            {
                document.getElementById(`${y}-${x}`).innerText = data.board[y][x];
            }
        }
        if(data.whoIsWinner != "") 
        {
            document.getElementById("whose-turn").innerText = data.whoseTurn == userId ? "You lose :(" : "You won!";
            document.getElementById("playBtn").style.display = "unset";
            clearInterval(interval2);
            interval2 = null;
        }
        else document.getElementById("whose-turn").innerText = data.whoseTurn == userId ? "Your turn" : "Opponents turn";;
    }, 1000);
}

function displayBoard(whoseTurn)
{
    const userId = randomNumber;
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
    const userId = randomNumber;
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
        document.getElementById(`${y}-${x}`).innerText = data.isX ? "X" : "O";
        if((data.whoIsWinner == "X" && data.isX) || (data.whoIsWinner == "O" && !data.isX)) 
        {
            document.getElementById("whose-turn").innerText = data.isX ? "You won!" : "You lose :(";
            document.getElementById("playBtn").style.display = "unset";
            clearInterval(interval2);
            interval2 = null;
        }
    })
    .catch(error => {
        console.error("Ошибка", error);
    });
}

function cancelMatchmaking() {
    const userId = randomNumber;
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
    //document.getElementById("userId").style.display = "unset";
    //document.getElementById("firstName").style.display = "unset";
    document.getElementById("playBtn").style.display = "unset";
    document.getElementById("cancelBtn").style.display = "none";
    document.getElementById("whose-turn").innerText = "TicTacToe";
}
