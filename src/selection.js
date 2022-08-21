

//Displays List of Pokemons
async function getPokemon() {
  //Fetches Pokemon JSON file
  const response = await fetch("./src/pokemonList.json").catch((err) =>
    console.log(err)
  );
  const data = await response.json().catch((err) => console.log(err));

  //Takes JSON data and displays on selection screen
  let selectionList = "";
  let infoDetails = "";
  data.forEach((item, i) => {
    selectionList += `<li id="card_${i}" class="selection__card"
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
  <p class="player__card-mystery">?</p>
</li>`;
  });
  document.querySelector(".selection__list").innerHTML = selectionList;
  //Highlights first card with orange border
  document.getElementById("card_0").classList.add("selection__card--selected");
  // const infoObject = {
  //   type: document.getElementById("card_0").dataset.type,
  //   health: document.getElementById("card_0").dataset.health,
  //   attack: document.getElementById("card_0").dataset.attack,
  //   defense: document.getElementById("card_0").dataset.defense,
  // };



  // console.log(document.getElementById("card_0").dataset);
  // console.log(infoObject);
  // document.querySelector(".selection__list").innerHTML = infoDetails;
}

window.onload = getPokemon;

//Side Scrolling effect
//info box displaying/loading info of pokemon
