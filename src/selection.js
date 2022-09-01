//Displays List of Pokemons
async function getPokemon() {
  //Fetches Pokemon JSON file
  const response = await fetch("./src/pokemonList.json").catch((err) =>
    console.log(err)
  );
  const data = await response.json().catch((err) => console.log(err));
  //Takes JSON data and displays on selection screen
  let selectionList = "";
  data.forEach((item, i) => {
    selectionList += `<li id="card_${i}" class="selection__card"
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
    class="selection__img"
    alt="${item.name}"
  />
  <p class="selection__name">${item.name}</p>
  <p class="selection__mystery-sign">?</p>
</li>`;
  });
  //Load list
  document.querySelector(".selection__list").innerHTML = selectionList;
  //Load screen for 2 seconds
  setTimeout(()=>{
    //Hide loading screen
    document.querySelector(".loading-screen").classList.add("loading-screen--hide");
  }, 2000);
  //Highlights first card with orange border
  document.getElementById("card_0").classList.add("selection__card--selected");
}

window.onload = getPokemon;
