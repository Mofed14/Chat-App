// Environment Variables
require("dotenv").config();

// Modules
const path = require("path");
const http = require("http");

// Libararies
const express = require("express");
const { Server } = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Variables
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

// Middlewares
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.emit("message", "Weclome!");

  // Socket broadcast هو مصطلح يستخدم في تقنية الـ sockets في برمجة الويب. وهو يشير إلى إرسال رسالة من خادم الـ socket إلى جميع المستخدمين المتصلين به، باستثناء المستخدم الذي أرسل الرسالة.
  socket.broadcast.emit("message", "A new user has joined");

  socket.on("sendMessage", (inputValue, callback) => {
    const filter = new Filter();
    if (filter.isProfane(inputValue)) {
      return callback("profanity is not allowed");
    }
    io.emit("message", inputValue);
    callback();
  });

  // discounnect is a built in event
  socket.on("disconnect", () => {
    // we don't need to use broadcast because this user is already disconnected
    // I use io.emit() because i will send this message to all connected users
    io.emit("message", "A user has left!");
  });

  // send location
  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    // the third argument is a socket acknowledgement
    io.emit("message", `https://google.com/maps?q=${latitude},${longitude}`);
    callback();
  });
});

// Listen to requests
const start = async () => {
  try {
    await server.listen(port);
    console.log(`Server is up on port ${port}...`);
  } catch (error) {
    console.log(error);
  }
};

start();
