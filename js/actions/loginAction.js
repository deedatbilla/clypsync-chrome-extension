const host = "https://clypsync.herokuapp.com";
let login = document.getElementById("login");
let errorView=document.getElementById("error");
chrome.storage.sync.get("user", ({ user }) => {
  if (user) {
    chrome.action.setPopup({
      popup: "./background.html",
    });
  }
});
login.addEventListener("click", async (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  login.disabled = true;
  errorView.style.display="none"
  try {
    login.innerHTML = "Signing In";
    const response = await axios.post(`${host}/signin`, {
      email,
      password,
    });
    login.disabled = false;
    login.innerHTML = "Sign In";
    console.log(response.data);
    chrome.storage.sync.set({ user: response.data });
    //   chrome.action.setPopup({
    //     popup:"./background.html"
    //  });

    window.location.href = "./background.html";
  } catch (error) {
    console.log(error.message);
    login.disabled = false;
    login.innerHTML = "Sign In";
    errorView.style.display="block"
    
  }

  // alert("sf")
});
