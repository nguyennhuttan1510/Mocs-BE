var server = require("./www");
// var Table = require("../models/TableModels");
// var Staff = require("../models/Staff");
// var History = require("../models/HistoryModels");
var controllerStaff = require("../controller/SocketStaff");
var controllerChef = require("../controller/SocketChef");
var controllerAdmin = require("../controller/SocketAdmin");
var controllerTableAndMenu = require("../controller/SocketTableAndMenu");

//CONNECT MONGODB
const io = require("socket.io")(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH"],
  },
});

//CONNECT SOCKET IO

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
