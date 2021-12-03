const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./dataLoaders");

module.exports = {
  events: async () => {
    try {
      const queryArray = await Event.find();
      const eventsArray = queryArray.map((event) => {
        return transformEvent(event);
      });
      return eventsArray;
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthorized");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      createdBy: req.userId,
    });

    try {
      const createdEvent = await event.save();
      const eventCreator = await User.findById(req.userId);
      eventCreator.createdEvents.push(event);
      await eventCreator.save();
      return transformEvent(createdEvent);
    } catch (err) {
      throw err;
    }
  },
};
