import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import BookingsList from "../Components/BookingsList";
import "./Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const { authValues } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      const requestBody = {
        query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
              }
            }
          }
        `,
      };
      try {
        const response = await fetch("/graphql", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authValues.token,
          },
        });
        const responseJson = await response.json();
        const fetchedBookings = responseJson.data.bookings;
        setBookings(fetchedBookings);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBookings();
  }, [authValues.token]);

  const cancelBookingHandler = async (canceledBookingId) => {
    const requestBody = {
      query: `
        mutation CancelBooking($bookingId: ID!) {
          cancelBooking (bookingId: $bookingId) {
            _id
            title
          }
        }
      `,
      variables: {
        bookingId: canceledBookingId,
      },
    };
    try {
      await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authValues.token,
        },
      });
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== canceledBookingId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bookings">
      <h1>Your bookings</h1>
      <BookingsList bookings={bookings} onCancel={cancelBookingHandler} />
    </div>
  );
};

export default Bookings;
