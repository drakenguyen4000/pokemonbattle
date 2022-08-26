const startButton = document.querySelector(".btn-start");
const rightButton = document.querySelector(".d-pad__btn--right");
const leftButton = document.querySelector(".d-pad__btn--left");
const downButton = document.querySelector(".d-pad__btn--down");
const upButton = document.querySelector(".d-pad__btn--up");
const selectButton = document.querySelector(".btn-select");
const pauseButton = document.querySelector(".btn-pause");
let iframe = document.getElementById("iframe");
let iframeDocument;
let selectionList;
let selectionListItems;
let numItems; //Number of Pokemon available to select
let count = 0;
let selectedAnswer = "yes";

//Pick Pokemon
selectButton.addEventListener("click", () => {
  iframeDocument = iframe.contentWindow.document;
  
  //Switch text to: Select this Pokemon?
  iframeDocument.querySelector(".infobox__text-choose").classList.add("hide");
  iframeDocument.querySelector(".infobox__text-selected").classList.remove("hide");
  //Switch to no with down button
  downButton.addEventListener("click", () => {
    iframeDocument.querySelector(".option__yes-arrow").classList.add("hide");
    iframeDocument.querySelector(".option__no-arrow").classList.remove("hide");
    selectedAnswer = "no";
  });
  //Switch to yes with up button
  upButton.addEventListener("click", () => {
    iframeDocument.querySelector(".option__yes-arrow").classList.remove("hide");
    iframeDocument.querySelector(".option__no-arrow").classList.add("hide");
    selectedAnswer = "yes";
  });
});

//Start Game
startButton.addEventListener("click", () => {
  //Only enable start selection screen page if is not the current page loaded
  let currentLoadedPage =
    document.getElementById("iframe").attributes[1].nodeValue;
  if (currentLoadedPage !== "selection-screen.html") {
    const selectionPage = "selection-screen.html";
    //Display Selection Screen
    document.getElementsByName("screen-display")[0].src = selectionPage;
    setTimeout(() => {
      startSelectionScreen();
    }, 2000);
  }
});

//Load iFrame Nodes
const startSelectionScreen = () => {
  iframeDocument = iframe.contentWindow.document;
  selectionList = iframeDocument.querySelector(".selection__list");
  selectionListItems = selectionList.children;
  numItems = selectionListItems.length - 1;
  //Checks if selection page is loaded before control buttons are active
  if (selectionListItems !== null) {
    selectionsActive();
  }
};

//--------Console Control - Selection Screen--------//
const selectionsActive = () => {
  //Right button moves selection border one over to the right
  rightButton.addEventListener("click", () => {
    count += 1;
    //Set equal to # of selections available, if count exceeds it, before changing direction
    count > numItems ? (count = numItems) : switchDirection("right");
  });

  //Left button moves selection border one over to the left
  leftButton.addEventListener("click", () => {
    count -= 1;
    //Set count equal to zero, if count goes below zero, before changing direction
    count < 0 ? (count = 0) : switchDirection("left");
  });

  //Down button moves selection border one below
  downButton.addEventListener("click", () => {
    count += 3;
    //Reverse count by -3, if count exceeds # of selections available, before changing direction
    count > numItems ? (count -= 3) : switchDirection("down");
  });

  //Up button moves selection border one above
  upButton.addEventListener("click", () => {
    count -= 3;
    //Reverse count by +3, if count goes below zero, before changing direction
    count < 0 ? (count += 3) : switchDirection("up");
  });

  const switchDirection = (direction) => {
    switch (direction) {
      case "right":
        //removes selection border from previous selection
        selectionListItems[count - 1].classList.remove(
          "selection__card--selected"
        );
        //adds selection border to current selection
        selectionListItems[count].classList.add("selection__card--selected");
        //Switches infobox details based on pokemon selection
        iframeDocument.querySelector(".info-list2").innerHTML =
          getDataSet(count);
        break;
      case "left":
        selectionListItems[count + 1].classList.remove(
          "selection__card--selected"
        );
        selectionListItems[count].classList.add("selection__card--selected");
        iframeDocument.querySelector(".info-list2").innerHTML =
          getDataSet(count);
        break;
      case "down":
        selectionListItems[count - 3].classList.remove(
          "selection__card--selected"
        );
        selectionListItems[count].classList.add("selection__card--selected");
        iframeDocument.querySelector(".info-list2").innerHTML =
          getDataSet(count);
        break;
      case "up":
        selectionListItems[count + 3].classList.remove(
          "selection__card--selected"
        );
        selectionListItems[count].classList.add("selection__card--selected");
        iframeDocument.querySelector(".info-list2").innerHTML =
          getDataSet(count);
    }
  };

  const getDataSet = (count) => {
    return `<li>${selectionListItems[count].dataset.type}</li>
      <li>${selectionListItems[count].dataset.health}</li>
      <li>${selectionListItems[count].dataset.attack}</li>
      <li>${selectionListItems[count].dataset.defense}</li>
      <li>${selectionListItems[count].dataset.weakness}</li>`;
  };
};
