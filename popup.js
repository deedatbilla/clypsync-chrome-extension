let changeColor = document.getElementById("changeColor");
var socket = io.connect("https://clypsync.herokuapp.com", {
});
changeColor.addEventListener("click", async () => {
  socket.emit("from_pc", {
    clip: "new internet",
    email: "deedat5@gmail.com",
  });
});