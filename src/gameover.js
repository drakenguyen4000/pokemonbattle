const gameoverScreen = () => {
  setTimeout(() => {
    //Hide loading screen
    document
      .querySelector(".loading-screen")
      .classList.add("loading-screen--hide");
      console.error.log("I'm running")
  }, 2000);
};

window.onload = gameoverScreen;
