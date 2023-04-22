const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

const form = document.getElementById("form");
const input = document.querySelector("#input");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    // the third argument is an acknowledgements
    socket.emit("sendMessage", input.value, (error) => {
      if (error) {
        return console.log(error);
      }
      console.log("message delivered");
    });
  }
});

// Send Location
document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation is not supported on your browser");

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    // callback the third argument is a socket acknowledgement
    socket.emit("sendLocation", { latitude, longitude }, () => {
      console.log("Location shared!");
    });
  });
});
