import BookingsListItem from "./BookingsListItem";

const BookingsList = ({ bookings, onCancel }) => {
  return (
    <ul className="bookings-list">
      {bookings.map((booking) => (
        <BookingsListItem
          key={booking._id}
          bookingId={booking._id}
          title={booking.event.title}
          date={booking.event.date}
          cancelBooking={onCancel}
        />
      ))}
    </ul>
  );
};

export default BookingsList;
