import { useState, useContext, useRef, useEffect } from "react";
import { useHistory } from "react-router";
import EventsList from "../Components/EventsList";
import Modal from "../Components/Modal";
import { AuthContext } from "../Context/AuthContext";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { authValues } = useContext(AuthContext);
  const history = useHistory();

  const titleRef = useRef();
  const priceRef = useRef();
  const dateRef = useRef();
  const descriptionRef = useRef();

  useEffect(() => {
    const fetchEvents = async () => {
      const requestBody = {
        query: `
          query {
            events {
              _id
              title
              description
              price
              date
              createdBy {
                _id
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
          },
        });
        const responseJson = await response.json();
        const fetchedEvents = responseJson.data.events;
        setEvents(fetchedEvents);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvents();
  }, []);

  const createEventHandler = async () => {
    const title = titleRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const description = descriptionRef.current.value;
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    )
      return;
    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!){
          createEvent(eventInput: {title: $title price: $price date: $date description: $description}) {
            _id
            title
            description
            price
            date
            createdBy {
              _id
            }
          }
        }
      `,
      variables: {
        title,
        price,
        date,
        description,
      },
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
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed request");
      }
      const responseJson = await response.json();
      const newEvent = responseJson.data.createEvent;
      setEvents([...events, newEvent]);
      setModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const hideModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const viewDetailsHandler = (clickedEventId) => {
    const selectedEvent = events.find((event) => event._id === clickedEventId);
    setSelectedEvent(selectedEvent);
  };

  const bookEventHandler = async () => {
    if (!authValues.token) {
      history.push("/auth");
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($eventId: ID!){
          bookEvent(eventId: $eventId) {
            _id
          }
        }
      `,
      variables: {
        eventId: selectedEvent._id,
      },
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
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed request");
      }
      // const responseJson = await response.json();
      setSelectedEvent(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          title="Create an event"
          onCancel={() => setModalOpen(false)}
          onConfirm={createEventHandler}
          canConfirm={true}
          actionBtnText="Confirm"
        >
          <form className="create-event-form">
            <div className="create-event-form-control">
              <label htmlFor="create-event-title">Title</label>
              <input id="create-event-title" ref={titleRef}></input>
            </div>
            <div className="create-event-form-control">
              <label htmlFor="create-event-price">Price</label>
              <input
                id="create-event-price"
                type="number"
                ref={priceRef}
              ></input>
            </div>
            <div className="create-event-form-control">
              <label htmlFor="create-event-date">Date</label>
              <input id="create-event-date" type="date" ref={dateRef}></input>
            </div>
            <div className="create-event-form-control">
              <label htmlFor="create-event-description">Description</label>
              <textarea
                id="create-event-description"
                rows={4}
                ref={descriptionRef}
              ></textarea>
            </div>
          </form>
        </Modal>
      )}
      {authValues.token && (
        <div className="create-event-container">
          <p>Share your own events</p>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            Create an event
          </button>
        </div>
      )}
      {selectedEvent && (
        <Modal
          title="Event details"
          onCancel={hideModal}
          onConfirm={bookEventHandler}
          canConfirm={
            authValues.userId !== null &&
            selectedEvent.createdBy._id !== authValues.userId
          }
          actionBtnText="Book this event"
        >
          <div className="event-details">
            <h1>{selectedEvent.title}</h1>
            <h2>£{selectedEvent.price.toFixed(2)}</h2>
            <p>{selectedEvent.date.substr(0, selectedEvent.date.length - 3)}</p>
            <p>{selectedEvent.description}</p>
          </div>
        </Modal>
      )}
      <EventsList
        events={events}
        userId={authValues.userId}
        showDetailsModal={viewDetailsHandler}
      />
    </>
  );
};

export default Events;
