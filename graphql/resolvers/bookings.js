const Booking = require("../../models/booking");
const { getUser, getOneEvent } = require("./dataLoaders");
const dateConverter = require("./dateConverter");

const transformBooking = (booking) => {
  //receives booking doc and returns populated booking object
  return {
    ...booking._doc,
    user: () => getUser(booking.user),
    event: () => getOneEvent(booking.event),
    createdAt: dateConverter(booking.createdAt),
    updatedAt: dateConverter(booking.updatedAt),
  };
};

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }
    try {
      const queryArray = await Booking.find({ user: req.userId });
      const bookingsArray = queryArray.map((booking) => {
        return transformBooking(booking);
      });
      return bookingsArray;
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }
    try {
      const booking = new Booking({
        event: args.eventId,
        user: req.userId,
      });
      const savedBooking = await booking.save();
      return transformBooking(savedBooking);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }
    try {
      const booking = await Booking.findById(args.bookingId);
      await Booking.deleteOne({ _id: args.bookingId });
      const event = getOneEvent(booking.event);
      return event;
    } catch (err) {
      throw err;
    }
  },
};
