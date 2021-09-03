var server = require("./www");
require("dotenv").config();
var controllerStaff = require("../controller/SocketStaff");
var controllerChef = require("../controller/SocketChef");
var controllerAdmin = require("../controller/SocketAdmin");
var controllerTableAndMenu = require("../controller/SocketTableAndMenu");

//CONNECT SOCKET IO
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.HOST_CLIENT,
    methods: ["GET", "POST", "PUT", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} is connected`);

  controllerStaff(socket, io);
  controllerChef(socket, io);
  controllerAdmin(socket, io);
  controllerTableAndMenu(socket, io);

  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} is disconnected`);
  });
});
