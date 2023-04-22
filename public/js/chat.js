const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

const form = document.getElementById("form");
const input = form.querySelector("#input");
const formButton = form.querySelector("#form-button");
let sendLocation = document.querySelector("#send-location");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (input.value) {
    // the third argument is an acknowledgements
    socket.emit("sendMessage", input.value, (error) => {
      // To delete message from input after sending
      input.value = "";
      // and we'll call focus to move the cursor inside of there.
      input.focus();

      if (error) {
        return console.log(error);
      }
      console.log("message delivered");
    });
  }
});

// Send Location
sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation is not supported on your browser");

  // Disable the button untill the location is sent
  sendLocation.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;

    // callback the third argument is a socket acknowledgement
    socket.emit("sendLocation", { latitude, longitude }, () => {
      // enable after acknowledgement
      // sendLocation.removeAttribute("disabled");

      // latitude = "";
      // longitude = "";

      console.log("Location shared!");
    });
  });
});
