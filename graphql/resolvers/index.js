const eventsResolver = require("./events");
const bookingsResolver = require("./bookings");
const usersResolver = require("./users");

const rootResolver = {
  ...eventsResolver,
  ...bookingsResolver,
  ...usersResolver,
};

module.exports = rootResolver;
