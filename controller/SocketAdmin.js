var History = require("../models/HistoryModels");
var Staff = require("../models/StaffModel");

var { handleGetAll } = require("../util/GetAllData");
var {
  handleResponseField,
  handleResponseBestSeller,
} = require("../util/ResponseField");

const controllerAdmin = (socket, io) => {
  handleGetAll(io, History, "data-management", handleResponseField);
  handleGetAll(io, History, "data-best-seller", handleResponseBestSeller);
  socket.on("get-data-management", () => {
    handleGetAll(io, History, "data-management", handleResponseField);
  });
};

module.exports = controllerAdmin;
