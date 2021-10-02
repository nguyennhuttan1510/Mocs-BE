var Staff = require("../models/StaffModel");
var Menu = require("../models/MenuModel");
exports.handleResponseBestSeller = async (data) => {
  if (!data) return;
  let result = [];
  let listMenu = [];
  await Menu.find({})
    .exec()
    .then((menu) => {
      if (!menu) return;
      listMenu = menu;
    });
  result = listMenu?.map((menu) => {
    let countOfFood = 0;
    data.forEach((history) => {
      history.menu.forEach((item) => {
        if (menu.id == item.id) {
          countOfFood = countOfFood + item.count;
        }
      });
    });
    return { name_food: menu.name, count: countOfFood };
  });
  return result;
};

exports.handleResponseField = async (data) => {
  if (!data) return;
  let arrStaff = [];
  let result = [];
  await Staff.find({})
    .exec()
    .then((staff) => {
      arrStaff = staff.map((e) => ({
        username: e.username,
        avatar: e.avatar,
        phone: e.phone,
        name: e.name,
        salary: e.salary,
        bonus: e.bonus,
        position: e.position,
      }));
    });
  if (arrStaff.length !== 0) {
    let groupByStaff = arrStaff?.map((item) => {
      let total = 0;
      data.forEach((history) => {
        if (history.server.name === item.name) {
          total += history.total_cost;
        }
      });
      return {
        username: item.username,
        total_cost: total,
        avatar: item.avatar,
        phone: item.phone,
        name: item.name,
        salary: item.salary,
        bonus: item.bonus,
        position: item.position,
      };
    });
    result = [...groupByStaff];
  }
  return result;
};

exports.handleResponseMenu = async (data) => {
  if (!data) return;
  let result = [];
  const categoryFood = data.filter((e) => e.category === "food");
  const categoryDrink = data.filter((e) => e.category === "drink");
  const categoryOther = data.filter(
    (e) => e.category !== "drink" && e.category !== "food"
  );
  result = {
    menu_food: categoryFood,
    menu_drink: categoryDrink,
    other: categoryOther,
  };
  return result;
};
