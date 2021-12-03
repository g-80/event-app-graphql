const Event = require("../../models/event");
const User = require("../../models/user");
const dateConverter = require("./dateConverter");
const DataLoader = require("dataloader");

const userLoader = new DataLoader((usersIds) => {
  return User.find({ _id: { $in: usersIds } });
});

const transformEvent = (event) => {
  //receives event doc and returns populated event object
  return {
    ...event._doc,
    createdBy: () => userLoader.load(event.createdBy.toString()),
    date: dateConverter(event.date),
  };
};

const getEvents = async (eventsIds) => {
  try {
    const eventsQuery = await Event.find({ _id: { $in: eventsIds } });
    eventsQuery.sort((a, b) => {
      // sort array to match dataloader's array order
      return (
        eventsIds.indexOf(a._id.toString()) -
        eventsIds.indexOf(b._id.toString())
      );
    });
    return eventsQuery.map((event) => transformEvent(event));
  } catch (err) {
    throw err;
  }
};

const eventLoader = new DataLoader((eventsIds) => {
  return getEvents(eventsIds);
});

const getOneEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

const getUser = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

exports.getOneEvent = getOneEvent;
exports.getUser = getUser;
exports.transformEvent = transformEvent;
