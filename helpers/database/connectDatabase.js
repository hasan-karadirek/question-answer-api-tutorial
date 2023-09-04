const mongoose = require('mongoose');
const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => {
      return true;
    })
    .catch(() => {
      console.error(err);
    });
};

module.exports = connectDatabase;
