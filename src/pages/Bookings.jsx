import React, { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import BookingModal from "../components/BookingModal";
import moment from "moment";
import "bulma/css/bulma.min.css";

const Bookings = () => {
  const [bookingData, setBookingData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);
  const token = localStorage.getItem("awesomeLeadsToken");

  const handleUpdate = (bookingId) => {
    setId(bookingId);
    setActiveModal(true);
  };

  const handleDelete = async (bookingId) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const response = await fetch(
        `https://shaqc-admin-backend.onrender.com/bookings/${bookingId}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      getBookings();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const getBookings = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const response = await fetch(
        "https://shaqc-admin-backend.onrender.com/bookings",
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Something went wrong. Couldn't load the bookings");
      }

      const data = await response.json();
      setBookingData(data);
      setLoaded(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getBookings();
    setId(null);
  };

  const bookingToUpdate = bookingData ? bookingData.find(booking => booking.bookingId === id) : null;

  return (
    <div className="mx-4 overflow-scroll">
      <BookingModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        id={id}
        setErrorMessage={setErrorMessage}
        bookingData={bookingToUpdate}
      />
      <button
        className="button is-fullwidth mb-5 is-primary"
        onClick={() => {
          setId(null);
          setActiveModal(true);
        }}
      >
        Create Booking
      </button>
      <ErrorMessage message={errorMessage} />
      {loaded && bookingData ? (
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Service Type</th>
              <th>Date & Time</th>
              <th>List of Swimmers</th>
              <th>Total Cost</th>
              <th>User ID</th> {/* Added column for User ID */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookingData.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{booking.bookingServiceType}</td>
                <td>{moment(booking.dateTime).format("MMMM Do YYYY, h:mm:ss a")}</td>
                <td>
                  <ul>
                    {booking.listOfSwimmers && booking.listOfSwimmers.map((swimmer, index) => (
                      <li key={index}>{swimmer}</li>
                    ))}
                  </ul>
                </td>
                <td>{booking.totalCost}</td>
                <td>{booking.userId}</td> {/* Display User ID */}
                <td className="grid grid-cols-2">
                  <button
                    className="button mr-2 is-info is-light"
                    onClick={() => handleUpdate(booking.bookingId)}
                  >
                    Update
                  </button>
                  <button
                    className="button mr-2 is-danger is-light"
                    onClick={() => handleDelete(booking.bookingId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Bookings;
