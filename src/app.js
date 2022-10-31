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
let numItems2; //Number of Pokemon available to select
let numItems3; //Number of Pokemon available to select
let count = 0;
let count2 = 0;
let count3 = 0;
let optionsList;
let optionsListItems;
let dialogue;
let player;
let opponent;
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
let playagainList;
let bagItems;
let yourPkmn;

var state = {
  pokemonList: {},
  curSelectPokemon: {},
  opponentPokemon: {},
  selectedAnswer: "yes",
  screen: "",
  optionSelected: "attack",
  attackSelected: "",
  bag: {
    Potion: 5,
    "Super Potion": 5,
    Pokeball: 10,
  },
  curPkmIndex: 0,
  yourPkmn: [],
  itemsAllowed: 5,
  captured: false,
  switchPkmn: 1,
  wins: 0,
};

const sound = {
  click: new Audio("./src/sounds/splits.mp3"),
  click2: new Audio(
    "./src/sounds/608432__plasterbrain__pokemon-ui-select-enter.flac"
  ),
  intro: new Audio("./src/sounds/514155__edwardszakal__game-music.mp3"),
  attack: new Audio(
    "./src/sounds/213149__complex-waveform__8bit-style-bonus-effect.wav"
  ),
  heal: new Audio("./src/sounds/562292__colorscrimsontears__heal-rpg.wav"),
  smash: new Audio("./src/sounds/323417__sethroph__glass-slide-7.wav"),
  catch: new Audio("./src/sounds/464904__plasterbrain__8bit-beam.flac"),
  fail: new Audio("./src/sounds/159408__noirenex__life-lost-game-over.wav"),
  winGame: new Audio("./src/sounds/win-video-game-sound.wav"),
  lostGame: new Audio("./src/sounds/538151__fupicat__8bit-fall.wav"),
  gameOver: new Audio("./src/sounds/617466__cwright13__pokemoncenter.mp3"),
  battle: new Audio("./src/sounds/338817__sirkoto51__rpg-battle-loop-1.wav"),
  switch: new Audio(
    "./src/sounds/274180__littlerobotsoundfactory__jingle-win-synth-00.wav"
  ),
};

//Timer to slow effect
const delay = (time) => {
  return new Promise((resolve) => {
    return setTimeout(() => {
      resolve();
    }, time);
  });
};

/*Displays*/
//Function to load different Screens
const displayScreen = (screenUpdate, screenFunc) => {
  state.screen = screenUpdate;
  document.getElementsByName("screen-display")[0].src = state.screen + ".html";
  delay(2000).then(() => {
    screenFunc();
    count = 0;
  });
};

const introScreen = () => {
  console.log("Intro screen started...");
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
  //Set default pokemon //Need Update to yourPokemon with 3 Pokemon
  state.curSelectPokemon = pokemonList[0];
  sound.intro.play();
  sound.intro.volume = 0.1;
  sound.intro.loop = true;
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
  //Restore your pokemon health;
  const yourTeam = state.yourPkmn;
  yourTeam.forEach((el) => {
    el.health_active = el.health_total;
    sound.click.play();
    sound.gameOver.pause();
    sound.gameOver.currentTime = 0;
  });

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
  state.optionSelected = "attack";
  iframeDocument = iframe.contentWindow.document;
  dialogue = iframeDocument.querySelector(".infobox__text");
  optionsList = iframeDocument.querySelector(".infobox__container--red");
  //Get list of all options in infobox box red
  optionsListItems = optionsList.children;
  numItems = optionsListItems.length - 1;
  loadPokemon();
  sound.intro.pause();
  sound.intro.currentTime = 0;
  sound.battle.play();
  sound.battle.volume = 0.1;
  sound.battle.loop = true;
};

const gameoverScreen = () => {
  iframeDocument = iframe.contentWindow.document;
  if (state.wins === 2) {
    iframeDocument.querySelector(".lost").classList.add("lost--hide");
    iframeDocument.querySelector(".win").classList.add("win--show");
  }
  playagainList = iframeDocument.querySelector(".playagain").children;
  numItems = playagainList.length - 1;
  sound.battle.pause();
  sound.battle.currentTime = 0;
  sound.gameOver.play();
  sound.gameOver.volume = 0.1;
  sound.gameOver.loop = true;
};

/*Pokemon Class*/
const loadPokemon = () => {
  //Pokemon Class Instance
  player = "player";
  opponent = "opponent";
  oppAttack = state.opponentPokemon.attack;
  playerAttack = state.yourPkmn[state.curPkmIndex].attack;
  oppDefense = state.opponentPokemon.defense;
  playerDefense = state.yourPkmn[state.curPkmIndex].defense;
  oppState = state.opponentPokemon;
  playerState = state.yourPkmn[state.curPkmIndex];
  oppTotalHealth = state.opponentPokemon.health_total;
  playerTotalHealth = state.yourPkmn[state.curPkmIndex].health_total;
  oppHealthFill = iframeDocument.querySelector(".opponent-health__bar--fill");
  playerHealthFill = iframeDocument.querySelector(".player-health__bar--fill");
  oppPokemon = new Pokemon(
    opponent,
    oppAttack,
    oppDefense,
    oppTotalHealth,
    oppState,
    oppHealthFill
  );
  playerPokemon = new Pokemon(
    player,
    playerAttack,
    playerDefense,
    playerTotalHealth,
    playerState,
    playerHealthFill
  );
};

//*Buttons*//
//------------------------Control Buttons------------------------//
startButton.addEventListener("click", () => {
  sound.click2.play();
  //Only enable start selection screen page if is not the current page loaded
  if (state.screen === "intro-screen" && state.screen !== "selection-screen") {
    //set screen in state to equal selection-screen
    displayScreen("selection-screen", selectionScreen);
  }
});

pauseButton.addEventListener("click", () => {
  // oppTurn();
  console.log("state:", state);
  console.log("count:", count);
  console.log("count2:", count2);
  console.log("count3:", count3);
  console.log("numItems:", numItems);
  console.log("numItems2:", numItems2);
  console.log("numItems3:", numItems3);
});

selectButton.addEventListener("click", () => {
  sound.click2.play();
  //Selects Pokemon in Selection Screen
  if (state.screen === "selected-mode" && state.selectedAnswer === "yes") {
    //Pokemon team selection. Player cannot select same Pokemon on team.
    if (state.yourPkmn.find((e) => e.name === state.curSelectPokemon.name)) {
      backToSelection();
      iframeDocument.querySelector(".infobox__text-choose").textContent =
        "You already picked this Pokemon. Select another.";
    } else {
      state.yourPkmn.push(state.curSelectPokemon);
      state.yourPkmn.length === 3
        ? displayScreen("opp-selection-screen", oppSelectionScreen)
        : null;
      let remainingNum = 3 - state.yourPkmn.length;
      iframeDocument.querySelector(
        ".infobox__text-choose"
      ).textContent = `Select ${remainingNum} more Pokemon for battle.`;
      selectionListItems[count].classList.add("selection__card--unavaible");
      backToSelection();
    }
  } //Start Opponent Selection screen
  else if (state.screen === "selected-mode" && state.selectedAnswer === "no") {
    //Cancel pokemon selection
    backToSelection();
  } else if (state.screen === "selection-screen") {
    selectedPokemon();
  } else if (
    state.screen === "gameover-screen" &&
    state.selectedAnswer === "yes"
  ) {
    sound.gameOver.pause();
    sound.gameOver.currentTime = 0;
    resetOptions();
    displayScreen("selection-screen", selectionScreen);
  } else if (
    state.screen === "gameover-screen" &&
    state.selectedAnswer === "no"
  ) {
    sound.gameOver.pause();
    sound.gameOver.currentTime = 0;
    resetOptions();
    displayScreen("intro-screen", introScreen);
  }
  //===attack option selected===//
  else if (
    (state.screen === "battle-screen" && state.optionSelected === "attack") ||
    state.screen === "attack-mode"
  ) {
    attackOption();
  }
  //===bag (items)===//
  else if (
    state.optionSelected === "bag" ||
    state.optionSelected === "bag-opened"
  ) {
    bagOption();
  }
  //===Pkmon option===//
  else if (
    state.optionSelected === "pkmon" ||
    state.optionSelected === "pkmn-switch"
  ) {
    pkmonOption();
  }
  //===run option===//
  else if (state.optionSelected === "run") {
    runOption();
  }
});

rightButton.addEventListener("click", () => {
  sound.click.play();
  //Only works in selection screen, not selected-mode
  if (state.screen === "selection-screen") {
    count += 1;
    //Set equal to # of selections available, if count exceeds it, before changing direction
    count > numItems ? (count = numItems) : switchDirection("right");
  }
  //Only works in battle screen
  else if (state.screen === "battle-screen") {
    count += 1;
    //Set equal to # of selections available, if count exceeds it, before changing direction
    count > numItems ? (count = numItems) : switchDirection2("right");
  } else if (state.screen === "yourPkmn") {
    count3 += 1;
    //Set equal to # of selections available, if count exceeds it, before changing direction
    count3 > numItems3 ? (count3 = numItems3) : switchDirection5("right");
  }
});

//Left button moves selection border one over to the left
leftButton.addEventListener("click", () => {
  sound.click.play();
  if (state.screen === "selection-screen") {
    count -= 1;
    //Set count equal to zero, if count goes below zero, before changing direction
    count < 0 ? (count = 0) : switchDirection("left");
  }
  if (state.screen === "battle-screen") {
    count -= 1;
    //Set count equal to zero, if count goes below zero, before changing direction
    count < 0 ? (count = 0) : switchDirection2("left");
  } else if (state.screen === "yourPkmn") {
    count3 -= 1;
    count3 < 0 ? (count3 = 0) : switchDirection5("left");
  }
});

//Down button moves selection border one below
downButton.addEventListener("click", () => {
  sound.click.play();
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
  } else if (state.screen === "attack-mode") {
    count += 1;
    count > 2 ? (count = 2) : switchDirection6("down");
  } else if (state.screen === "gameover-screen") {
    count += 1;
    count > numItems ? (count = numItems) : switchDirection3("down");
  } else if (state.optionSelected === "bag-opened") {
    count2 += 1;
    count2 > numItems2 ? (count2 = numItems2) : switchDirection4("down");
  } else if (state.screen === "yourPkmn") {
    count3 += 3;
    count3 > numItems3 ? (count3 -= 3) : switchDirection5("down");
  }
});

//Switch to yes with up button
upButton.addEventListener("click", () => {
  sound.click.play();
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
  } else if (state.screen === "attack-mode") {
    count -= 1;
    count < 0 ? (count = 0) : switchDirection6("up");
  } else if (state.screen === "gameover-screen") {
    count -= 1;
    count < 0 ? (count = 0) : switchDirection3("up");
  } else if (state.optionSelected === "bag-opened") {
    count2 -= 1;
    count2 < 0 ? (count2 = 0) : switchDirection4("up");
  } else if (state.screen === "yourPkmn") {
    count3 -= 3;
    count3 < 0 ? (count3 += 3) : switchDirection5("up");
  }
});

/*Switch*/
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

//Game-over selection D-Pad Control
const switchDirection3 = (direction) => {
  switch (direction) {
    case "down":
      playagainList[count - 1].children[0].classList.remove("arrow--selected");
      playagainList[count].children[0].classList.add("arrow--selected");
      state.selectedAnswer = playagainList[count].lastChild.data;
      break;
    case "up":
      playagainList[count + 1].children[0].classList.remove("arrow--selected");
      playagainList[count].children[0].classList.add("arrow--selected");
      state.selectedAnswer = playagainList[count].lastChild.data;
      break;
  }
};

//Bag items D-Pad Control
const switchDirection4 = (direction) => {
  switch (direction) {
    case "down":
      bagItems[count2 - 1].classList.remove("bag-item--selected");
      bagItems[count2].classList.add("bag-item--selected");
      bagItems[count2 - 1].children[1].classList.remove(
        "bag-item-img--selected"
      );
      bagItems[count2].children[1].classList.add("bag-item-img--selected");
      state.selectedAnswer =
        bagItems[count2].children[1].nextElementSibling.textContent;
      break;
    case "up":
      bagItems[count2 + 1].classList.remove("bag-item--selected");
      bagItems[count2].classList.add("bag-item--selected");
      bagItems[count2 + 1].children[1].classList.remove(
        "bag-item-img--selected"
      );
      bagItems[count2].children[1].classList.add("bag-item-img--selected");
      state.selectedAnswer =
        bagItems[count2].children[1].nextElementSibling.textContent;
      break;
  }
};

//Switch out Pokemon
const switchDirection5 = (direction) => {
  switch (direction) {
    case "right":
      //removes selection border from previous selection
      yourPkmn[count3 - 1].classList.remove("selection__card--selected");
      //adds selection border to current selection
      yourPkmn[count3].classList.add("selection__card--selected");
      //Update state with currently highlighted pokemon
      state.curPkmIndex = count3;
      break;
    case "left":
      yourPkmn[count3 + 1].classList.remove("selection__card--selected");
      yourPkmn[count3].classList.add("selection__card--selected");
      state.curPkmIndex = count3;
      break;
    case "down":
      yourPkmn[count3 - 3].classList.remove("selection__card--selected");
      yourPkmn[count3].classList.add("selection__card--selected");
      state.curPkmIndex = count3;
      break;
    case "up":
      yourPkmn[count3 + 3].classList.remove("selection__card--selected");
      yourPkmn[count3].classList.add("selection__card--selected");
      state.curPkmIndex = count3;
      break;
  }
};

const switchDirection6 = (direction) => {
  switch (direction) {
    case "down":
      //displays & removes arrow
      optionsListItems[count - 1].children[0].classList.remove(
        "arrow--selected"
      );
      optionsListItems[count].children[0].classList.add("arrow--selected");
      //Update state with player choice
      state.optionSelected = optionsListItems[count].lastChild.data;
      state.attackSelected = `attack_${count + 1}`;
      break;
    case "up":
      optionsListItems[count + 1].children[0].classList.remove(
        "arrow--selected"
      );
      optionsListItems[count].children[0].classList.add("arrow--selected");
      state.optionSelected = optionsListItems[count].lastChild.data;
      state.attackSelected = `attack_${count + 1}`;
      break;
  }
};

const attackOption = () => {
  //Set Attack Option Grid layout as list
  iframeDocument
    .querySelector(".option-grid")
    .classList.add("option-grid--list");
  if (state.optionSelected === "attack") {
    state.screen = "attack-mode";
    state.optionSelected = state.yourPkmn[state.curPkmIndex].attack_1;
    state.attackSelected = "attack_1";
    dialogue.textContent = "Pick an attack!";
    //Display attacks in infobox red
    optionsListItems[0].lastChild.data =
      state.yourPkmn[state.curPkmIndex].attack_1;
    optionsListItems[1].lastChild.data =
      state.yourPkmn[state.curPkmIndex].attack_2;
    optionsListItems[2].lastChild.data =
      state.yourPkmn[state.curPkmIndex].attack_3;
    optionsListItems[3].lastChild.data = "";
  } else if (state.screen === "attack-mode" && state.screen !== "hold-mode") {
    //Displays user command in infobox yellow
    let playerCommands = `${state.yourPkmn[state.curPkmIndex].name}, use ${
      state.optionSelected
    } attack on ${state.opponentPokemon.name}!`;
    dialogue.textContent = playerCommands;
    state.screen = "hold-mode";
    const energy = state.yourPkmn[state.curPkmIndex][`${state.attackSelected}`];
    const attack_num = state.attackSelected;
    delay(1000)
      .then(() => {
        sound.attack.play();
        iframeDocument
          .querySelector(".player__img")
          .classList.add(`player-${attack_num}`);
        iframeDocument
          .querySelector(".player-energy")
          .classList.add(`player-energy--show`, `player-${energy}--animate`);
        iframeDocument
          .querySelector(".opponent__img")
          .classList.add("opponent--stagger");
      })
      .then(() => {
        delay(4000).then(() => {
          iframeDocument
            .querySelector(".player__img")
            .classList.remove(`player-${attack_num}`);
          iframeDocument
            .querySelector(".player-energy")
            .classList.remove(
              `player-energy--show`,
              `player-${energy}--animate`
            );
          iframeDocument
            .querySelector(".opponent__img")
            .classList.remove("opponent--stagger");
          let attack = Math.floor(
            playerPokemon.attackPower(`${attack_num}`)
          );
          oppPokemon.damage(attack);
          iframe.contentWindow.updateValues();
          oppTurn();
        });
      });
  }
};

const bagOption = () => {
  if (state.optionSelected === "bag" && state.itemsAllowed !== 0) {
    bagItems = iframeDocument.querySelector(".bag-list").children;
    numItems2 = bagItems.length - 1;
    //Display bag item quantity
    var bagItemElements = 0;
    var bagObject = state.bag;
    for (const prop in bagObject) {
      bagItemElements += 1;
      bagItems[
        bagItemElements
      ].firstElementChild.textContent = `${bagObject[prop]}x`;
    }
    state.selectedAnswer = "Exit";
    state.screen = "hold-mode";
    state.optionSelected = "bag-opened";
    iframeDocument.querySelector(".backpack").classList.add("backpack--show");
    iframeDocument.querySelector(".bag").classList.add("bag--show");
  } else if (state.optionSelected === "bag-opened") {
    //Execute item picked
    let item = state.selectedAnswer;
    //Only call itemSelected function if item quantity is not zero.
    state.bag[item] > 0 || state.selectedAnswer === "Exit"
      ? itemSelected(item)
      : null;
  } else if (state.optionSelected === "bag" && state.itemsAllowed === 0) {
    dialogue.textContent =
      "You already used an item this turn. Choose another option.";
  }
};

const runOption = () => {
  sound.fail.play();
  sound.fail.volume = 0.1;
  dialogue.textContent = `You can't run! Keep fighting!`;
};

const pkmonOption = () => {
  if (state.optionSelected === "pkmon" && state.switchPkmn === 1) {
    //Always default your Pokemon to first on list
    state.curPkmIndex = 0;
    iframeDocument.querySelector(".backpack").classList.add("backpack--show");
    iframeDocument
      .querySelector(".yourPkmnList")
      .classList.add("yourPkmnList--show");
    //**Your Pokemon Panel**//
    //display pokemon from yourPkmn List
    const pkmonList = state.yourPkmn;
    let list = "";
    pkmonList.forEach((pokemon, i) => {
      list += `<li id="card_${i}" class="selection__card"><img
      src="${pokemon.image}"
      class="selection__img"
       alt="${pokemon.name}"
       />
      <p class="selection__name">${pokemon.name}</p>
      <p class="selection__mystery-sign">?</p>
      </li>`;
    });
    iframeDocument.querySelector(".yourPkmnList").innerHTML = list;
    yourPkmn = iframeDocument.querySelector(".yourPkmnList").children;
    iframeDocument
      .querySelector(".yourPkmnList")
      .firstElementChild.classList.add("selection__card--selected");
    state.screen = "yourPkmn";
    numItems3 = yourPkmn.length - 1;
    state.optionSelected = "pkmn-switch";
  } else if (state.optionSelected === "pkmn-switch" && state.switchPkmn === 1) {
    //Load switched in Pokemon
    iframeDocument
      .querySelector(".backpack")
      .classList.remove("backpack--show");
    iframeDocument
      .querySelector(".yourPkmnList")
      .classList.remove("yourPkmnList--show");
    iframe.contentWindow.switchPokemon();
    state.switchPkmn = 0;
    dialogue.textContent = `I choose, ${
      state.yourPkmn[state.curPkmIndex].name
    }!`;
    loadPokemon();
    sound.switch.play();
    sound.switch.volume = 0.4;
    playerPokemon.switchPkmnHeatlh();
    delay(3000).then(() => {
      oppTurn();
    });
  } else if (state.switchPkmn === 0) {
    dialogue.textContent = `You already switched out a Pokemon this battle. Pick another option.`;
  }
};

//Executes Bag Item selected
const itemSelected = (item) => {
  closeBag();
  switch (item) {
    case "Pokeball":
      throwPokeBall();
      break;
    case "Potion":
    case "Super Potion":
      playerPokemon.recover(item);
      break;
    default:
      null;
  }
};

//Turn off bag display
const closeBag = () => {
  iframeDocument.querySelector(".backpack").classList.remove("backpack--show");
  iframeDocument.querySelector(".bag").classList.remove("bag--show");
  bagItems[count2].classList.remove("bag-item--selected");
  bagItems[count2].children[1].classList.remove("bag-item-img--selected");
  state.optionSelected = "bag";
  count2 = 0;
  bagItems[count2].classList.add("bag-item--selected");
  bagItems[count2].children[1].classList.add("bag-item-img--selected");
  //Keep in hold-mode if Pokeball is used
  if (state.selectedAnswer !== "Pokeball") {
    state.screen = "battle-screen";
  }
};

//Display current pokemon data to infbox
const getDataSet = (count) => {
  //Update state with currently highlighted pokemon
  state.curSelectPokemon = state.pokemonList[count];
  //List info of current pokemon
  return `<li>${selectionListItems[count].dataset.type}</li>
      <li>${selectionListItems[count].dataset.health}</li>
      <li>${selectionListItems[count].dataset.attack}</li>
      <li>${selectionListItems[count].dataset.defense}</li>
      <li>${selectionListItems[count].dataset.weakness}</li>`;
};

//Resets infobox Red options list
const resetOptions = () => {
  if (state.screen === "gameover-screen") {
    state.yourPkmn = [];
    state.curPkmIndex = 0;
    numItems = 0;
    numItems2 = 0;
    numItems3 = 0;
    state.wins = 0;
  } else {
    dialogue.textContent = `It's your move!`;
    //Resets options list
    optionsListItems[0].lastChild.data = "attack";
    optionsListItems[1].lastChild.data = "bag";
    optionsListItems[2].lastChild.data = "pkmon";
    optionsListItems[3].lastChild.data = "run";
    //Reset count and arrow icon
    optionsListItems[count].children[0].classList.remove("arrow--selected");
    iframeDocument
      .querySelector(".option-grid")
      .classList.remove("option-grid--list");
    count = 0;
    count2 = 0;
    count3 = 0;
    optionsListItems[count].children[0].classList.add("arrow--selected");
    state.screen = "battle-screen";
    state.itemsAllowed = 5;
  }
  state.optionSelected = "attack";
  state.attackSelected = "";
  state.selectedAnswer = "yes";
};

const oppTurn = () => {
  if (state.screen !== "gameover-screen") {
    dialogue.textContent = `It's your opponent ${state.opponentPokemon.name}'s move.`;
    delay(2000).then(() => {
      const ranNum = Math.floor(Math.random() * 3) + 1;
      state.attackSelected = `attack_${ranNum}`;
      const energy = state.opponentPokemon[`${state.attackSelected}`];
      dialogue.textContent = `${state.opponentPokemon.name} uses ${energy} attack.`;
      sound.attack.play();
      const attack_num = state.attackSelected;
      iframeDocument
        .querySelector(".opponent__img")
        .classList.add(`opponent-${attack_num}`);
      iframeDocument
        .querySelector(".opponent-energy")
        .classList.add(`opponent-energy--show`, `opponent-${energy}--animate`);
      iframeDocument
        .querySelector(".player__img")
        .classList.add("player--stagger");
      delay(4000).then(() => {
        iframeDocument
          .querySelector(".opponent__img")
          .classList.remove(`opponent-${attack_num}`);
        iframeDocument
          .querySelector(".opponent-energy")
          .classList.remove(
            `opponent-energy--show`,
            `opponent-${energy}--animate`
          );
        iframeDocument
          .querySelector(".player__img")
          .classList.remove("player--stagger");
        let attack = Math.floor(oppPokemon.attackPower(`${attack_num}`));
        playerPokemon.damage(attack);
        resetOptions();
      });
    });
  }
};

//Determines catch success rate probability based on health of opponent
const throwPokeBall = () => {
  state.bag.Pokeball -= 1;
  state.itemsAllowed -= 1;
  const healthPercent = Math.floor(
    (oppPokemon.pkmState.health_active / oppPokemon.pkmState.health_total) * 100
  );
  if (healthPercent > 40) {
    return catchSuccess(100);
  } else if (healthPercent < 40 && healthPercent > 30) {
    return catchSuccess(10);
  } else if (healthPercent < 30 && healthPercent > 20) {
    return catchSuccess(5);
  } else if (healthPercent < 20 && healthPercent > 10) {
    return catchSuccess(3);
  } else {
    return catchSuccess(2);
  }
};

//Randomly catch success based on number range
const catchSuccess = (n) => {
  let matchNum = Math.floor(Math.random() * n) + 1;
  let successNum = Math.floor(Math.random() * n) + 1;
  if (matchNum === successNum) {
    return pokemonCaught("success");
  }
  return pokemonCaught("fail");
};

//Pokeball catching Pokemon
const pokemonCaught = (caught) => {
  iframeDocument.querySelector(".opponent__img").classList.add("pokeBallHit");
  dialogue.textContent = "'Go pokeball!'";
  delay(2000)
    .then(() => {
      sound.catch.play();
      iframeDocument
        .querySelector(".opponent__img")
        .classList.remove("pokeBallHit");
      iframeDocument.querySelector(".opponent__img").classList.add("pokeBall");
      iframeDocument.querySelector(".opponent__img").src =
        "https://www.serebii.net/itemdex/sprites/pgl/pokeball.png";
      dialogue.textContent = `You caught ${oppPokemon.pkmState.name}...`;
      state.captured = true;
    })
    .then(() => {
      delay(3500).then(() => {
        //If fail, release pokemon
        if (caught === "fail") {
          sound.fail.play();
          sound.fail.volume = 0.3;
          state.captured = false;
          dialogue.textContent = `${oppPokemon.pkmState.name} broke free! It's too strong! What's your next move?`;
          iframeDocument
            .querySelector(".opponent__img")
            .classList.remove("pokeBall");
          iframeDocument.querySelector(".opponent__img").src =
            state.opponentPokemon.oppSprite;
          state.screen = "battle-screen";
        } else if (caught === "success") {
          //Reduce Opponent Pokemon if caught success during battle.
          oppPokemon.damage(90000);
        } else {
          playerPokemon.win();
        }
      });
    });
};

//Pokemon status
class Pokemon {
  constructor(side, attack, defense, totalHealth, state, healthFill) {
    this.side = side;
    this.attackpt = attack;
    this.defense = defense;
    this.totHealth = totalHealth;
    this.pkmState = state;
    this.healthFillEl = healthFill;
  }
  attackPower(attacktype) {
    let accuracy = Math.random() * (1 - 0.5) + 0.5;
    if (attacktype === "attack_1" || attacktype === "attack_3") {
      return (
        this.pkmState.health_active * 0.05 + this.attackpt * 0.22 * accuracy
      );
    }
    return this.pkmState.health_active * 0.05 + this.attackpt * 0.25 * accuracy;
  }
  damage(attack) {
    let defensePt = this.defense * 0.025;
    let damage = attack - defensePt;
    // let damage = 20; //temp damage test
    let currHealth = Math.floor(this.pkmState.health_active - damage);
    if (currHealth <= 0) {
      currHealth = 0;
    }
    this.value = currHealth;
    this.update();
  }
  recover(potion) {
    //Determines which potion count to reduce
    potion === "Potion"
      ? (state.bag.Potion -= 1)
      : (state.bag["Super Potion"] -= 1);
    //Determines which potion to use
    let healPoints = potion === "Potion" ? 15 : 25;
    let currHealth = Math.floor(this.pkmState.health_active + healPoints);
    state.itemsAllowed -= 1;
    if (currHealth >= this.pkmState.health_total) {
      currHealth = this.pkmState.health_total;
    }
    this.value = currHealth;
    dialogue.textContent = `Your ${potion} restored ${this.pkmState.name}'s health to ${currHealth}.`;
    this.update();
    sound.heal.play();
    sound.heal.volume = 0.1;
  }
  delayLoadingScreen(screen, screenFunc) {
    state.switchPkmn = 1;
    delay(4000).then(() => {
      displayScreen(screen, screenFunc);
    });
  }
  switchPkmnHeatlh() {
    //Updates health bar to switched in Pokemon
    this.value = this.pkmState.health_active;
    this.update();
  }
  update() {
    //Updates health
    const percentage = Math.floor((this.value / this.totHealth) * 100) + "%";
    //Health value
    this.pkmState.health_active = this.value;
    iframe.contentWindow.updateValues();
    //Health bar level
    this.healthFillEl.style.width = percentage;
    if (this.pkmState.health_active === 0 && this.side === "opponent") {
      //You win
      state.screen = "gameover-screen";
      dialogue.textContent = `It's health is 0.`;
      delay(1500).then(() => {
        //If Pokemon has not been captured, use Pokeball.
        state.captured === false ? pokemonCaught(null) : this.win();
      });
    } else if (this.pkmState.health_active === 0) {
      this.lose();
    }
  }
  win() {
    sound.winGame.play();
    state.wins += 1;
    //Receive an extra item randomly
    const ranNum = Math.floor(Math.random() * 3);
    const bagItemsArr = ["Potion", "Super Potion", "Pokeball"];
    const itemWon = bagItemsArr[ranNum];
    state.bag[itemWon] += 1;
    //display winning item infobox red
    dialogue.textContent = `You win ${state.wins} round.`;
    sound.winGame.play();
    //Add Caught Pokemon to your team
    state.yourPkmn.push(state.opponentPokemon);
    //Reset
    state.captured = false;
    //Restore all pokemon when new round starts
    // dialogue.textContent = `You gained an extra ${itemWon} this battle.`
    if (state.wins === 2) {
      //You win a Pokemon badge //Gameover
      this.delayLoadingScreen("gameover-screen", gameoverScreen);
    } else {
      //Continue Battle Rounds
      this.delayLoadingScreen("opp-selection-screen", oppSelectionScreen);
    }
  }
  lose() {
    sound.lostGame.play();
    dialogue.textContent = "You lost!";
    state.screen = "gameover-screen";
    this.delayLoadingScreen("gameover-screen", gameoverScreen);
  }
}

async function init() {
  console.log("starting up app...");
  //--------Load Intro Screen--------//
  displayScreen("intro-screen", introScreen);
  // delay(1500).then(()=>{
  //   state.screen = "intro-screen";
  //   document.getElementsByName("screen-display")[0].src =
  //     state.screen + ".html";
  // })

  //--Opponent Screen--//
  // displayScreen("opp-selection-screen", oppSelectionScreen);

  //--Battle Screen Test load---//
  // const response1 = await fetch("./src/player.json").catch((err) =>
  //   console.log(err)
  // );
  // const data1 = await response1.json().catch((err) => console.log(err));
  // state.curSelectPokemon = data1[0];
  // console.log(data1)

  // const response2 = await fetch("./src/opponent.json").catch((err) =>
  //   console.log(err)
  // );
  // const data2 = await response2.json().catch((err) => console.log(err));
  // state.opponentPokemon = data2[0];
  // state.screen = "battle-screen";
  // document.getElementsByName("screen-display")[0].src = state.screen + ".html";
  // displayScreen("battle-screen", battleScreen);

  // //==Temp load a pokemon team==//
  // //Grab from state 3 pokemon
  // const response3 = await fetch("./src/pokemonList.json").catch((err) =>
  //   console.log(err)
  // );
  // const data = await response3.json().catch((err) => console.log(err));
  // for (let i = 7; i < 9; i++) {
  //   state.yourPkmn.push(data[i]);
  // }

  //---Gameover Test Load---//
  // displayScreen("gameover-screen", gameoverScreen);
}

init();
