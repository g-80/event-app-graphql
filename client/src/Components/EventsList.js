import EventsListitem from "./EventsListItem";

const EventsList = ({ events, userId, showDetailsModal }) => {
  return (
    <ul className="events-list">
      {events.map((event) => (
        <EventsListitem
          key={event._id}
          eventId={event._id}
          title={event.title}
          price={event.price}
          date={event.date}
          createdById={event.createdBy._id}
          userId={userId}
          viewDetailsHandler={showDetailsModal}
        />
      ))}
    </ul>
  );
};

export default EventsList;
