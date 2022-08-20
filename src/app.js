// const introPage = "intro-screen.html";
// const selectionPage = "selection-screen.html";
// const battlePage = "battle-screen.html";
// const gameoverPage = "gameover-screen.html";
const startButton = document.querySelector(".btn-start");

// // //Intro start game button
startButton.addEventListener("click", function () {
  const selectionPage = "selection-screen.html";
  //Take Intro Screen
  document.getElementsByName("screen-display")[0].src = selectionPage;
});

// async function getPokemon() {
//   const response = await fetch("./src/pokemonList.json");
//   const data = await response.json();
//   console.log(data);
//   // return data;

//   let list = "";
//   data.forEach(function (item) {
//     list += `<li class="selection__card">
//   <img
//     src="${item.image}"
//     class="selection__img"
//     alt="${item.name}"
//   />
//   <p class="selection__name">${item.name}</p>
//   <p class="player__card-mystery">?</p>
// </li>`;
//   });

//   var iframe = document.getElementById("iframe");
//   var elmnt = iframe.contentWindow.document.querySelector("#output");
//   elmnt.innerHTML = list;
// }
