const mongoose = require("mongoose");
var Table = require("../models/TableModels");
var Staff = require("../models/StaffModel");
var History = require("../models/HistoryModels");
const Menu = require("../models/MenuModel");
const DefaultTableModel = require("../models/DefaultTableModel");
const Event = require("../models/clients/Event");

var {
  handleResponseField,
  handleResponseMenu,
  handleResponseBestSeller,
} = require("../util/ResponseField");
var { EmitToClient } = require("../util/SelectEmitData");

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
    point: e.point,
    feedback: e.feedback,
  }));
  return result;
};

//HANDLE GET ALL DATA TABLE

const controllerStaff = (socket, io) => {
  //WHEN CLIENT CONNECT SERVER => SEND DATA
  socket.on("login", (roleUser) => {
    if (roleUser.position !== "Client") {
      socket.join("SERVICEROOM");
      socket.room = "SERVICEROOM";
    } else {
      socket.join("CLIENTROOM");
      socket.room = "CLIENTROOM";
    }
    console.log(socket.adapter.rooms);
    console.log(socket.room);

    if (socket.room === "SERVICEROOM") {
      EmitToClient((dataResponse) => {
        socket.emit("data-manage-tables", dataResponse);
      }, Table);
      EmitToClient((dataResponse) => {
        socket.emit("the-list-table", dataResponse);
      }, DefaultTableModel);
      EmitToClient(
        (dataResponse) => {
          socket.emit("the-list-menu", dataResponse);
        },
        Menu,
        handleResponseMenu
      );
      if (roleUser.position === "Admin") {
        EmitToClient(
          (dataResponse) => {
            socket.emit("data-management", dataResponse);
          },
          History,
          handleResponseField
        );
        EmitToClient(
          (dataResponse) => {
            socket.emit("data-business", dataResponse);
          },
          History,
          handleResponseBestSeller
        );
        EmitToClient(
          (dataResponse) => {
            socket.emit("data-staff", dataResponse);
          },
          Staff,
          handleFieldResponseAllStaff
        );
      }
    } else {
      EmitToClient((dataResponse) => {
        socket.emit("event-for-client", dataResponse);
      }, Event);
      EmitToClient((dataResponse) => {
        socket.emit("the-list-menu", dataResponse);
      }, Menu);
      //GET TABLE CLIENT
      Table.findOneAndUpdate(
        { client: roleUser.userID },
        { socketID: roleUser.socketID },
        { new: true }
      )
        .exec()
        .then((data) => {
          EmitToClient((responseData) => {
            io.to("SERVICEROOM").emit("data-manage-tables", responseData);
          }, Table);
          socket.emit("table-client", data);
        });
    }
  });
  //STAFF PUSH MENU TO CHEF

  socket.on("push-to-chef", (objTable) => {
    console.log(
      "🚀 ~ file: SocketStaff.js ~ line 108 ~ socket.on ~ objTable",
      objTable
    );
    if (!objTable.IDTable) {
      // if (objTable.roleUser !== "Client") {
      //   socket.emit("notification-message-service", {
      //     type: "error",
      //     title: "Error",
      //     description: "ID Table not found",
      //   });
      // } else {
      //   socket.emit("notification-message-client", {
      //     type: "error",
      //     title: "Error",
      //     description: "ID Table not found, you need call manager",
      //   });
      // }
      return;
    }
    const query = { id: objTable.IDTable };
    Table.findOneAndUpdate(query, { isMakeFood: true }, { new: true })
      .exec()
      .then((data) => {
        if (data) {
          // if (objTable.roleUser !== "Client") {
          //   socket.emit("notification-message-service", "ID Table not found");
          // } else {
          //   socket.emit(
          //     "notification-message-client",
          //     "ID Table not found, you need call manager"
          //   );
          // }
        } else {
          return;
        }
        EmitToClient((dataResponse) => {
          io.in("SERVICEROOM").emit("data-manage-tables", dataResponse);
        }, Table);
        if (objTable.roleUser !== "Client") {
          io.to(data.socketID).emit("table-client", data);
        } else {
          socket.emit("table-client", data);
        }
      })
      .catch((error) => {
        res
          .status(400)
          .send({ error: error, message: "Fail send menu to chef" });
      });
  });

  //CLIENT ADD MENU OF TABLE

  socket.on("add-menu", (objTable) => {
    console.log(
      "🚀 ~ file: SocketStaff.js ~ line 132 ~ socket.on ~ objTable",
      objTable
    );
    if (!objTable || !objTable?.id) {
      // if (objTable.roleUser !== "Client") {
      //   socket.emit("notification-message-service", {
      //     type: "error",
      //     title: "Error",
      //     description: " Adding the food failed, ID Table not found",
      //   });
      // } else {
      //   socket.emit("notification-message-client", {
      //     type: "error",
      //     title: "Error",
      //     description: "Adding food failed, you need call manager",
      //   });
      // }
      return;
    }
    const query = { id: objTable.id };

    Table.findOne(query)
      .exec()
      .then((table) => {
        if (!table) return;
        let listFood = [];
        let totalCost = [];

        const isHadFood = table.menu?.some((e) => e.id === objTable.food?.id);
        if (isHadFood) {
          table.menu?.map((e) => {
            // find a food have had in list menu
            if (e.id === objTable.food?.id) {
              // if it have had in menu, sum total and count
              let count = e.count + objTable.food?.count;
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
            console.log(
              "🚀 ~ file: SocketStaff.js ~ line 169 ~ .then ~ data",
              data
            );
            if (data) {
              // if (objTable.roleUser !== "Client") {
              //   socket.emit("notification-message-service", {
              //     type: "success",
              //     title: "Success",
              //     description: "Add food successfully",
              //   });
              // } else {
              //   socket.emit("notification-message-client", {
              //     type: "success",
              //     title: "Success",
              //     description: "Add food successfully",
              //   });
              // }
            } else {
              return;
            }
            EmitToClient((dataResponse) => {
              io.in("SERVICEROOM").emit("data-manage-tables", dataResponse);
            }, Table);
            if (objTable.roleUser !== "Client") {
              io.to(data.socketID).emit("table-client", data);
            } else {
              socket.emit("table-client", data);
            }
          })
          .catch((error) => {
            res.status(400).send({ error: error, message: "fail add menu" });
          });
      });
  });

  // WHEN CLIENT REMOVE FOOD OF TABLE, SERVER SEND NEW LIST DATA

  socket.on("remove-menu", (objTable) => {
    if (!objTable.id) return;
    const query = { id: objTable.id };
    Table.findOne(query)
      .exec()
      .then((table) => {
        let totalCost = [];
        let totalBill = 0;
        table.menu = table.menu.filter((e) => e.id !== objTable.food?.id);
        totalCost = table.menu.map((e) => e.total);
        totalBill = totalCost.reduce((a, b) => a + b, 0);
        Table.findOneAndUpdate(
          query,
          { menu: table.menu, total_cost: totalBill },
          { new: true }
        )
          .exec()
          .then((data) => {
            if (!data) return;
            EmitToClient((dataResponse) => {
              io.in("SERVICEROOM").emit("data-manage-tables", dataResponse);
            }, Table);
            if (objTable.roleUser !== "Client") {
              io.to(data.socketID).emit("table-client", data);
            } else {
              socket.emit("table-client", data);
            }
          })
          .catch((error) => {
            res.status(400).send({ error: error, message: "fail remove menu" });
          });
      });
  });

  //WHEN CLIENT PAYBILL OF THE TABLE, SERVER SEND NEW LIST DATA

  socket.on("pay-bill", (objTable) => {
    console.log(
      "🚀 ~ file: SocketStaff.js ~ line 293 ~ socket.on ~ objTable",
      objTable
    );
    if (!objTable.id) return;
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
        EmitToClient(
          (dataResponse) => {
            io.in("SERVICEROOM").emit("data-management", dataResponse);
          },
          History,
          handleResponseField
        );
        Staff.findOne({ id: table.client })
          .exec()
          .then((data) => {
            if (!data) return;
            Staff.findOneAndUpdate(
              { id: table.client },
              { point: Number(table.total_cost) + Number(data.point) },
              { new: true }
            )
              .exec()
              .then((user) => {
                console.log(
                  "🚀 ~ file: SocketStaff.js ~ line 328 ~ .then ~ user",
                  user
                );
                if (!user) return;
                io.to(objTable.socketID).emit("info-user", user);
              });
          });
      });

    Table.findOneAndDelete(query)
      .exec()
      .then((data) => {
        EmitToClient((dataResponse) => {
          io.in("SERVICEROOM").emit("data-manage-tables", dataResponse);
        }, Table);
        const dataEmpty = null;
        io.to(data.socketID).emit("table-client", dataEmpty);
      });
  });

  //WHEN CLIENT ADD TABLE SERVER SEND NEW LIST DATA

  socket.on("add-table", async (initialTableClient) => {
    const table = new Table(initialTableClient);
    try {
      if (!(await Table.exists({ id: initialTableClient.id }))) {
        await table.save();
        EmitToClient((dataResponse) => {
          io.in("SERVICEROOM").emit("data-manage-tables", dataResponse);
        }, Table);
        if (initialTableClient.roleUser === "Client") {
          EmitToClient(
            (dataResponse) => {
              if (dataResponse.length === 1) {
                socket.emit("table-client", ...dataResponse);
              }
            },
            Table,
            null,
            { name: initialTableClient.name }
          );
        }
      }
    } catch (error) {
      console.log("error");
    }
  });

  socket.on("client-pay-bill", (IDTable) => {
    if (!IDTable) return;
    Table.findOneAndUpdate(
      { id: IDTable },
      { isPay: true, payedAt: new Date() },
      { new: true }
    )
      .exec()
      .then((data) => {
        if (!data) return;
        EmitToClient((dataResponse) => {
          io.in("SERVICEROOM").emit("data-manage-tables", dataResponse);
        }, Table);
        socket.emit("table-client", data);
      })
      .catch((error) => {
        res.status(400).send({ error: error, message: "Pay bill failed" });
      });
  });

  socket.on("make-food", async (objFoodOfTable) => {
    const chef = {
      name: objFoodOfTable.chef.name,
      position: objFoodOfTable.chef.position,
      avatar: objFoodOfTable.chef.avatar,
    };

    const handleStatus = (itemFood) => {
      return itemFood.chef.name === chef.name
        ? "Done"
        : objFoodOfTable.statusFood;
    };

    const query = { id: objFoodOfTable.id };
    Table.findOne(query)
      .exec()
      .then((table) => {
        if (!table) return;

        const listMenu = table.menu.map((e) =>
          e.id === objFoodOfTable.food
            ? { ...e, chef: chef, status: handleStatus(e) }
            : e
        );
        Table.findOneAndUpdate(query, { menu: listMenu }, { new: true })
          .exec()
          .then((data) => {
            EmitToClient((responseData) => {
              io.in(socket.room).emit("data-manage-tables", responseData);
            }, Table);
            io.to(data.socketID).emit("table-client", data);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  });

  socket.on("client-feedback", (objFeedBack) => {
    if (!objFeedBack.IDUser) return;
    Staff.findOne({ id: objFeedBack.IDUser })
      .exec()
      .then((user) => {
        const isExits = user.feedback[objFeedBack.type].some(
          (e) => e.id === objFeedBack.dataFeedBack.id
        );
        let feedback = {};
        //IF IT HAS EXITS, REMOVE ELSE ADD
        if (isExits) {
          const oneTypeOfFeedBack = user.feedback[objFeedBack.type].filter(
            (e) => e.id !== objFeedBack.dataFeedBack.id
          );
          feedback = {
            ...user.feedback,
            [objFeedBack.type]: oneTypeOfFeedBack,
          };
        } else {
          feedback = {
            ...user.feedback,
            [objFeedBack.type]: [
              ...user.feedback[objFeedBack.type],
              objFeedBack.dataFeedBack,
            ],
          };
        }

        Staff.findOneAndUpdate(
          { id: objFeedBack.IDUser },
          { feedback: feedback },
          { new: true }
        )
          .exec()
          .then((data) => {
            if (data) {
              EmitToClient(
                (dataResponse) => {
                  socket.emit("client-information", ...dataResponse);
                },
                Staff,
                handleFieldResponseAllStaff,
                { id: data.id }
              );
            }
            Menu.findOne({ id: objFeedBack.IDFood })
              .exec()
              .then((menu) => {
                if (menu) {
                  const countOneOfFeedBack = isExits
                    ? menu.feedback[objFeedBack.type] - 1
                    : menu.feedback[objFeedBack.type] + 1;
                  Menu.findOneAndUpdate(
                    { id: objFeedBack.IDFood },
                    {
                      feedback: {
                        ...menu.feedback,
                        [objFeedBack.type]: countOneOfFeedBack,
                      },
                    },
                    { new: true }
                  )
                    .exec()
                    .then((data) => {
                      EmitToClient((dataResponse) => {
                        socket.emit("the-list-menu", dataResponse);
                      }, Menu);
                    });
                }
              });
          })
          .catch((error) => {
            res.status(400).send({ error: error, message: "Pay bill failed" });
          });
      });
  });

  //GET ALL DATA MANAGEMENT
  socket.on("get-all-data-management", () => {
    EmitToClient(
      (responseData) => {
        io.in("SERVICEROOM").emit("data-management", responseData);
      },
      History,
      handleResponseField
    );
  });

  //GET ALL STAFF
  socket.on("get-all-staff", () => {
    EmitToClient(
      (responseData) => {
        io.in("SERVICEROOM").emit("data-staff", responseData);
      },
      Staff,
      handleFieldResponseAllStaff
    );
  });

  //GET ALL TABLE
  socket.on("get-all-table", () => {
    EmitToClient((dataResponse) => {
      io.in("SERVICEROOM").emit("the-list-table", dataResponse);
    }, DefaultTableModel);
  });

  //GET ALL MENU
  socket.on("get-all-menu", () => {
    console.log("get all menu");
    EmitToClient(
      (responseData) => {
        io.in("SERVICEROOM").emit("the-list-menu", responseData);
      },
      Menu,
      handleResponseMenu
    );
    EmitToClient((responseData) => {
      io.in("CLIENTROOM").emit("the-list-menu", responseData);
    }, Menu);
  });

  //GET PROFILE CLIENT

  socket.on("get-profile-client", (IDClient) => {
    Staff.findOne({ id: IDClient })
      .exec()
      .then((data) => {
        if (!data) return;
        EmitToClient(
          (dataResponse) => {
            socket.emit("client-information", ...dataResponse);
          },
          Staff,
          handleFieldResponseAllStaff,
          { id: data.id }
        );
        // socket.emit("client-information", data);
      });
  });
};

module.exports = controllerStaff;
