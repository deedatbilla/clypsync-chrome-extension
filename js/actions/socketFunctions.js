const host = "https://clypsync.herokuapp.com";
var socket = io.connect(host);
let sendButton = document.getElementById("send");
let status = document.getElementById("status");
let signoutButton = document.getElementById("signout");

const deleteAuthToken = async (user) => {
  try {
    signoutButton.innerHTML="signing out"
    const config = {
      headers: {
        Authorization: `Bearer ${user.token} `,
      },
    };
    const response = await axios.post(`${host}/logout`, config);
    console.log(response.data, "looged out");
    signoutButton.innerHTML="signout"
  } catch (error) {
    console.log(error.message);
    signoutButton.innerHTML="signout"
  }
};

// console.log(chrome.runtime)
signoutButton.addEventListener("click", async (e) => {
  chrome.storage.sync.get("user", ({ user }) => {
    Disconnect(user);
    deleteAuthToken(user);
    chrome.storage.sync.remove("user");
    window.location.href = "./login.html";
  });
});





chrome.storage.sync.get("user", ({ user }) => {
  if (!user) {
    window.location.href = "./login.html";
    Disconnect();
    return;
  }
  connectToserver(user);
  sendButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const { email } = user;
    let clipText = document.getElementById("text").value;
    socket.emit("from_pc", { clip: clipText, email });
  });
});







const connectToserver = (user) => {
  const { email } = user;
  socket.on("connect", () => {
    console.log(socket.id, "connected");
    status.innerHTML = "Connected";
    status.style.color = "green";
  });
  socket.on("disconnect", () => {
    status.innerHTML = "Disconnected";
    status.style.color = "red";
  });

  socket.on("connect_error", (error) => {
    status.innerHTML = "Error connecting";
    status.style.color = "red";
  });
};
const Disconnect = (user) => {
  socket.disconnect();
  // socket.off(`to_pc-${user.email}`, (data) => {console.log("offed")});
};
