const sendJwtToClient = (user, res) => {
  const { JWT_COOKIE } = process.env;
  const token = user.generateJwtFromUser();

  return res
    .status(200)
    .cookie('access_token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
      secure: false,
    })
    .json({
      success: true,
      access_token: token,
      data: { user: user.name, email: user.email },
    });
};
const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith('Bearer:')
  );
};

const getAccessTokenFromHeader = (req) => {
  return req.headers.authorization.split(':')[1];
};
module.exports = { sendJwtToClient, isTokenIncluded, getAccessTokenFromHeader };
