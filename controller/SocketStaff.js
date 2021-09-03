var Table = require("../models/TableModels");
var Staff = require("../models/StaffModel");
var History = require("../models/HistoryModels");
var Menu = require("../models/MenuModel");

var { handleResponseField } = require("../util/ResponseField");
var { handleGetAll } = require("../util/GetAllData");

const mongoose = require("mongoose");

const handleFieldResponseAllStaff = (Staff) => {
  const result = Staff.map((e) => ({
    id: e.id,
    name: e.name,
    avatar: e.avatar,
    position: e.position,
    phone: e.phone,
    createdAt: e.createdAt,
    username: e.username,
    salary: e.salary,
    bonus: e.bonus,
  }));
  return result;
};

//HANDLE GET ALL DATA TABLE

const controllerStaff = (socket, io) => {
  //WHEN CLIENT CONNECT SERVER => SEND DATA
  handleGetAll(io, Table, "data-table");

  //SNED DATA STAFF
  handleGetAll(io, Staff, "data-staff", handleFieldResponseAllStaff);

  //DELETE STAFF
  socket.on("get-all-staff", () => {
    handleGetAll(io, Staff, "data-staff", handleFieldResponseAllStaff);
  });

  //ADD STAFF

  // socket.on("add-staff", async (objStaff) => {
  //   let maxIdStaff = 0;
  //   await Staff.find()
  //     .exec()
  //     .then((data) => {
  //       const idStaff = data.map((e) => e.id);
  //       return (maxIdStaff = Math.max(...idStaff) + 1);
  //     });
  //   const initStaff = {
  //     id: objStaff?.id || maxIdStaff,
  //     name: objStaff?.name,
  //     username: objStaff?.username,
  //     password: objStaff?.password || "123456",
  //     phone: objStaff?.phone || "",
  //     position: objStaff.position,
  //     avatar: objStaff?.path || "",
  //   };
  //   const staff = new Staff(initStaff);
  //   try {
  //     Staff.findOne({ username: objStaff.username })
  //       .exec()
  //       .then(async (objStaff) => {
  //         if (objStaff) {
  //           // res.send({
  //           //   status: false,
  //           //   message: "username has created, please use username other",
  //           //   data: [],
  //           // });
  //           const response = {
  //             message: " Create Staff is failed",
  //             status: false,
  //           };
  //           socket.emit("notification-created-staff", response);
  //           return;
  //         }
  //         await staff.save();
  //         const response = {
  //           message: " Staff has created successfully",
  //           status: true,
  //         };
  //         socket.emit("notification-created-staff", response);
  //         handleGetAll(io, Staff, "data-staff", handleFieldResponseAllStaff);

  //         // res.send({
  //         //   status: true,
  //         //   message: "added Staff successfully",
  //         //   data: staff,
  //         // });
  //       });
  //   } catch (error) {
  //     // res.status(500).send({ error: err });
  //   }
  // });

  //STAFF PUSH MENU TO CHEF

  socket.on("push-to-chef", async (foodOfTable) => {
    const query = { id: foodOfTable.id };
    Table.findOneAndUpdate(query, { isMakeFood: true }, { new: true })
      .exec()
      .then((data) => {
        handleGetAll(io, Table, "data-table");
      })
      .catch((error) => {
        res
          .status(400)
          .send({ error: error, message: "fail send menu to chef" });
      });
  });

  //CLIENT ADD MENU OF TABLE

  socket.on("add-menu", async (objTable) => {
    console.log(objTable);
    if (!objTable) return;
    const query = { id: objTable.id };
    Table.findOne(query)
      .exec()
      .then((table) => {
        let listFood = [];
        let totalCost = [];
        const isHadFood = table.menu?.some((e) => e.id === objTable.food?.id);
        if (isHadFood) {
          table.menu?.map((e) => {
            // find a food have had in list menu
            if (e.id === objTable.food?.id) {
              // if it have had in menu, sum total and count
              let count = e.count + 1;
              let total = (e.price * count * (100 - e.discount)) / 100;
              const item = { ...e, total: total, count: count };
              listFood.push(item);
            } else {
              listFood.push(e); // else keep it real
            }
          });
        } else {
          listFood = [...table.menu, objTable.food];
        }
        totalCost = listFood.map((e) => e.total);
        const totalBill = totalCost.reduce((a, b) => a + b);
        Table.findOneAndUpdate(
          query,
          { menu: listFood, total_cost: totalBill },
          { new: true }
        )
          .exec()
          .then((data) => {
            handleGetAll(io, Table, "data-table");
          })
          .catch((error) => {
            res.status(400).send({ error: error, message: "fail add menu" });
          });
      });
  });

  // WHEN CLIENT REMOVE FOOD OF TABLE, SERVER SEND NEW LIST DATA

  socket.on("remove-menu", async (objTable) => {
    const query = { id: objTable.id };
    Table.findOne(query)
      .exec()
      .then((table) => {
        table.menu = table.menu.filter((e) => e.id !== objTable.food?.id);
        Table.findOneAndUpdate(query, { menu: table.menu }, { new: true })
          .exec()
          .then((data) => {
            handleGetAll(io, Table, "data-table");
          })
          .catch((error) => {
            res.status(400).send({ error: error, message: "fail remove menu" });
          });
      });
  });

  //WHEN CLIENT PAYBILL OF THE TABLE, SERVER SEND NEW LIST DATA

  socket.on("pay-bill", async (objTable) => {
    const query = { id: objTable.id };

    Table.findOne(query)
      .exec()
      .then(async (table) => {
        const initHistory = {
          id: new mongoose.Types.ObjectId(),
          name: table.name,
          menu: table.menu,
          server: objTable.server,
          total_cost: table.total_cost,
          createdAt: table.createdAt,
        };
        const history = new History(initHistory);
        await history.save();
        handleGetAll(io, History, "data-management", handleResponseField);
      });

    Table.findOneAndDelete(query)
      .exec()
      .then((doc) => {
        handleGetAll(io, Table, "data-table");
      });
  });

  //WHEN CLIENT ADD TABLE SERVER SEND NEW LIST DATA

  socket.on("add-table", async (data) => {
    const table = new Table(data);
    try {
      if (!(await Table.exists({ id: data.id }))) {
        await table.save();
        handleGetAll(io, Table, "data-table");
      }
    } catch (error) {
      // res
      //   .status(400)
      //   .send({ error: error, message: "don't send data to client" });
      console.log("error");
    }
  });
};

module.exports = controllerStaff;
