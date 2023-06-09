const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // * clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // * validate data
  if (!username || !room) {
    return { error: `Username and Room are required` };
  }

  // * check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // * validate username
  if (existingUser) {
    return { error: "Username is already exist" };
  }

  // * store users

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  if (!user) return { error: `No User With ID ${id}!` };
  return user;
};

const getUsersInRoom = (room) => {
  const usersInSameRoom = users.filter((user) => user.room === room);
  if (!usersInSameRoom.length) return `No Users In Room ${room}!`;
  return usersInSameRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
