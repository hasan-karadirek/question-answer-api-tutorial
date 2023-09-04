const isTokenIncluded = (req) => {
  console.log(!req.headers.authorization, req.headers.authorization, 'hehes');
  return !req.headers.authorization ? false : true;
};

const getAccessTokenFromHeader = (req) => {
  return req.headers.authorization;
};
module.exports = { isTokenIncluded, getAccessTokenFromHeader };
