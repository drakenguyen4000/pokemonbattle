const aiState = {
  opponentPokemon: {},
};

const getDataSet = () => {
  return `<li>${aiState.opponentPokemon.type}</li>
<li>${aiState.opponentPokemon.health}</li>
<li>${aiState.opponentPokemon.attack}</li>
<li>${aiState.opponentPokemon.defense}</li>
<li>${aiState.opponentPokemon.weakness}</li>`;
};

//Displays List of Pokemons
async function getPokemon() {
  console.log("ai-selection-screen started...");
  //Fetches Pokemon JSON file
  const response = await fetch("./src/pokemonList.json").catch((err) =>
    console.log(err)
  );
  const data = await response.json().catch((err) => console.log(err));
  //Randomly Picks Pokemon from JSON List
  const randomPokemon = Math.floor(Math.random() * data.length);
  //Store picked Pokemon in state
  aiState.opponentPokemon = data[randomPokemon];
  //Takes JSON data and create list
  let list = "";
  data.forEach((item, i) => {
    list += `<li id="card_${i}" class="selection__card selection__mystery-card--show"
      >
    <img
      src="${item.image}"
      class="selection__img--hide"
      alt="${item.name}"
    />
    <p class="selection__name--hide">${item.name}</p>
    <p class="selection__mystery-sign--show">?</p>
  </li>`;
  });
  //Load list
  document.querySelector(".selection__list").innerHTML = list;
  //Load screen for 2 seconds
  setTimeout(() => {
    //Hide loading screen
    document
      .querySelector(".loading-screen")
      .classList.add("loading-screen--hide");
  }, 2000);
  //Highlights first card with orange border
  document.getElementById("card_0").classList.add("selection__card--selected");
  //run through two loops before landing on selected card.
  let opponentListItems = document.querySelector(".selection__list").children;

  const slowLoop = (time) => {
    return new Promise((resolve) => {
      return setTimeout(() => {
        resolve();
      }, time);
    });
  };

  //Picks a Random Card position to display (randomly picked Pokemon)
  const randomPosition = Math.floor(Math.random() * data.length);

  //Loops through cards displayed and highlights current selection
  setTimeout(async () => {
    for (let j = 0; j < randomPosition; j++) {
      await slowLoop(500);
      opponentListItems[j].classList.remove("selection__card--selected");
      opponentListItems[j + 1].classList.add("selection__card--selected");
    }

    //Create a list item with the randomly picked pokemon
    const opponentPokemonLi = `<li id="card_${randomPosition}" class="selection__card selection__card--selected"
      data-name=${aiState.opponentPokemon.name}
      data-abilities=${aiState.opponentPokemon.abilities}
      data-summary=${aiState.opponentPokemon.summary}
      data-type=${aiState.opponentPokemon.type}
      data-weakness=${aiState.opponentPokemon.weakness}
      data-health=${aiState.opponentPokemon.health}
      data-attack=${aiState.opponentPokemon.attack}
      data-defense=${aiState.opponentPokemon.defense}
      data-evolve=${aiState.opponentPokemon.evolve}
      >
    <img
      src="${aiState.opponentPokemon.image}"
      class="selection__img"
      alt="${aiState.opponentPokemon.name}"
    />
    <p class="selection__name">${aiState.opponentPokemon.name}</p>
    <p class="selection__mystery-sign">?</p>
  </li>`;
  //Replace current list item with item of randomly picked pokemon
    opponentListItems[randomPosition].outerHTML = opponentPokemonLi;
    opponentListItems[randomPosition].classList.add(
      "selection__mystery-card--hide"
    );
    //Update infobox with Opponent Pokemon's details
    document.querySelector(".info-list2").innerHTML = getDataSet();
  }, 3000);
}

window.onload = getPokemon;
