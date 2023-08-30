const isTokenIncluded = (req) => {
  return !req.headers.authorization ? false : true;
};

const getAccessTokenFromHeader = (req) => {
  return req.headers.authorization;
};
module.exports = { isTokenIncluded, getAccessTokenFromHeader };
