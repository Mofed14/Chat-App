// * Environment Variables
require("dotenv").config();

// * Custome Modules
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages.js");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users.js");
const { badWordsInArabic } = require("./utils/bad-words.js");

// * Modules
const path = require("path");
const http = require("http");

// * Libararies
const express = require("express");
const { Server } = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// * Variables
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

// * Middlewares
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Admin", "Welcome!"));

    // ? Socket broadcast هو مصطلح يستخدم في تقنية الـ sockets في برمجة الويب. وهو يشير إلى إرسال رسالة من خادم الـ socket إلى جميع المستخدمين المتصلين به، باستثناء المستخدم الذي أرسل الرسالة.
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined!`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (inputValue, callback) => {
    const user = getUser(socket.id);
    if (user) {
      const filter = new Filter();
      filter.addWords("Ya Ibn el Sharmouta", "bad", "word");

      if (filter.isProfane(inputValue)) {
        return callback("profanity is not allowed");
      }

      if (badWordsInArabic(inputValue)) {
        return callback("الكلام السافل غير مسموح");
      }
      io.to(user.room).emit(
        "message",
        generateMessage(user.username, `${inputValue}`)
      );
      callback();
    }
  });

  // * send location
  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);
    if (user) {
      // ? the third argument is a socket acknowledgement
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          user.username,
          `https://google.com/maps?q=${latitude},${longitude}`
        )
      );
      callback();
    }
  });

  // ? discounnect is a built in event in socket io
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      // ? we don't need to use broadcast because this user is already disconnected
      // ? I use io.emit() because i will send this message to all connected users
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

// * Listen to requests
const start = async () => {
  try {
    await server.listen(port);
    console.log(`Server is up on port ${port}...`);
  } catch (error) {
    console.log(error);
  }
};

start();
