const aiState = {
  opponentPokemon: {},
  count: 0,
};
//Displays List of Pokemons
async function getPokemon() {
  console.log("ai-selection-screen started");
  //Fetches Pokemon JSON file
  const response = await fetch("./src/pokemonList.json").catch((err) =>
    console.log(err)
  );
  const data = await response.json().catch((err) => console.log(err));
  //Randomly Picks Pokemon
  const randomPick = Math.floor(Math.random() * data.length);
  opponentPokemon = data[randomPick];
  console.log(opponentPokemon);

  //Takes JSON data and displays on selection screen
  let selectionList = "";
  data.forEach((item, i) => {
    selectionList += `<li id="card_${i}" class="selection__card selection__mystery-card--show"
      data-name=${item.name}
      data-abilities=${item.abilities}
      data-summary=${item.summary}
      data-type=${item.type}
      data-weakness=${item.weakness}
      data-health=${item.health}
      data-attack=${item.attack}
      data-defense=${item.defense}
      data-evolve=${item.evolve}
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
  document.querySelector(".selection__list").innerHTML = selectionList;
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
  let selectionListItems = document.querySelector(".selection__list").children;
  console.log(selectionListItems);
  const slowLoop = (time) => {
    return new Promise((resolve) => {
      return setTimeout(() => {
        resolve();
      }, time);
    });
  };

  setTimeout(async () => {
    for (let i = 1; i < 9; i++) {
      await slowLoop(500);
      selectionListItems[i - 1].classList.remove("selection__card--selected");
      selectionListItems[i].classList.add("selection__card--selected");
    }
  }, 3000);
}

window.onload = getPokemon;
