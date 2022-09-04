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

let state = {
  pokemonList: {},
  playerPokemon: {},
  opponentPokemon: {},
  selectedAnswer: "yes",
  screen: "",
};

//Function to load different Screens
const displayScreen = (screenUpdate, screenFunc) => {
  state.screen = screenUpdate;
  //Display Selection Screen
  document.getElementsByName("screen-display")[0].src = state.screen + ".html";
  setTimeout(() => {
    screenFunc();
  }, 2000);
};

//----------Start Game----------//
startButton.addEventListener("click", () => {
  //Only enable start selection screen page if is not the current page loaded
  if (state.screen === "intro-screen" && state.screen !== "selection-screen") {
    //set screen in state to equal selection-screen
    displayScreen("selection-screen", selectionScreen);
  }
});

//--------Console Control - Selection Screen--------//
//----------Load selection screen----------//
const selectionScreen = () => {
  iframeDocument = iframe.contentWindow.document;
  selectionList = iframeDocument.querySelector(".selection__list");
  selectionListItems = selectionList.children;
  numItems = selectionListItems.length - 1;
  //Update state with Pokemon list
  const pokemonList = iframe.contentWindow.selectionState.pokemonList;
  state.pokemonList = pokemonList;
  //Checks if selection page is loaded before control buttons are active
  if (selectionListItems !== null) {
    selectionsActive();
  }
};

//----Enable Direction Pad Controls for Selection Screen----//
const selectionsActive = () => {
  //Right button moves selection border one over to the right
  rightButton.addEventListener("click", () => {
    //Only works in selection screen, not selected-mode
    if (state.screen === "selection-screen") {
      count += 1;
      //Set equal to # of selections available, if count exceeds it, before changing direction
      count > numItems ? (count = numItems) : switchDirection("right");
    }
  });

  //Left button moves selection border one over to the left
  leftButton.addEventListener("click", () => {
    if (state.screen === "selection-screen") {
      count -= 1;
      //Set count equal to zero, if count goes below zero, before changing direction
      count < 0 ? (count = 0) : switchDirection("left");
    }
  });

  //Down button moves selection border one below
  downButton.addEventListener("click", () => {
    if (state.screen === "selection-screen") {
      count += 3;
      //Reverse count by -3, if count exceeds # of selections available, before changing direction
      count > numItems ? (count -= 3) : switchDirection("down");
    }
  });

  //Up button moves selection border one above
  upButton.addEventListener("click", () => {
    if (state.screen === "selection-screen") {
      count -= 3;
      //Reverse count by +3, if count goes below zero, before changing direction
      count < 0 ? (count += 3) : switchDirection("up");
    }
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
    //Update state with currently highlighted pokemon
    state.playerPokemon = Object.assign({}, selectionListItems[count].dataset);
    //List info of current pokemon
    return `<li>${selectionListItems[count].dataset.type}</li>
      <li>${selectionListItems[count].dataset.health}</li>
      <li>${selectionListItems[count].dataset.attack}</li>
      <li>${selectionListItems[count].dataset.defense}</li>
      <li>${selectionListItems[count].dataset.weakness}</li>`;
  };
};

//Calls AI screen to start
async function aiSelectionScreen() {
  //Wait for content to load
  const nextScreen = await iframe.contentWindow.aiScreenLoad();
  //Get Opponent Pokemon and store in state
  const oppState = iframe.contentWindow.oppState;
  state.opponentPokemon = oppState.opponentPokemon;
  //Loads next screen
  displayScreen(nextScreen, battleScreen);
}

const battleScreen = () => {
  console.log("bg started");
};

selectButton.addEventListener("click", () => {
  //Selects Pokemon in Selection Screen
  if (state.screen === "selected-mode" && state.selectedAnswer === "yes") {
    //Add Pokemon to Player Pokemon

    //Start AI's screen
    displayScreen("ai-selection-screen", aiSelectionScreen);
    // console.log('hi')
  } else if (
    state.screen === "selected-mode" &&
    state.selectedAnswer === "no"
  ) {
    backToSelection();
  } else if (state.screen === "selection-screen") {
    selectedPokemon();
  }
});

//In Selected Mode, if user chooses no to the picked pokemon, revert infobox, allow user to pick another pokemon
const backToSelection = () => {
  state.screen = "selection-screen";
  state.selectedAnswer = "yes";
  iframeDocument = iframe.contentWindow.document;
  iframeDocument
    .querySelector(".infobox__text-choose")
    .classList.remove("hide");
  iframeDocument.querySelector(".infobox__text-selected").classList.add("hide");
  iframeDocument.querySelector(".option__yes-arrow").classList.remove("hide");
  iframeDocument.querySelector(".option__no-arrow").classList.add("hide");
};

//Selected Pokemon
const selectedPokemon = () => {
  state.screen = "selected-mode";
  state.selectedAnswer = "yes";
  iframeDocument = iframe.contentWindow.document;
  //Switch text to: Select this Pokemon?
  iframeDocument.querySelector(".infobox__text-choose").classList.add("hide");
  iframeDocument
    .querySelector(".infobox__text-selected")
    .classList.remove("hide");
  //Switch to no with down button
  downButton.addEventListener("click", () => {
    if (state.screen === "selected-mode") {
      iframeDocument.querySelector(".option__yes-arrow").classList.add("hide");
      iframeDocument
        .querySelector(".option__no-arrow")
        .classList.remove("hide");
      state.selectedAnswer = "no";
    }
  });
  //Switch to yes with up button
  upButton.addEventListener("click", () => {
    if (state.screen === "selected-mode") {
      iframeDocument
        .querySelector(".option__yes-arrow")
        .classList.remove("hide");
      iframeDocument.querySelector(".option__no-arrow").classList.add("hide");
      state.selectedAnswer = "yes";
    }
  });
};

const init = () => {
  console.log("starting up app...");
  //--------Load Intro Screen--------//
  setTimeout(() => {
    state.screen = "intro-screen";
    document.getElementsByName("screen-display")[0].src =
      state.screen + ".html";
  }, 1500);
};

init();
