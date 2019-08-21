let myLabels = document.querySelectorAll('.lbl-toggle');

Array.from(myLabels).forEach(label => {
  label.addEventListener('keydown', e => {
    // 32 === spacebar
    // 13 === enter
    if (e.which === 32 || e.which === 13) {
      e.preventDefault();
      label.click();
    };
  });
});

//TIMER CODE

//Target the HTML elements
let startBtn = document.querySelector("#functionalityBtn");
let resetBtn = document.querySelector("#resetBtn"), time = document.querySelector(".time");
let mode = document.querySelector("#beastMode"), workMin = document.getElementById("work-Min");
let breakMin = document.getElementById("break-Min");

//Declare variables 
let workTime = 25, breakTime = 5, seconds = 1500, isBreak = true, isPaused = true, countdown = 0;

//Add eventListener to the start button
startBtn.addEventListener("click", () => {
  clearInterval(countdown);
  isPaused = !isPaused;
  if(!isPaused){
    countdown = setInterval(timerFunction, 1000);
  }
})

//Add eventListener to the reset button
resetBtn.addEventListener("click", ()=> {
  clearInterval(countdown);
  seconds = workTime * 60;
  countdown = 0;
  isPaused = true;
  isBreak = true;
})

//Function to do the acual count down
function timerFunction(){
  seconds --;
  if(seconds <= 0){
    clearInterval(countdown);
    seconds = (isBreak ? breakTime : workTime) * 60;
    isBreak = !isBreak;
  }
  if(startBtn.textContent === `${breakTime} MINUTES BREAK` && isBreak){
    let tomatoCount = document.getElementById("tomatoes");
    let tomatoImage = document.getElementById("tomatoImage").innerHTML;
    //counter = " 0 ";
    tomatoCount.innerHTML += tomatoImage  ;
    let clearTomatoes = document.getElementById("clearTomatoes");
    clearTomatoes.onclick = function(){
      tomatoCount.innerHTML = "";
    }
  }
}

//The update buttons updates breakTime and/or workTime 

let incrementWork = 5, incrementBreak = 1;
let incrementFunc = {
  "work-plus":  function () {workTime = Math.min(workTime + incrementWork, 60)},
  "work-minus": function () {workTime = Math.max(workTime - incrementWork, 5)},
  "break-plus": function () {breakTime = Math.min(breakTime + incrementBreak, 60)},
  "break-minus": function () {breakTime = Math.max(breakTime - incrementBreak, 5)}
}

for (let key in incrementFunc) {
    if (incrementFunc.hasOwnProperty(key)) {
      document.getElementById(key).onclick = incrementFunc[key];
    }
}

//Add countDown to the DOM
function displayCountDown() {
  const minutes = Math.floor(seconds / 60);
  let secondsRemaining = seconds % 60;
  if(workTime === minutes && startBtn.textContent === "PAUSE"){
    startBtn.textContent = "GO ANOTHER ROUND";
  } 
  time.textContent = `${minutes}:${secondsRemaining < 10 ? "0" :""}${secondsRemaining}`;
};

//Update Button Text
function buttonText(){
  if(isPaused && countdown === 0){
    startBtn.textContent = "ACTIVATE TIMER";
  }else if(isPaused && countdown !== 0){
    startBtn.textContent = "CONTINUE";
  }else if(!isBreak){
     startBtn.textContent = `${breakTime} MINUTES BREAK`;
  }else{
    startBtn.textContent = "PAUSE";
  }
}

//Update HTML Element
function updateDOM(){
  buttonText();
  displayCountDown();
  isBreak ? mode.textContent = "Work Mode" : mode.textContent = "Resting Mode" ;
  //isBreak ? console.log("Beast Mode") : console.log("Resting Mode") 

  workMin.textContent = workTime;
  breakMin.textContent = breakTime;
}
window.setInterval(updateDOM, 100);

// Get the modal,modal button, the span element,
let modal = document.getElementById('myModal');
let btn = document.getElementById("answer");
let span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


//Register ServiceWorker
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => { 
    console.log("Service Worker Registered."); 
  }).catch(() => {
    console.log("Service Worker Registration failed");
  });
}
