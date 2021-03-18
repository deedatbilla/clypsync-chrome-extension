const host = "https://clypsync.herokuapp.com";
var socket = io.connect(host);
  chrome.storage.sync.get("user", ({ user }) => {
    if (!user) {
      //   window.location.href = "./login.html";
      Disconnect();
      return;
    }
    connectToserver(user);
  });


const connectToserver = (user) => {
  const { email } = user;
  socket.on("connect", () => {
    console.log(socket.id, "connected");
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  socket.on("connect_error", (error) => {});

  socket.on(`to_pc-${email}`, (data) => {
    const { clip } = data;
    console.log(clip);
    let receivedText = clip.length > 20 ? clip.substring(0, 20) + "..." : clip;

    socket.emit("to_pc_success", data);

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
    var copyText = document.getElementById("myInput");
    copyText.value = clip;
    copyText.select();
    document.execCommand("copy");
    // saveClip(user, clip);
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
