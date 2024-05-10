import React, { useEffect, useState } from "react";

const BookingModal = ({ active, handleModal, token, id, setErrorMessage, bookingData }) => {
  const [bookingServiceType, setBookingServiceType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [listOfSwimmers, setListOfSwimmers] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [userId, setUserId] = useState("");
  const [bookingId, setBookingId] = useState(""); // New state for bookingId

  useEffect(() => {
    if (!id || !bookingData) return;

    const { bookingServiceType, dateTime, listOfSwimmers, totalCost, userId, bookingId } = bookingData;
    setBookingServiceType(bookingServiceType);
    setDateTime(new Date(dateTime).toISOString().slice(0, 16));
    setListOfSwimmers(listOfSwimmers.join(", "));
    setTotalCost(totalCost);
    setUserId(userId);
    setBookingId(bookingId); // Set the bookingId from bookingData
  }, [id, bookingData]);

  const cleanFormData = () => {
    setBookingServiceType("");
    setDateTime("");
    setListOfSwimmers("");
    setTotalCost(0);
    setUserId("");
    // setBookingId(""); // Don't clear bookingId here
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!active) return; // Prevent form submission when modal is inactive

    const formattedSwimmers = listOfSwimmers.split(/\s*,\s*/);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        bookingServiceType,
        dateTime,
        listOfSwimmers: formattedSwimmers,
        stateOfSchedule: "UPCOMING",
        totalCost,
        userId
      }),
    };

    try {
      const response = await fetch("https://shaqc-admin-backend.onrender.com/bookings", requestOptions);
      if (!response.ok) {
        throw new Error("Something went wrong when creating booking");
      }

      const data = await response.json();
      console.log("Booking created with ID:", data.bookingId);

      cleanFormData();
      handleModal();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();

    if (!active) return; // Prevent form submission when modal is inactive

    const formattedSwimmers = listOfSwimmers.split(/\s*,\s*/);

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        bookingId, 
        bookingServiceType,
        dateTime,
        listOfSwimmers: formattedSwimmers,
        stateOfSchedule: "UPCOMING",
        totalCost,
        userId
      }),
    };

    try {
      const response = await fetch(`https://shaqc-admin-backend.onrender.com/bookings/${bookingId}`, requestOptions);
      if (!response.ok) {
        throw new Error("Something went wrong when updating booking");
      }

      handleModal();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDeleteBooking = async () => {
    if (!active) return; // Prevent form submission when modal is inactive

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const response = await fetch(`https://shaqc-admin-backend.onrender.com/bookings/${bookingId}`, requestOptions);
      if (!response.ok) {
        throw new Error("Something went wrong when deleting booking");
      }

      handleModal();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={`modal ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title">{id ? "Update Booking" : "Create Booking"}</h1>
        </header>
        <section className="modal-card-body">
          <form onSubmit={id && active ? handleUpdateBooking : handleCreateBooking}>
            <div className="field">
              <label className="label">Booking Service Type</label>
              <div className="control">
                <div className="select">
                  <select
                    value={bookingServiceType}
                    onChange={(e) => setBookingServiceType(e.target.value)}
                    required
                  >
                    <option value="">Select Booking Service Type</option>
                    <option value="POOL">POOL</option>
                    <option value="COACHING">COACHING</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Date Time</label>
              <div className="control">
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">List of Swimmers</label>
              <div className="control">
                <input
                  type="text"
                  value={listOfSwimmers}
                  onChange={(e) => setListOfSwimmers(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Total Cost</label>
              <div className="control">
                <input
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">User ID</label>
              <div className="control">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field is-grouped">
              <p className="control">
                <button className="button is-primary" type="submit" disabled={!active}>
                  {id ? "Update" : "Create"}
                </button>
              </p>
              <p className="control">
                <button className="button ml-2" onClick={handleModal}>
                  Cancel
                </button>
              </p>
              {id && (
                <p className="control">
                  <button className="button is-danger ml-2" onClick={handleDeleteBooking} disabled={!active}>
                    Delete
                  </button>
                </p>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default BookingModal;
