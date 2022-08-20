//Displays List of Pokemons 
async function getPokemon() {
  //Fetches Pokemon JSON file
  const response = await fetch("./src/pokemonList.json").catch((err) =>
    console.log(err)
  );
  const data = await response.json().catch((err) => console.log(err));

  //Takes JSON data and displays on selection screen
  let list = "";
  data.forEach(function (item, i) {
    list += `<li id="card_${i}" class="selection__card">
  <img
    src="${item.image}"
    class="selection__img"
    alt="${item.name}"
  />
  <p class="selection__name">${item.name}</p>
  <p class="player__card-mystery">?</p>
</li>`;
  });
  document.querySelector(".selection__list").innerHTML = list;
  //Highlights first card with orange border
  document.getElementById("card_0").classList.add("selection__card--border");
}

window.onload = getPokemon;
