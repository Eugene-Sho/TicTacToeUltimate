        var isZero = false;
        var isFinished = false;
        var dataSub = "";
        var [secondsX, minutesX] = [0, 5];
        var [secondsO, minutesO] = [0, 5];
        var interval = null;


        function onPageLoad() {
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

            for(let a = 0; a <= 2; a++)
            {
                for(let b = 0; b <= 2; b++)
                {
                    let mT = `${a}-${b}`;
                    document.getElementById(mT).style.width = (document.querySelector(`table[data-sub='${mT}']`).offsetWidth - 10) + "px";
                }
            }
            document.getElementById("bg-music").volume = 0.1;
            start();
        }


        function start()
        {
            isFinished = false;
            isZero = false;
            dataSub = "";

            let tables = document.getElementById("mainTable").querySelectorAll("table");
            tables.forEach(table => {
                table.style.backgroundColor = "rgb(150, 150, 150)";
              buttons = table.querySelectorAll("div");
              buttons.forEach(button => {
                button.innerText = "";
              });
            });
            tables = document.querySelectorAll("#mainTable > tbody > tr > td > div");
            tables.forEach(table => {
                table.innerText = "";
                table.style.display = "none";
            });
            

            clearInterval(interval);
            interval = null;
            [secondsX, minutesX] = [0, 5];
            [secondsO, minutesO] = [0, 5];
            document.getElementById("timerO").innerText = "5:00";
            document.getElementById("timerX").innerText = "5:00";

            document.getElementById("turn").style.color = "red";
            document.getElementById("turn").innerText = "X";
            document.getElementById("turn").style.textShadow = "0 0 8px rgba(256, 0, 0, 0.5), 0 0 15px rgba(256, 0, 0, 0.5)";
        }


        document.addEventListener("click", function(event) {
           if(event.target.tagName === "DIV")
            {
                if(isFinished || event.target.innerText || (event.target.getAttribute("data-main") != dataSub && dataSub)) return;
                
                if(interval === null) interval = setInterval(displayTimer, 1000);

                if(dataSub)document.querySelector(`table[data-sub="${dataSub}"]`).style.backgroundColor = "unset";
                event.target.style.color = isZero ? "blue" : "red";

                event.target.innerText = isZero ? (isZero = false, document.getElementById("turn").style.color = "red", document.getElementById("turn").style.textShadow = "0 0 8px rgba(256, 0, 0, 0.5), 0 0 15px rgba(256, 0, 0, 0.5)", document.getElementById("turn").innerText = "X", "O") : (isZero = true, document.getElementById("turn").style.color = "blue", document.getElementById("turn").style.textShadow = "0 0 8px rgba(0, 0, 256, 0.5), 0 0 15px rgba(0, 0, 256, 0.5)", document.getElementById("turn").innerText = "O", "X");
                dataSub = document.getElementById(event.target.getAttribute("data-sub")).style.display === "unset" ? "" : event.target.getAttribute("data-sub");
                
                let tables = document.querySelector(".mainTable").querySelectorAll("table");
                if(dataSub)
                {
                  for(let i = 0; i < 9; i++)
                  {
                    tables[i].style.backgroundColor = "rgb(100, 100, 100)";
                  }
                  document.querySelector(`table[data-sub="${dataSub}"]`).style.backgroundColor = "rgb(150, 150, 150)";
                }
                else
                {
                  for(let i = 0; i < 9; i++)
                  {
                    tables[i].style.backgroundColor = "rgb(150, 150, 150)";
                  }
                }

                checkWinner(event.target.getAttribute("data-main"));
                checkWinner(false);
            } 
        });


        function checkWinner(dataMain)
        {
            let buttons = dataMain ? document.querySelector(`table[data-sub="${dataMain}"]`).querySelectorAll("div") : document.querySelectorAll("#mainTable > tbody > tr > td > div");

            let isO = false;
            for(let a = 0; a <= 6; a += 3)
            {
                isO = buttons[a].innerText == "O" ? true : buttons[a].innerText == "X" ? false : null;
                if(isO && buttons[a+1].innerText == "O" && buttons[a+2].innerText == "O") return winner("O", dataMain);
                else if(isO === false && buttons[a+1].innerText == "X" && buttons[a+2].innerText == "X") return winner("X", dataMain);
            }
            for(let a = 0; a <= 2; a++)
            {
                isO = buttons[a].innerText == "O" ? true : buttons[a].innerText == "X" ? false : null;
                if(isO && buttons[a+3].innerText == "O" && buttons[a+6].innerText == "O") return winner("O", dataMain);
                else if(isO === false && buttons[a+3].innerText == "X" && buttons[a+6].innerText == "X") return winner("X", dataMain);
            }
            if(buttons[0].innerText == "O" && buttons[4].innerText == "O" && buttons[8].innerText == "O") return winner("O", dataMain);
            else if(buttons[0].innerText == "X" && buttons[4].innerText == "X" && buttons[8].innerText == "X") return winner("X", dataMain);
            else if(buttons[2].innerText == "O" && buttons[4].innerText == "O" && buttons[6].innerText == "O") return winner("O", dataMain);
            else if(buttons[2].innerText == "X" && buttons[4].innerText == "X" && buttons[6].innerText == "X") return winner("X", dataMain);

            for(let a = 0; a <= 8; a++) 
            {
                if(dataMain ? buttons[a].innerText == "" : buttons[a].style.display == "none") return;
                else if(a == 8) winner("draw", dataMain || false);
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
            if(secondsO == 0 && minutesO == 0) winner("X");
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
              if(secondsX == 0 && minutesX == 0) winner("O");
          }
        }


        function winner(winner, table = false)
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
