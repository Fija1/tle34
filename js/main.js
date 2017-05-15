/**
 * Created by wim on 30/03/17.
 */


/**
 * array with the items the players has already found
 * @type {array}
 */
var foundItems = [];

/**
 * amout af items
 * @type {number}
 */
var numberOfItems;

/**
 * value of the timer
 * @type {number}
 */
var timer = 0

/**
 * id of the timer interval
 * @type {number}
 */
var timerId = 0;

/**
 * points the payer had earned
 */
var points = 0;

var levelNummer = new URLSearchParams(window.location.search).get("level");


//load the level and init the game
loadLevel(levelNummer).then(initGame);

/**
 * add the onClick listerners to the items
 */
function initGame(){
    numberOfItems = $('.item').length;

    $("#counterTotal").html(numberOfItems);
    
    $(".item").click(itemClick);

    /**
     * increases the timer every 1s with 1
     */
    timerId = setInterval(function () {
        let elem = $("#timer");

        elem.html(timer++);

        let newElem = elem.clone(true);
        elem.before(newElem);
        elem.remove();

        elem = newElem;

        let left = $("#background").width() - elem.width() - 10;
        elem.css({'left': left});
    }, 1000);

    /**
     * add the miscliked eventlistener
     */
    document.getElementById("background").addEventListener('click', misClicked);

}

/**
 * shows the big messageBox.
 * will remove all other messageBoxes show
 * @param msg
 * @param flash
 */
function showMessageBox(msg, flash = true) {
    let messageBoxes = $(".messageBox");
    if (messageBoxes.length) messageBoxes.remove();

    let elem = document.createElement('p');
    elem.classList.add("messageBox");
    elem.innerHTML = msg;
    document.body.append(elem);

    if (flash) {
        setTimeout(function () {
            this.elem.remove();
        }.bind({elem}), 2500);
    }
}

/**
 * updates the counter with the current number of found items
 */
function updateCounter() {
    let elem = $("#counterNumber");
    
    elem.html(foundItems.length);

    newElem = elem.clone(true);
    elem.before(newElem);
    elem.remove();
}

/**
 * checks if the player has won
 * if so, show the 'you have won' message and stop the timer
 */
function checkForWin() {
    if (foundItems.length === numberOfItems) {
        document.getElementById("levelComplete").play();

        showMessageBox("Je hebt gewonnen!", false);
        clearInterval(timerId);

        var timePoints = 60 - timer + 1;
        timePoints < 0 ? timePoints = 0 : timePoints = timePoints;
        addPoints(timePoints);

        setTimeout(() => {
            levelNummer++;
            window.location.href = "/level.html?level=" + levelNummer;
        }, 4000);
    }
}

/**
 * eventListener for misclicks
 * @param {event} e 
 */
function misClicked(e){
    addPoints(-5);
    document.getElementById("wrongClick").play();
}

/**
 * 
 */
var pointTimerId = 0;
/**
 * add i to the points and redraw the elem
 * @param {number} i 
 */
function addPoints(i){
    let displayPoints = i;
    displayPoints > 0 ? displayPoints = "+" + displayPoints : displayPoints = displayPoints;
    
    let displayPointsElem = $("#newPoints");
    
    displayPointsElem.html(displayPoints);
    
    let newDisplayPointsElem = displayPointsElem.clone(true);
    displayPointsElem.before(newDisplayPointsElem);
    displayPointsElem.remove();

    clearTimeout(pointTimerId);

    pointTimerId = setTimeout(() => {
        $("#newPoints").html("");
    }, 1500);

    if(points + i < 0) return;

    points += i;

    let pointElem = $("#pointsNumber");
    pointElem.html(points);
    
    // let newElem = pointElem.clone(true);
    // pointElem.before(newElem);

    // pointElem.remove();    
}

/**
 * eventListener for the items
 * @param {event} e 
 */
function itemClick(e){
    if (foundItems.indexOf(e.target.id) !== -1) return;

    foundItems.push(e.target.id);
    e.target.classList.add("black", "pop");

    addPoints(10);
    document.getElementById("correctClick").play();
    // showMessageBox(succesMessage);
    updateCounter();
    checkForWin();
}