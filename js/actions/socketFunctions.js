const host = "https://clypsync.herokuapp.com";
var socket = io.connect(host);
let sendButton = document.getElementById("send");
let status = document.getElementById("status");
let signoutButton = document.getElementById("signout");

const deleteAuthToken = async (user) => {
  try {
    signoutButton.innerHTML = "signing out";
    const config = {
      headers: {
        Authorization: `Bearer ${user.token} `,
      },
    };
    const response = await axios.post(`${host}/logout`, config);
    console.log(response.data, "looged out");
    signoutButton.innerHTML = "signout";
  } catch (error) {
    console.log(error.message);
    signoutButton.innerHTML = "signout";
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
    clipText.getElementById("text").innerHTML = "";
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

  socket.on(`to_pc-${email}`, (data) => {
    const { clip } = data;
    
    saveClip(user, clip);

    
    
    // document.getElementById("info").append("has been copied to your clipboard") ;
    navigator.clipboard.writeText(clip).then(async () => {
    
      let receivedText=clip.length>20?clip.substring(0,20)+"..." :clip
      chrome.notifications.create(
        String(Math.random()),
        {
          type: "basic",
          iconUrl: "./assets/icon/logo2.png",
          title: "Clipboard from phone",
          message: `${receivedText} has been copied to your clipboard`,
        },
        function () {}
      );
    });
  });
};

const Disconnect = (user) => {
  socket.disconnect();
  // socket.off(`to_pc-${user.email}`, (data) => {console.log("offed")});
};

const saveClip = async (user, clip) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    };
    const payload = {
      from: "phone",
      to: "pc",
      ownerid: user.id,
      clipdata: clip,
    };
    // console.log(payload)

    const response = await axios.post(`${host}/addClipBoard`, payload, config);
    console.log(response.data);
  } catch (error) {
    console.log(error.response.data);
  }
};
