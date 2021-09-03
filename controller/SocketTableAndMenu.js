var Table = require("../models/TableModels");
var Staff = require("../models/StaffModel");
var History = require("../models/HistoryModels");
var Menu = require("../models/MenuModel");
var DefaultTable = require("../models/DefaultTableModel");

var { handleResponseMenu } = require("../util/responseField");
var { handleGetAll } = require("../util/getAllData");

const mongoose = require("mongoose");

const controllerDefault = (socket, io) => {
  //SEND MENU
  handleGetAll(io, Menu, "data-menu", handleResponseMenu);
  handleGetAll(io, DefaultTable, "data-default-table");

  socket.on("get-all-menu", () => {
    handleGetAll(io, Menu, "data-menu", handleResponseMenu);
  });

  socket.on("get-all-table", () => {
    handleGetAll(io, DefaultTable, "data-default-table");
  });
};

//====================================================

module.exports = controllerDefault;
