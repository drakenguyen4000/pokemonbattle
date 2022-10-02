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
let count = 0;
let count2 = 0;
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
let playagainList;
let bagItems;

var state = {
  pokemonList: {},
  playerPokemon: {},
  opponentPokemon: {},
  selectedAnswer: "yes",
  screen: "",
  optionSelected: "attack",
  attackSelected: "",
  wins: 0,
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
  //Set default pokemon
  state.playerPokemon = pokemonList[0];
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
  //Pokemon Class Instance
  let player = "player";
  let opponent = "opponent";
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

const gameoverScreen = () => {
  iframeDocument = iframe.contentWindow.document;
  playagainList = iframeDocument.querySelector(".playagain").children;
  numItems = playagainList.length - 1;
  resetOptions();
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
  console.log(count)
  console.log(count2)
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
    state.attackSelected = "attack_1";
    dialogue.innerHTML = "Pick an attack!";
    //Display attacks in infobox red
    optionsListItems[0].lastChild.data = state.playerPokemon[0].attack_1;
    optionsListItems[1].lastChild.data = state.playerPokemon[0].attack_2;
    optionsListItems[2].lastChild.data = "";
    optionsListItems[3].lastChild.data = "";
  } else if (state.screen === "attack-mode" && state.screen !== "hold-mode") {
    //Displays user command in infobox yellow
    let playerCommands = `${state.playerPokemon[0].name}, use ${state.optionSelected} attack on ${state.opponentPokemon[0].name}!`;
    dialogue.innerHTML = playerCommands;
    state.screen = "hold-mode"; //temp turn off
    if (state.attackSelected === "attack_1") {
      const energy = state.playerPokemon[0].attack_1;
      setTimeout(() => {
        iframeDocument
          .querySelector(".player__img")
          .classList.add("player-attack");
        iframeDocument
          .querySelector(".player-energy")
          .classList.add(`player-${energy}--animate`);
        iframeDocument
          .querySelector(".opponent__img")
          .classList.add("staggered");
        setTimeout(() => {
          iframeDocument
            .querySelector(".player__img")
            .classList.remove("player-attack");
          iframeDocument
            .querySelector(".player-energy")
            .classList.remove(`player-${energy}--animate`);
          iframeDocument
            .querySelector(".opponent__img")
            .classList.remove("staggered");
          let attack = Math.floor(playerPokemon.attackPower("attack_1"));
          oppPokemon.damage(attack);
          iframe.contentWindow.updateValues();
          oppTurn(); //temp turn off
        }, 4000);
      }, 1000);
    }
    if (state.attackSelected === "attack_2") {
      const energy = state.playerPokemon[0].attack_2;
      setTimeout(() => {
        iframeDocument
          .querySelector(".player__img")
          .classList.add("player-attack_2");
        iframeDocument
          .querySelector(".player-energy")
          .classList.add(`player-${energy}--animate`);
        iframeDocument
          .querySelector(".opponent__img")
          .classList.add("staggered_2");
        setTimeout(() => {
          iframeDocument
            .querySelector(".player__img")
            .classList.remove("player-attack_2");
          iframeDocument
            .querySelector(".player-energy")
            .classList.remove(`player-${energy}--animate`);
          iframeDocument
            .querySelector(".opponent__img")
            .classList.remove("staggered_2");
          let attack = Math.floor(playerPokemon.attackPower("attack_2"));
          oppPokemon.damage(attack);
          iframe.contentWindow.updateValues();
          oppTurn(); //temp turn off
        }, 4000);
      }, 1000);
    }
  } else if (
    state.screen === "gameover-screen" &&
    state.selectedAnswer === "yes"
  ) {
    displayScreen("selection-screen", selectionScreen);
  } else if (
    state.screen === "gameover-screen" &&
    state.selectedAnswer === "no"
  ) {
    displayScreen("intro-screen", introScreen);
  }
  //bag (potions)
  else if (state.optionSelected === "bag") {
    bagItems = iframeDocument.querySelector(".bag-list").children;
    numItems2 = bagItems.length - 1;
    state.selectedAnswer = "Exit";
    state.screen = "hold-mode";
    state.optionSelected = "bag-opened";
    iframeDocument.querySelector(".bag").classList.add("bag--show");
  } else if (state.optionSelected === "bag-opened") {
    //Execute item picked
    let item = state.selectedAnswer;
    itemSelected(item);
    //Turn off bag display
    iframeDocument.querySelector(".bag").classList.remove("bag--show");
    bagItems[count2].classList.remove("bag-item--selected");
    bagItems[count2].children[1].classList.remove("bag-item-img--selected");
    //reset options
    state.optionSelected = "bag";
    count2 = 0;
    bagItems[count2].classList.add("bag-item--selected");
    bagItems[count2].children[1].classList.add("bag-item-img--selected");
    //Keep in hold-mode if Pokeball is used
    if(state.selectedAnswer !== "Pokeball") {
      state.screen = "battle-screen";
    }
  }
  // else if (state.screen === "battle-screen" &&)
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
  //Prevents count / d-pad change
  if (state.screen !== "hold-mode" && state.screen !== "gameover-screen") {
    //Adds 1 every time user clicks right button on d-pad
    count += 1;
  }
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
  if (state.screen !== "hold-mode" && state.screen !== "gameover-screen") {
    count -= 1;
  }
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
  } else if (state.screen === "gameover-screen") {
    count += 1;
    count > numItems ? (count = numItems) : switchDirection3("down");
  } else if (state.optionSelected === "bag-opened") {
    count2 += 1;
    count2 > numItems2 ? (count2 = numItems2) : switchDirection4("down");
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
  } else if (state.screen === "gameover-screen") {
    count -= 1;
    count < 0 ? (count = 0) : switchDirection3("up");
  } else if (state.optionSelected === "bag-opened") {
    count2 -= 1;
    count2 < 0 ? (count2 = 0) : switchDirection4("up");
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
      state.attackSelected = count > 0 ? "attack_2" : "attack_1";
      break;
    case "left":
      optionsListItems[count + 1].children[0].classList.remove(
        "arrow--selected"
      );
      optionsListItems[count].children[0].classList.add("arrow--selected");
      state.optionSelected = optionsListItems[count].lastChild.data;
      state.attackSelected = count > 0 ? "attack_2" : "attack_1";
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
      bagItems[count2 - 1].children[1].classList.remove("bag-item-img--selected");
      bagItems[count2].children[1].classList.add("bag-item-img--selected");
      state.selectedAnswer = bagItems[count2].children[1].nextElementSibling.textContent;
      break;
    case "up":
      bagItems[count2 + 1].classList.remove("bag-item--selected");
      bagItems[count2].classList.add("bag-item--selected");
      bagItems[count2 + 1].children[1].classList.remove("bag-item-img--selected");
      bagItems[count2].children[1].classList.add("bag-item-img--selected");
      state.selectedAnswer = bagItems[count2].children[1].nextElementSibling.textContent;
      break;
  }
} 

//Executes Bag Item selected
const itemSelected = (item) => {
  switch(item){
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
}

//Display current pokemon data to infbox
const getDataSet = (count) => {
  //Update state with currently highlighted pokemon
  state.playerPokemon = state.pokemonList[count];
  //List info of current pokemon
  return `<li>${selectionListItems[count].dataset.type}</li>
      <li>${selectionListItems[count].dataset.health}</li>
      <li>${selectionListItems[count].dataset.attack}</li>
      <li>${selectionListItems[count].dataset.defense}</li>
      <li>${selectionListItems[count].dataset.weakness}</li>`;
};

const resetOptions = () => {
  if (state.screen !== "gameover-screen") {
    dialogue.innerHTML = `It's your move!`;
    //Resets options list
    optionsListItems[0].lastChild.data = "attack";
    optionsListItems[1].lastChild.data = "bag";
    optionsListItems[2].lastChild.data = "pkmon";
    optionsListItems[3].lastChild.data = "run";
    //Reset count and arrow icon
    optionsListItems[count].children[0].classList.remove("arrow--selected");
    count = 0;
    optionsListItems[count].children[0].classList.add("arrow--selected");
    state.screen = "battle-screen";
    state.optionSelected = "attack";
    state.attackSelected = "";
  }
  state.selectedAnswer = "yes";
  state.optionSelected = "attack";
  state.attackSelected = "";
};

const oppTurn = () => {
  if (state.screen !== "gameover-screen") {
    dialogue.innerHTML = `It's your opponent, ${state.opponentPokemon[0].name}'s, move.`;
  }
  setTimeout(() => {
    if (state.screen !== "gameover-screen") {
      state.attackSelected = Math.random() > 0.5 ? "attack_1" : "attack_2";
      if (state.attackSelected === "attack_1") {
        const energy = state.opponentPokemon[0].attack_1;
        iframeDocument
          .querySelector(".opponent__img")
          .classList.add("opponent-attack");
        iframeDocument
          .querySelector(".opponent-energy")
          .classList.add(`opponent-${energy}--animate`);
        iframeDocument.querySelector(".player__img").classList.add("staggered");
        setTimeout(() => {
          iframeDocument
            .querySelector(".opponent__img")
            .classList.remove("opponent-attack");
          iframeDocument
            .querySelector(".opponent-energy")
            .classList.remove(`opponent-${energy}--animate`);
          iframeDocument
            .querySelector(".player__img")
            .classList.remove("staggered");
          let attack = Math.floor(oppPokemon.attackPower("attack_1"));
          playerPokemon.damage(attack);
          // iframe.contentWindow.updateValues();
          resetOptions();
        }, 4000);
      }
      if (state.attackSelected === "attack_2") {
        const energy = state.opponentPokemon[0].attack_2;
        iframeDocument
          .querySelector(".opponent__img")
          .classList.add("opponent-attack_2");
        iframeDocument
          .querySelector(".opponent-energy")
          .classList.add(`opponent-${energy}--animate`);
        iframeDocument
          .querySelector(".player__img")
          .classList.add("staggered_2");
        setTimeout(() => {
          iframeDocument
            .querySelector(".opponent__img")
            .classList.remove("opponent-attack_2");
          iframeDocument
            .querySelector(".opponent-energy")
            .classList.remove(`opponent-${energy}--animate`);
          iframeDocument
            .querySelector(".player__img")
            .classList.remove("staggered_2");
          let attack = Math.floor(oppPokemon.attackPower("attack_2"));
          playerPokemon.damage(attack);
          // iframe.contentWindow.updateValues();
          resetOptions();
        }, 4000);
      }
    }
  }, 2000);
};

const throwPokeBall = () => {
    //Determines catch success rate probability based on health of opponent
    const healthPercent = Math.floor(oppPokemon.pkmState.health_active / oppPokemon.pkmState.health_total * 100);
    if(healthPercent > 40){
      return catchSuccess(100)
    } else if (healthPercent < 40 && healthPercent > 30) {
      return catchSuccess(10)
    } else if (healthPercent < 30 && healthPercent > 20) {
      return catchSuccess(5)
    } else if (healthPercent < 20 && healthPercent > 10) {
      return catchSuccess(3);
    } else {
      const successNum = Math.floor(Math.random() * 4) + 1
      const matchNum = Math.floor(Math.random() * 4) + 1
     return matchNum !== successNum ? pokemonCaught("fail") : null;
  }
}

//Pokeball catching Pokemon
const pokemonCaught = (caught) =>{
  iframeDocument.querySelector(".opponent__img").classList.add("pokeBallHit");
  dialogue.textContent = `You threw a pokeball.`
  setTimeout(()=>{
    iframeDocument.querySelector(".opponent__img").classList.remove("pokeBallHit");
    iframeDocument.querySelector(".opponent__img").classList.add("pokeBall");
    iframeDocument.querySelector(".opponent__img").src ="https://www.serebii.net/itemdex/sprites/pgl/pokeball.png"
    dialogue.textContent = `You caught the ${oppPokemon.pkmState.name}...`
    setTimeout(()=>{
        //If fail, release pokemon
      if(caught === "fail") {
        dialogue.textContent = `${oppPokemon.pkmState.name} broke free! It's too strong! What's your next move?`
        iframeDocument.querySelector(".opponent__img").classList.remove("pokeBall");
        iframeDocument.querySelector(".opponent__img").src = state.opponentPokemon[0].oppSprite
        state.screen = "battle-screen";
    } else {
        //Else win
        oppPokemon.damage(90000);
        }
    }, 3500)
  }, 2000)
}

//Randomly catch success based on number range
const catchSuccess = (n) => {
    let matchNum = Math.floor(Math.random() * n) + 1;
    let successNum = Math.floor(Math.random() * n) + 1;
    if(matchNum === successNum) {
     return pokemonCaught("success");
    }
    return pokemonCaught("fail");
  }

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
    if (attacktype === "attack_1") {
      return (
        this.pkmState.health_active * 0.05 + this.attackpt * 0.12 * accuracy
      );
    }
    return this.pkmState.health_active * 0.05 + this.attackpt * 0.15 * accuracy;
  }
  damage(attack) {
    let defensePt = this.defense * 0.025;
    let damage = attack - defensePt;
    // let damage = 35; //temp damage test
    let currHealth = Math.floor(this.pkmState.health_active - damage);
    if (currHealth <= 0) {
      currHealth = 0;
    }
    this.value = currHealth;
    this.update();
  }
  recover(potion) {
    let healPoints = potion === "Potion" ? 15 : 25;
    let currHealth = Math.floor(this.pkmState.health_active + healPoints);
    if (currHealth >= this.pkmState.health_total) {
      currHealth = this.pkmState.health_total;
    }
    this.value = currHealth;
    dialogue.innerHTML = `Your ${potion} restored ${this.pkmState.name}'s health to ${currHealth}.`;
    this.update();
  }
  battleScreen() {
    setTimeout(()=>{
      displayScreen("gameover-screen", gameoverScreen);
    }, 4000)
  }
  update() {
    const percentage = Math.floor((this.value / this.totHealth) * 100) + "%";
    //Health value
    this.pkmState.health_active = this.value;
    iframe.contentWindow.updateValues();
    //Health bar level
    this.healthFillEl.style.width = percentage;
    if (this.pkmState.health_active === 0 && this.side === "opponent") {
      dialogue.innerHTML = "You win!";
      state.wins += 1;
      state.screen = "gameover-screen";
      this.battleScreen()
    } else if (this.pkmState.health_active === 0) {
      dialogue.innerHTML = "You lost!";
      state.screen = "gameover-screen";
      this.battleScreen()
    }
  }
}

async function init() {
  // console.log("starting up app...");
  //--------Load Intro Screen--------//
  // displayScreen("intro-screen", introScreen);
  // setTimeout(() => {
  //   state.screen = "intro-screen";
  //   // state.screen = "battle-screen";
  //   document.getElementsByName("screen-display")[0].src =
  //     state.screen + ".html";
  // }, 1500);

  // //--Battle Screen Test load---//
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

  state.screen = "battle-screen";
  document.getElementsByName("screen-display")[0].src = state.screen + ".html";
  displayScreen("battle-screen", battleScreen);

  //---Gameover Test Load---//
  // displayScreen("gameover-screen", gameoverScreen)
}

init();
