import React, { useEffect, useState } from "react";

const ParentModal = ({ active, handleModal, token, id, setErrorMessage, parentData }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("Mombasa Rd"); // Set default team value
  const [performance, setPerformance] = useState(0);
  const [children, setChildren] = useState([{ name: "", age: 0 }]); // Set default age value
  const [teamOptions] = useState([
    "Mombasa Rd",
    "Kiambu Rd",
    "Lang’ata Rd",
    "Ngong Rd",
  ]);

  useEffect(() => {
    if (!id || !parentData) return;

    setFirstName(parentData.firstName);
    setLastName(parentData.secondName); // Update to secondName
    setPhoneNumber(parentData.phoneNumber);
    setEmail(parentData.email);
    setTeam(parentData.team);
    setPerformance(parentData.performance);
    setChildren(parentData.children);
  }, [id, parentData]);

  const cleanFormData = () => {
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setEmail("");
    setTeam("Mombasa Rd"); // Reset team value to default
    setPerformance(0);
    setChildren([{ name: "", age: 0 }]); // Reset age value to default
  };

  const handleCreateParent = async (e) => {
    e.preventDefault();

    const formattedChildren = children.map((child) => ({
      name: child.name || "",
      age: child.age || 0, // Ensure age is set to 0 if not provided
    }));

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        firstName,
        secondName: lastName, // Update to secondName
        email,
        phoneNumber,
        team,
        performance,
        children: formattedChildren,
      }),
    };

    try {
      const response = await fetch("https://shaqc-admin-backend.onrender.com/parents", requestOptions);
      if (!response.ok) {
        throw new Error("Something went wrong when creating parent");
      }

      const data = await response.json();
      const generatedId = data.parentId; 
      console.log("Auto-generated ID:", generatedId);

      cleanFormData();
      handleModal();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleUpdateParent = async (e) => {
    e.preventDefault();

    const formattedChildren = children.map((child) => ({
      name: child.name || "",
      age: parseInt(child.age) || 0,
    }));

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        firstName,
        secondName: lastName,
        email,
        phoneNumber,
        team,
        performance,
        children: formattedChildren,
      }),
    };

    try {
      const response = await fetch(`https://shaqc-admin-backend.onrender.com/parents/${id}`, requestOptions);
      if (!response.ok) {
        throw new Error("Something went wrong when updating parent");
      }

      cleanFormData();
      handleModal();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setChildren(updatedChildren);
  };

  const handleAddChild = () => {
    setChildren([...children, { name: "", age: "" }]);
  };

  const handleRemoveChild = (index) => {
    const updatedChildren = [...children];
    updatedChildren.splice(index, 1);
    setChildren(updatedChildren);
  };

  return (
    <div className={`modal ${active && "is-active"} md:w-6/7 `}>
      <div className="modal-background" onClick={handleModal}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-primary-light">
          <h1 className="modal-card-title text-black">{id ? "Update Parent" : "Create Parent"}</h1>
        </header>
        <section className="modal-card-body">
          <form>
            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Last Name</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Phone Number</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Team</label>
              <div className="control">
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="select"
                >
                  {teamOptions.map((teamOption, index) => (
                    <option key={index} value={teamOption}>
                      {teamOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label className="label">Performance</label>
              <div className="control">
                <input
                  type="number"
                  placeholder="Performance"
                  value={performance}
                  onChange={(e) => setPerformance(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Children</label>
              <div className="control">
                {children.map((child, index) => (
                  <div key={index} className="field has-addons">
                    <p className="control">
                      <input
                        type="text"
                        placeholder="Name"
                        value={child.name}
                        onChange={(e) => handleChildChange(index, "name", e.target.value)}
                        className="input"
                      />
                    </p>
                    <p className="control">
                      <input
                        type="number"
                        placeholder="Age"
                        value={child.age}
                        onChange={(e) => handleChildChange(index, "age", e.target.value)}
                        className="input"
                      />
                    </p>
                    <p className="control">
                      <button
                        type="button"
                        className="button is-danger"
                        onClick={() => handleRemoveChild(index)}
                      >
                        Remove
                      </button>
                    </p>
                  </div>
                ))}
                <button
                  type="button"
                  className="button is-primary"
                  onClick={handleAddChild}
                >
                  Add Child
                </button>
              </div>
            </div>
          </form>
        </section>
        <footer className="modal-card-foot has-background-primary-light">
          {id ? (
            <button className="button is-info" onClick={handleUpdateParent}>
              Update
            </button>
          ) : (
            <button className="button is-primary mr-2" onClick={handleCreateParent}>
              Create
            </button>
          )}
          <button className="button" onClick={handleModal}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ParentModal;
