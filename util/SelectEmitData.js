exports.EmitToClient = function (method, model, fieldResponse, query) {
  model
    .find(query ? query : null)
    .exec()
    .then(async (data) => {
      let result;
      if (!fieldResponse) {
        result = data;
      } else {
        result = await fieldResponse(data);
      }
      method(result);
    })
    .catch((err) => {
      console.log(err);
      //   res.status(400).send({ error: err });
    });
};

// exports.handleResponseErrorToClient = (hasError, method) =>{

// }
