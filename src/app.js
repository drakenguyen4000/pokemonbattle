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
let optionsList;
let optionsListItems;
let dialogue;
let oppHealthValue;
let playerHealthValue;
let oppHealthFill;
let playerHealthFill;
let playerPokemon;
let oppPokemon;
let oppTotalHealth;
let playerTotalHealth;
let oppAttack;
let playerAttack;
let oppDefense;
let playerDefense;

var state = {
  pokemonList: {},
  playerPokemon: {},
  opponentPokemon: {},
  selectedAnswer: "yes",
  screen: "",
  optionSelected: "attack",
};

//Function to load different Screens
const displayScreen = (screenUpdate, screenFunc) => {
  count = 0;
  state.screen = screenUpdate;
  //Display Selection Screen
  document.getElementsByName("screen-display")[0].src = state.screen + ".html";
  setTimeout(() => {
    screenFunc();
  }, 2000);
};

//Loads iframe of player Selection Screen
const selectionScreen = () => {
  iframeDocument = iframe.contentWindow.document;
  //Get Selection List of cards (children)
  selectionList = iframeDocument.querySelector(".selection__list");
  selectionListItems = selectionList.children;
  numItems = selectionListItems.length - 1;
  //Update state with Pokemon list
  const pokemonList = iframe.contentWindow.selectionState.pokemonList;
  state.pokemonList = pokemonList;
};

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
};

//Loads iframe of Opponent Selection Screen
async function oppSelectionScreen() {
  //Wait for content to load
  const nextScreen = await iframe.contentWindow.oppScreenLoad();
  //Get Opponent Pokemon and store in state
  const oppState = iframe.contentWindow.oppState;
  state.opponentPokemon = oppState.opponentPokemon;
  //Loads next screen
  displayScreen(nextScreen, battleScreen);
}

//Loads iframe of Battle Screen
const battleScreen = () => {
  iframeDocument = iframe.contentWindow.document;
  dialogue = iframeDocument.querySelector(".infobox__text");
  optionsList = iframeDocument.querySelector(".infobox__container--red");
  //Get list of all options in infobox box red
  optionsListItems = optionsList.children;
  numItems = optionsListItems.length - 1;

  //Pokemon Instance
  oppAttack = state.opponentPokemon[0].attack;
  playerAttack = state.playerPokemon[0].attack;
  oppDefense = state.opponentPokemon[0].defense;
  playerDefense = state.playerPokemon[0].defense;
  oppState = state.opponentPokemon[0];
  playerState = state.playerPokemon[0];
  oppTotalHealth = state.opponentPokemon[0].health_total;
  playerTotalHealth = state.playerPokemon[0].health_total;
  oppHealthFill = iframeDocument.querySelector(".opponent-health__bar--fill");
  playerHealthFill = iframeDocument.querySelector(".player-health__bar--fill");
  oppPokemon = new Pokemon(oppAttack, oppDefense, oppTotalHealth, oppState, oppHealthFill);
  playerPokemon = new Pokemon(playerAttack, playerDefense, playerTotalHealth, playerState, playerHealthFill);
};

//------------------------Control Buttons------------------------//
startButton.addEventListener("click", () => {
  //Only enable start selection screen page if is not the current page loaded
  if (state.screen === "intro-screen" && state.screen !== "selection-screen") {
    //set screen in state to equal selection-screen
    displayScreen("selection-screen", selectionScreen);
  }
});

pauseButton.addEventListener("click", () => {
  console.log(state);
});

selectButton.addEventListener("click", () => {
  //Selects Pokemon in Selection Screen
  if (state.screen === "selected-mode" && state.selectedAnswer === "yes") {
    //Start Opponent Selection screen
    displayScreen("opp-selection-screen", oppSelectionScreen);
  } else if (
    state.screen === "selected-mode" &&
    state.selectedAnswer === "no"
  ) {
    backToSelection();
  } else if (state.screen === "selection-screen") {
    selectedPokemon();
  }
  // attack
  else if (
    state.screen === "battle-screen" &&
    state.optionSelected === "attack"
  ) {
    state.screen = "attack-mode";
    state.optionSelected = state.playerPokemon[0].attack_1;
    dialogue.innerHTML = "Pick an attack!";
    //Display attacks in infobox red
    optionsListItems[0].lastChild.data = state.playerPokemon[0].attack_1;
    optionsListItems[1].lastChild.data = state.playerPokemon[0].attack_2;
    optionsListItems[2].lastChild.data = "";
    optionsListItems[3].lastChild.data = "";
  } else if (state.screen === "attack-mode") {
    //Displays user command in infobox yellow
    let playerCommands = `${state.playerPokemon[0].name}, use ${state.optionSelected} attack on ${state.opponentPokemon[0].name}!`;
    dialogue.innerHTML = playerCommands;
    optionsListItems[0].lastChild.data = "attack";
    optionsListItems[1].lastChild.data = "bag";
    optionsListItems[2].lastChild.data = "pkmon";
    optionsListItems[3].lastChild.data = "run";
    //Reset count and arrow icon
    optionsListItems[count].children[0].classList.remove("arrow--selected");
    count = 0;
    optionsListItems[count].children[0].classList.add("arrow--selected");

    if (state.optionSelected === "Static") {
      setTimeout(() => {
        iframeDocument
          .querySelector(".player__img")
          .classList.add("player-attack");
        iframeDocument
          .querySelector(".player-energy")
          .classList.add("fa-solid", "fa-bolt", "player-energy--animate");
        // .classList.add( "player-energy--animate");
        iframeDocument
          .querySelector(".opponent__img")
          .classList.add("opponent--staggered");
        setTimeout(() => {
          iframeDocument
            .querySelector(".player__img")
            .classList.remove("player-attack");
          iframeDocument
            .querySelector(".player-energy")
            .classList.remove("player-energy--animate");
          iframeDocument
            .querySelector(".opponent__img")
            .classList.remove("opponent--staggered");
            let attack = Math.floor(playerPokemon.attackPower("attack_2"))
            oppPokemon.damage(attack);
            iframe.contentWindow.updateValues();
        }, 4000);
      }, 1000);
    }
    if (state.optionSelected === "Lghtnng Rod") {
      setTimeout(() => {
        iframeDocument
          .querySelector(".player__img")
          .classList.add("player-attack_2");
        iframeDocument
          .querySelector(".player-energy")
          .classList.add("fa-solid", "fa-bolt", "player-energy--animate_2");
        iframeDocument
          .querySelector(".opponent__img")
          .classList.add("opponent--staggered_2");
        setTimeout(() => {
          iframeDocument
            .querySelector(".player__img")
            .classList.remove("player-attack_2");
          iframeDocument
            .querySelector(".player-energy")
            .classList.remove("player-energy--animate_2");
          iframeDocument
            .querySelector(".opponent__img")
            .classList.remove("opponent--staggered_2");
            let attack = Math.floor(playerPokemon.attackPower("attack_2"))
            oppPokemon.damage(attack);
            iframe.contentWindow.updateValues()
        }, 4000);
      }, 1000);
    }
    state.screen = "battle-screen";
    state.optionSelected = "attack";
  }

  // //bag (potions)
  // else if (state.screen === "battle-screen" && state.optionSelected === "bag") {
  //   console.log("bag");
  // }
  // //pokemon (load your pokemon)
  // else if (
  //   state.screen === "battle-screen" &&
  //   state.optionSelected === "pkmon"
  // ) {
  //   console.log("pkmon");
  // }
  // //run
  // else if (state.screen === "battle-screen" && state.optionSelected === "run") {
  //   console.log("run");
  // }
});

rightButton.addEventListener("click", () => {
  //Adds 1 every time user clicks right button on d-pad
  count += 1;
  //Only works in selection screen, not selected-mode
  if (state.screen === "selection-screen") {
    //Set equal to # of selections available, if count exceeds it, before changing direction
    count > numItems ? (count = numItems) : switchDirection("right");
  }
  //Only works in battle screen
  else if (state.screen === "battle-screen") {
    //Set equal to # of selections available, if count exceeds it, before changing direction
    count > numItems ? (count = numItems) : switchDirection2("right");
  } else if (state.screen === "attack-mode") {
    //Set equal to # of selections available, if count exceeds it, before changing direction
    count > 1 ? (count = 1) : switchDirection2("right");
  }
});

//Left button moves selection border one over to the left
leftButton.addEventListener("click", () => {
  count -= 1;
  if (state.screen === "selection-screen") {
    //Set count equal to zero, if count goes below zero, before changing direction
    count < 0 ? (count = 0) : switchDirection("left");
  }

  if (state.screen === "battle-screen" || state.screen === "attack-mode") {
    //Set count equal to zero, if count goes below zero, before changing direction
    count < 0 ? (count = 0) : switchDirection2("left");
  }
});

//Down button moves selection border one below
downButton.addEventListener("click", () => {
  if (state.screen === "selection-screen") {
    count += 3;
    //Reverse count by -3, if count exceeds # of selections available, before changing direction
    count > numItems ? (count -= 3) : switchDirection("down");
  } else if (state.screen === "selected-mode") {
    iframeDocument.querySelector(".option__yes-arrow").classList.add("hide");
    iframeDocument.querySelector(".option__no-arrow").classList.remove("hide");
    state.selectedAnswer = "no";
  } else if (state.screen === "battle-screen") {
    count += 2;
    //Reverse count by -2, if count exceeds # of selections available, before changing direction
    count > numItems ? (count -= 2) : switchDirection2("down");
  }
});

//Switch to yes with up button
upButton.addEventListener("click", () => {
  if (state.screen === "selection-screen") {
    count -= 3;
    //Reverse count by +3, if count goes below zero, before changing direction
    count < 0 ? (count += 3) : switchDirection("up");
  } else if (state.screen === "selected-mode") {
    iframeDocument.querySelector(".option__yes-arrow").classList.remove("hide");
    iframeDocument.querySelector(".option__no-arrow").classList.add("hide");
    state.selectedAnswer = "yes";
  } else if (state.screen === "battle-screen") {
    count -= 2;
    //Reverse count by +2, if count goes below zero, before changing direction
    count < 0 ? (count += 2) : switchDirection2("up");
  }
});

//----Enable Direction Pad Controls for Selection Screen----//
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
      iframeDocument.querySelector(".info-list2").innerHTML = getDataSet(count);
      break;
    case "left":
      selectionListItems[count + 1].classList.remove(
        "selection__card--selected"
      );
      selectionListItems[count].classList.add("selection__card--selected");
      iframeDocument.querySelector(".info-list2").innerHTML = getDataSet(count);
      break;
    case "down":
      selectionListItems[count - 3].classList.remove(
        "selection__card--selected"
      );
      selectionListItems[count].classList.add("selection__card--selected");
      iframeDocument.querySelector(".info-list2").innerHTML = getDataSet(count);
      break;
    case "up":
      selectionListItems[count + 3].classList.remove(
        "selection__card--selected"
      );
      selectionListItems[count].classList.add("selection__card--selected");
      iframeDocument.querySelector(".info-list2").innerHTML = getDataSet(count);
      break;
  }
};

//----Enable Direction Pad Controls for Battle Screen----//
const switchDirection2 = (direction) => {
  switch (direction) {
    case "right":
      //displays & removes arrow
      optionsListItems[count - 1].children[0].classList.remove(
        "arrow--selected"
      );
      optionsListItems[count].children[0].classList.add("arrow--selected");

      //Update state with player choice
      state.optionSelected = optionsListItems[count].lastChild.data;
      break;
    case "left":
      optionsListItems[count + 1].children[0].classList.remove(
        "arrow--selected"
      );
      optionsListItems[count].children[0].classList.add("arrow--selected");
      state.optionSelected = optionsListItems[count].lastChild.data;

      break;
    case "down":
      optionsListItems[count - 2].children[0].classList.remove(
        "arrow--selected"
      );
      optionsListItems[count].children[0].classList.add("arrow--selected");
      state.optionSelected = optionsListItems[count].lastChild.data;
      break;
    case "up":
      optionsListItems[count + 2].children[0].classList.remove(
        "arrow--selected"
      );
      optionsListItems[count].children[0].classList.add("arrow--selected");
      state.optionSelected = optionsListItems[count].lastChild.data;
      break;
  }
};

//Display current pokemon data to infbox
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

async function init() {
  console.log("starting up app...");
  //--------Load Intro Screen--------//
  // setTimeout(() => {
  //   state.screen = "intro-screen";
  //   // state.screen = "battle-screen";
  //   document.getElementsByName("screen-display")[0].src =
  //     state.screen + ".html";
  // }, 1500);

  //--Battle Screen Test load---//
  const response1 = await fetch("./src/player.json").catch((err) =>
    console.log(err)
  );
  const data1 = await response1.json().catch((err) => console.log(err));
  state.playerPokemon = data1;

  const response2 = await fetch("./src/opponent.json").catch((err) =>
    console.log(err)
  );
  const data2 = await response2.json().catch((err) => console.log(err));
  state.opponentPokemon = data2;
  // console.log(state);

  state.screen = "battle-screen";
  document.getElementsByName("screen-display")[0].src = state.screen + ".html";
  displayScreen("battle-screen", battleScreen);
}

//Pokemon status
class Pokemon {
  constructor(attack, defense, totalHealth, state, healthFill) {
    this.attackpt = attack;
    this.defense = defense;
    this.totHealth = totalHealth;
    this.state = state;
    this.healthFillEl = healthFill;
  }
  attackPower(attacktype){
      let accuracy = Math.random() * (1 - .5) + .5;
      if(attacktype === "attack_1"){
       return this.state.health_active*.05 + this.attackpt *.12 * accuracy;
      }
      return this.state.health_active*.05 + this.attackpt *.15 * accuracy
    }
  damage(attack){
    let defensePt = this.defense * .025;
    let damage = attack - defensePt;
    let currHealth = Math.floor(this.state.health_active - damage);
    if (currHealth < 0) {
      currHealth = 0;
    }
    this.value = currHealth;
    this.update();
  }

  update() {
    const percentage = Math.floor(this.value / this.totHealth * 100) + "%";
    //Health value 
    this.state.health_active = this.value;
    //Health bar level
    this.healthFillEl.style.width = percentage;
  }
}

init();
