exports.createHttpError = (status) => {
  let msg;
  switch (status) {
    case 400: msg = "Bad request"; break;
    case 404: msg = "Not found"; break;
    default: msg = "Internal Server Error";
  }
  return { status, msg };
};

