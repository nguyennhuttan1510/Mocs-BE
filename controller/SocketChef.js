var Table = require("../models/TableModels");
var Staff = require("../models/StaffModel");
var History = require("../models/HistoryModels");

const handleFieldResponseAllStaff = (Staff) => {
  const result = Staff.map((e) => ({
    id: e.id,
    name: e.name,
    avatar: e.avatar,
    position: e.position,
  }));
  return result;
};

//HANDLE GET ALL DATA TABLE

const controllerChef = (socket, io) => {
  const handleGetAll = (model, event_name, fieldResponse) => {
    model
      .find()
      .exec()
      .then((listTable) => {
        let result;
        if (!fieldResponse) {
          result = listTable;
        } else {
          result = fieldResponse(listTable);
        }
        io.sockets.emit(event_name, result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ error: err });
      });
  };

  //WHEN CLIENT CONNECT SERVER => SEND DATA

  socket.on("make-food", async (objFoodofTable) => {
    const chef = {
      name: objFoodofTable.chef.name,
      position: objFoodofTable.chef.position,
      avatar: objFoodofTable.chef.avatar,
    };

    const handleStatus = (itemFood) => {
      return itemFood.chef.name === chef.name
        ? "Done"
        : objFoodofTable.statusFood;
    };

    const status = objFoodofTable.statusFood;
    const query = { id: objFoodofTable.id };
    Table.findOne(query)
      .exec()
      .then((table) => {
        if (!table) return;

        const listMenu = table.menu.map((e) =>
          e.id === objFoodofTable.food
            ? { ...e, chef: chef, status: handleStatus(e) }
            : e
        );
        console.log(listMenu);
        Table.findOneAndUpdate(query, { menu: listMenu }, { new: true })
          .exec()
          .then((data) => {
            handleGetAll(Table, "data-table");
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });
};

module.exports = controllerChef;
