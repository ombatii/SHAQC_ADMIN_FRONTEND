// Parents.jsx
import React, { useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import ParentModal from "../components/ParentModal";
import "bulma/css/bulma.min.css";

const Parents = () => {
  const [parentData, setParentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);
  const token = localStorage.getItem("awesomeLeadsToken");

  const handleUpdate = (parentId) => {
    setId(parentId);
    setActiveModal(true);
  };

  const handleDelete = async (parentId) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const response = await fetch(
        `https://shaqc-admin-backend.onrender.com/parents/${parentId}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to delete parent");
      }

      getParent();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const getParent = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    try {
      const response = await fetch(
        "https://shaqc-admin-backend.onrender.com/parents",
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Something went wrong. Couldn't load the parents");
      }

      const data = await response.json();
      setParentData(data);
      setLoaded(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getParent();
  }, []);

  const handleModal = () => {
    setActiveModal(!activeModal);
    getParent();
    setId(null);
  };

  const parentToUpdate = parentData ? parentData.find(parent => parent.parentId === id) : null;

  return (
    <div className="mx-4 overflow-x-scroll">
      <ParentModal
        active={activeModal}
        handleModal={handleModal}
        token={token}
        id={id}
        setErrorMessage={setErrorMessage}
        parentData={parentToUpdate}
      />
      <button
        className="button  mb-5 is-primary w-full"
        onClick={() => {
          setId(null);
          setActiveModal(true);
        }}
      >
        Create Parent
      </button>
      <ErrorMessage message={errorMessage} />
      {loaded && parentData ? (
        <table className="table ">
          <thead>
            <tr>
              <th>Parent Id</th>
              <th>First Name</th>
              <th>Second Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Team</th>
              <th>Performance</th>
              <th>Children</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parentData.map((parent) => (
              <tr key={parent.parentId}>
                <td>{parent.parentId}</td>
                <td>{parent.firstName}</td>
                <td>{parent.secondName}</td>
                <td>{parent.phoneNumber}</td>
                <td>{parent.email}</td>
                <td>{parent.team}</td>
                <td>{parent.performance}</td>
                <td>
                  <ul>
                    {parent.children && parent.children.length > 0 ? (
                      parent.children.map((child, index) => (
                        <li key={index}>
                          Name: {child.name}, Age: {child.age}
                        </li>
                      ))
                    ) : (
                      <li>No children</li>
                    )}
                  </ul>
                </td>
                <td className="grid grid-cols-2">
                  <button
                    className="button mr-2 is-info is-light"
                    onClick={() => handleUpdate(parent.parentId)}
                  >
                    Update
                  </button>
                  <button
                    className="button mr-2 is-danger is-light"
                    onClick={() => handleDelete(parent.parentId)}
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

export default Parents;
