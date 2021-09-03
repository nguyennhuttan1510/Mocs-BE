exports.handleGetAll = function (
  io,
  model,
  event_name,
  fieldResponse,
  orderBy
) {
  model
    .find(orderBy ? orderBy : null)
    .exec()
    .then(async (data) => {
      let result;
      if (!fieldResponse) {
        result = data;
      } else {
        result = await fieldResponse(data);
      }
      io.sockets.emit(event_name, result);
    })
    .catch((err) => {
      console.log(err);
      //   res.status(400).send({ error: err });
    });
};
