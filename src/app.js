const startButton = document.querySelector(".btn-start");
const rightButton = document.querySelector(".d-pad__btn--right");
const leftButton = document.querySelector(".d-pad__btn--left");
const downButton = document.querySelector(".d-pad__btn--down");
const upButton = document.querySelector(".d-pad__btn--up");
let iframe;
let parent;
let children;
let numItems; //Number of Pokemon available to select
var count = 0;

//Start Game
startButton.addEventListener("click", () => {
  const selectionPage = "selection-screen.html";
  //Display Selection Screen
  document.getElementsByName("screen-display")[0].src = selectionPage;
  setTimeout(() => {
    getIframe();
  }, 2000);
});

//Load iFrame Nodes
async function getIframe() {
  iframe = document.getElementById("iframe");
  parent = iframe.contentWindow.document.querySelector(".selection__list");
  numItems =
    iframe.contentWindow.document.querySelector(".selection__list").children.length - 1;
  children = parent.children;
}

//--------Console Control - Selection Screen--------//
//Right button moves selection border one over to the right
rightButton.addEventListener("click", () => {
  count = count + 1;
  if (count > numItems) {
    count = 8;
  } else {
    //removes selection border from previous selection
    children[count -1].classList.remove("selection__card--border");
    //adds selection border to current selection
    children[count].classList.add("selection__card--border");
  }
});

//Left button moves selection border one over to the left
leftButton.addEventListener("click", () => {
  count = count - 1;
  if (count < 0) {
    count = 0;
  } else {
    //removes selection border from previous selection
    children[count +1].classList.remove("selection__card--border");
    //adds selection border to current selection
    children[count].classList.add("selection__card--border");
  }
});

//Down button moves selection border one below
downButton.addEventListener("click", () => {
  count = count + 3;
  if (count > numItems) {
    count = count - 3;
  } else {
    // //removes selection border from previous selection
    children[count - 3].classList.remove("selection__card--border");
    //adds selection border to current selection
    children[count].classList.add("selection__card--border");
  }
});

//Up button moves selection border one above
upButton.addEventListener("click", () => {
  count = count - 3;
  if (count < 0) {
    count = count + 3;
  } else {
    //removes selection border from previous selection
    children[count + 3].classList.remove("selection__card--border");
    //adds selection border to current selection
    children[count].classList.add("selection__card--border");
  }
});
