const EventsListItem = ({
  eventId,
  title,
  price,
  date,
  createdById,
  userId,
  viewDetailsHandler,
}) => {
  return (
    <li className="events-list-item">
      <div className="event-item-data">
        <h1>{title}</h1>
        <h2>£{price.toFixed(2)}</h2>
        <span>{date.substr(0, date.length - 3)}</span>
        {createdById === userId && (
          <span className="event-user-owner">
            You're the owner of this event
          </span>
        )}
      </div>
      <div className="event-item-view-details">
        <button
          className="view-event-details btn-primary"
          onClick={() => viewDetailsHandler(eventId)}
        >
          View details
        </button>
      </div>
    </li>
  );
};

export default EventsListItem;
