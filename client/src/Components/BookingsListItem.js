const BookingsListItem = ({ bookingId, title, date, cancelBooking }) => {
  return (
    <li className="bookings-list-item">
      <div className="booking-details">
        <span className="booking-name">{title}</span>
        <span>Event's date: {date.substr(0, date.length - 3)}</span>
      </div>
      <button
        className="cancel-booking btn-primary"
        onClick={() => cancelBooking(bookingId)}
      >
        Cancel booking
      </button>
    </li>
  );
};

export default BookingsListItem;
