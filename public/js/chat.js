const socket = io();

const form = document.getElementById("form");
const input = form.querySelector("#input");
const formButton = form.querySelector("#form-button");
const sendLocation = document.querySelector("#send-location");
const messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const slidebarTemplate = document.querySelector("#slidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = function () {
  messages.scrollTop = messages.scrollHeight;
};

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(slidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (input.value) {
    // ? the third argument is an acknowledgements
    socket.emit("sendMessage", input.value, (error) => {
      // ? To delete message from input after sending
      input.value = "";
      // ? and we'll call focus to move the cursor inside of there.
      input.focus();

      if (error) {
        return console.log(error);
      }
      console.log("message delivered");
    });
  }
});

// * Send Location
sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation is not supported on your browser");

  // ? Disable the button untill the location is sent
  sendLocation.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;

    // ? callback the third argument is a socket acknowledgement
    socket.emit("sendLocation", { latitude, longitude }, () => {
      // ? enable after acknowledgement
      sendLocation.removeAttribute("disabled");

      latitude = "";
      longitude = "";

      console.log("Location shared!");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
