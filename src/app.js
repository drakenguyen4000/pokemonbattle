const greeting = "Hello World";
console.log(greeting);

const onClick = ()=> {
  console.log("attack!")
}

const attackBtn = document.getElementById("btn--attack");
console.log(attackBtn)
// const attackBtn = document.querySelector(".btn--attack");
attackBtn.addEventListener("click", onClick);
// attackBtn.addEventListener("click", () => {
//   console.log("attack!");
// });

// document.getElementsById("btn btn--attack").addEventListener("click", ()=> onClick)



// const getData = async (url) => {
//   const response = await fetch(url);
//   const result = await response.json();
//   console.log(result);
// };

// getData('https://jsonplaceholder.typicode.com/posts');
