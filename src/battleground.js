const opponentPokemon = window.parent.state.opponentPokemon;
const playerPokemon = window.parent.state.playerPokemon;

const battleGround = () => {
  // Load screen for 2 seconds
  setTimeout(()=>{
    //Hide loading screen
    document.querySelector(".loading-screen").classList.add("loading-screen--hide");
    setTimeout(()=>{
  //Opponent
  document.querySelector(".opponent__img").src = opponentPokemon.image;
  document.querySelector(".opponent-health__name").innerHTML =
    opponentPokemon.name;
    document.querySelector(".opponent-health__name").innerHTML = opponentPokemon.name;
    document.querySelector(".opponent-health__total").innerHTML = opponentPokemon.health_total;
    document.querySelector(".opponent-health__active").innerHTML = opponentPokemon.health_active;

  //Player
  document.querySelector(".player__img").src = playerPokemon.playerSprite;
  document.querySelector(".player-health__name").innerHTML = playerPokemon.name;
  document.querySelector(".player-health__total").innerHTML = playerPokemon.health_total;
  document.querySelector(".player-health__active").innerHTML = playerPokemon.health_active;
    //Infobox 1
  document.querySelector(".infobox__text").textContent = `You encountered a ${opponentPokemon.name}, a ${opponentPokemon.type} Pokemon. What will you do?`;
  
    }, 2000)
  }, 2000);
};

function updateValues () {
  document.querySelector(".opponent-health__active").innerHTML = opponentPokemon.health_active;
  document.querySelector(".player-health__active").innerHTML = playerPokemon.health_active;
}

// //Coordinates
// var opponentPos = document.querySelector(".opponent__img").getBoundingClientRect();
// var playerPos = document.querySelector(".player__img").getBoundingClientRect();
// // console.log("opponentPos:", "top:", opponentPos.top, "right:", opponentPos.right, "bottom:", opponentPos.bottom, "left:", opponentPos.left);
// // console.log("playerPos:", "top:", playerPos.top, "right:", playerPos.right, "bottom:", playerPos.bottom, "left:", playerPos.left);

// var x = opponentPos.left;
// var y = opponentPos.top;
// var x2 = playerPos.left;
// var y2 = playerPos.top;

// console.log("opp x:", x, "y:", y)
// console.log("player x:", x2, "y:", y2)



window.onload = battleGround;
