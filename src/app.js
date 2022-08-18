
//Intro start game button
document.querySelector(".btn-start").addEventListener("click", function () {
  //Take Intro Screen
  // const page = 'selection-screen.html';
  const page = 'battle-screen.html';
  document.getElementsByName('screen-display')[0].src = page;
});


