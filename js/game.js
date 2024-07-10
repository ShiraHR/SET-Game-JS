var deck = [];
var onTable = [];
var selected = [];
var places = [];
var min_left = document.getElementById('minutes');
var sec_left = document.getElementById('seconds');
var seconds;
var minutes;
var flag = false;
var flag2 = false;
var score = 0;

function startGame() {
    if (flag2 == true) {
        return;
    }
    let curentUser = (JSON.parse(localStorage.getItem("current user")));
    let showScore = document.getElementById("userName");
    showScore.innerText = `${curentUser.name + `'s`} score:`;
    flag2 = true;
    createDeck();
    shuffleDeck();
    startCardsOnTable();
    setInterval(timerSec, 1000);
    setInterval(timerMin, 60000);
}


function createDeck() {
    const colors = ['red', 'green', 'purple'];
    const shapes = ['oval', 'squiggle', 'diamond'];
    const fillings = ['stripe', 'full', 'border'];
    const quantity = [1, 2, 3];
    let count = 1;
    for (let color in colors) {
        for (let fill in fillings) {
            for (let shape in shapes) {
                for (let qty in quantity) {

                    deck.push(new Card(count, colors[color], shapes[shape], fillings[fill], quantity[qty], '../pics/' + String(count) + '.png'));
                    count += 1;
                }
            }
        }
    }
}


function shuffleDeck() {
    for (let i = 0; i < 81; i++) {
        let rand = Math.floor(Math.random() * 81);
        let temp = deck[i];
        deck[i] = deck[rand];
        deck[rand] = temp;
    }
}


function startCardsOnTable() {
    for (let i = 80; i > 68; i--) {
        let card = document.getElementById("btn" + String(81 - i));
        card.style.backgroundImage = `url(${deck[i].pic})`;
        card.style.backgroundSize = "100% 100%";
        card.style.boxShadow = "0 0 8px 1px rgb(84, 76, 87)";
        onTable.push(deck[i]);
        deck.pop();
    }
}


function add3() {
    if (onTable.length == 12) {
        let len = deck.length - 1;
        for (let i = 0; i < 3; i++) {
            let card = document.getElementById("btn" + String(i + 13));
            card.style.backgroundImage = `url(${deck[len - i].pic})`;
            card.style.backgroundSize = "100% 100%";
            card.style.boxShadow = "0 0 8px 1px rgb(84, 76, 87)";
            document.getElementById("btn" + String(i + 13)).style.display = "block";
            onTable.push(deck[len - i]);
            deck.pop();
        }
    }
}


function CheckIfSelected() {
    let k = places.length - 1;
    flag = true;
    for (let i = places.length - 2; i >= 0; i--) {
        if (k != i) {
            if (places[k] == places[i]) {
                let c = document.getElementById("btn" + String(places[k]));
                c.style.boxShadow = "0 0 8px 1px rgb(84, 76, 87)";
                places.splice(i, 1);
                places.splice(k - 1, 1);
                selected.splice(i, 1);
                selected.splice(k - 1, 1);
                flag = false;
            }
        }
    }
}


function selectCards(event) {
    let c;
    if (selected.length < 3) {
        let idCard = event.target.getAttribute("id");
        c = document.getElementById(idCard);
        c.style.boxShadow = "0 0 8px 1px rgb(187, 204, 212)";
        let num = idCard.slice(3);
        places.push(num);
        let card = onTable[num - 1];
        selected.push(card);
        CheckIfSelected();
    }
    if (selected.length == 3) {
        let card1 = selected[0];
        let card2 = selected[1];
        let card3 = selected[2];
        if (checkIfSet(card1, card2, card3)) {
            for (let i = 0; i < 3; i++) {
                c = document.getElementById("btn" + String(places[i]));
                c.style.boxShadow = "0 0 8px 1px rgb(84, 76, 87)";
            }
            replaceCards();
            updateScore();
        }
        else {
            let audio = new Audio("../audio/game-fail-descent.mp3");
            audio.play();
            setTimeout(alertWrong, 500);
            for (let i = 0; i < 3; i++) {
                c = document.getElementById("btn" + String(places[i]));
                c.style.boxShadow = "0 0 8px 1px rgb(84, 76, 87)";
            }
        }
        selected = [];
        places = [];
    }
}


function replaceCards() {
    if (deck.length > 0 && onTable.length == 12) {
        let len = deck.length - 1;
        for (let i = 0; i < 3; i++) {
            let card = document.getElementById("btn" + String(places[i]));
            card.style.backgroundImage = `url(${deck[len - i].pic})`;
            card.style.border = "none";
            card.style.backgroundSize = "100% 100%";
            onTable[places[i] - 1] = deck[len - i];
            deck.pop();
        }
        selected = [];
        places = [];
    }
    if (deck.length >= 0 && onTable.length > 12) {
        places.sort(function (a, b) { return a - b });
        for (let k = 2; k >= 0; k--) {
            let c = document.getElementById("btn" + String(15 - k))
            c.style.display = "none";
            if (places[k] > 12) {
                let index = places.pop();
                onTable.splice([index - 1], 1);
            }
        }
        let len = onTable.length - 1;
        for (let i = 0; i < places.length; i++) {
            onTable[places[i] - 1] = onTable[len - i];
            let card = document.getElementById("btn" + String(places[i]));
            card.style.backgroundImage = `url(${onTable[places[i] - 1].pic})`;
            onTable.pop();
        }
        selected = [];
        places = [];
    }
    if (deck.length == 0 & onTable.length == 12) {
        winner();
    }
}


function checkIfSet(card1, card2, card3) {
    const feature = ["color", "shape", "fill", "qty"];
    let isMatch = false;
    for (let i = 0; i < 4; i++) {
        isMatch = false;
        if (card1[feature[i]] === card2[feature[i]]) {
            if (card1[feature[i]] === card3[feature[i]]) {
                isMatch = true;
                continue;
            }
            break;
        }
        if (card1[feature[i]] !== card3[feature[i]] && card2[feature[i]] !== card3[feature[i]]) {
            isMatch = true;
            continue;
        }
        break;
    }
    if (isMatch) {
        let audio = new Audio("../audio/chimes-noises.mp3");
        audio.play();
        return true;
    }
    selected = [];
    return false;
}


function alertWrong() {
    alert(" Wrong :( Try again...");
}


function updateScore() {
    score += 5;
    document.getElementById("score").innerHTML = score;
}


function timerSec() {
    seconds = sec_left.innerText;
    if (seconds == 0) {
        seconds = 60;
    }
    seconds--;
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    sec_left.innerText = seconds;
}


function timerMin() {
    minutes = min_left.innerText;
    minutes--;
    if (minutes < 0) {
        let audio = new Audio("../audio/ding-ding-sound-effect.mp3");
        audio.play();
        endGame();
    }
    min_left.innerText = `0${minutes}`;
}


function winner() {
    let audio = new Audio("../audio/level-up-sound-effect.mp3");
    audio.play()
    window.location.href = "./winner.html";
}


function endGame() {
    window.location.href = "./timeUp.html";
    let audio = new Audio("../audio/game-negative-sound.mp3");
    audio.play();
}


function tryAgain() {
    window.location.href = "./game.html";
}


function instructions() {
    window.location.href = "./instructions.html";
}






