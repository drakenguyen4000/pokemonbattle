// const opponentPokemon = window.parent.state.opponentPokemon;
// const playerPokemon = window.parent.state.playerPokemon;
const opponentPokemon = window.parent.state.opponentPokemon[0];
const playerPokemon = window.parent.state.playerPokemon[0];

const battleGround = () => {
 
  console.log("battle screen started...");
  // Load screen for 2 seconds
  setTimeout(() => {
    //Hide loading screen
    document
      .querySelector(".loading-screen")
      .classList.add("loading-screen--hide");
    setTimeout(() => {
      //Opponent
      document.querySelector(".opponent__img").src = opponentPokemon.oppSprite;
      document.querySelector(".opponent-health__name").innerHTML =
        opponentPokemon.name;
      document.querySelector(".opponent-health__name").innerHTML =
        opponentPokemon.name;
      document.querySelector(".opponent-health__total").innerHTML =
        opponentPokemon.health_total;
      document.querySelector(".opponent-health__active").innerHTML =
        opponentPokemon.health_active;

      //Player
      document.querySelector(".player__img").src = playerPokemon.playerSprite;
      document.querySelector(".player-health__name").innerHTML =
        playerPokemon.name;
      document.querySelector(".player-health__total").innerHTML =
        playerPokemon.health_total;
      document.querySelector(".player-health__active").innerHTML =
        playerPokemon.health_active;

      //Infobox 1
      document.querySelector(
        ".infobox__text"
      ).textContent = `You encountered a ${opponentPokemon.name}, a ${opponentPokemon.type} Pokemon. What will you do?`;
    }, 2000);
  }, 2000);
};

function updateValues() {
  document.querySelector(".opponent-health__active").innerHTML =
    opponentPokemon.health_active;
  document.querySelector(".player-health__active").innerHTML =
    playerPokemon.health_active;
}

window.onload = battleGround;
