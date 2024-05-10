import React, { useState, useContext } from "react";
import swimmingPoolImage from "../data/swimmingPool.jpg";
import ErrorMessage from "../components/ErrorMessage";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setToken] = useContext(UserContext);

  const navigate = useNavigate();

  const submitLogin = async () => {
    try {
      const response = await fetch("https://shaqc-admin-backend.onrender.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "",
          username: email,
          password: password,
          scope: "",
          client_id: "",
          client_secret: "",
        }).toString(),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.detail);
      } else {
        const data = await response.json();
        const currentTime = new Date().getTime();
  localStorage.setItem('awesomeLeadsToken', data.access_token);
  localStorage.setItem('tokenTimestamp', currentTime)
        setToken(data.access_token);
        console.log(data)
        navigate('/overview')
        //reload overview page
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <>
      <style>
        {`
          * {
            font-family: 'Poppins', sans-serif !important;
          }
          :root {
            --btn-size: .8rem;
            --small-size: .75rem;
          }
          body {
            background-color: #E4E8EB;
          }
          .bg {
            background-color: #E4E8EB;
          }
          .login-card {
            width: calc(100% - 13rem);
          }
          .login-card h1 {
            color: #111727;
          }
          .login-card h2 {
            color: #111727;
          }
          .login-card p {
            color: #313131;
            font-size: var(--small-size);
          }
          .form-control:focus {
            outline: none;
            box-shadow: none;
            border: var(--bs-border-width) solid var(--bs-border-color);
          }
          .login-card label {
            font-size: var(--small-size);
          }
          form.form input {
            font-size: var(--small-size);
          }
          form.form input::placeholder {
            font-size: var(--small-size);
          }
          form.form button:nth-of-type(1) {
            color: #fff;
            background-color: #111727;
            font-size: var(--btn-size);
          }
          form.form button:nth-last-child(1),
          form.form button:nth-last-child(2) {
            color: #111727;
            border: 1px solid #111727;
            font-size: var(--btn-size);
          }
          .checkbox label {
            font-size: var(--small-size);
          }
          .checkbox a {
            font-size: var(--small-size);
            color: #111727;
          }
          .signup {
            font-size: var(--small-size);
          }
          .signup a {
            color: #111727;
          }
          @media (max-width: 480px) {
            .login-card {
              width: calc(100% - 2rem);
            }
          }
        `}
      </style>
      <div className=" py-5 px-5 bg w-3/4 m-auto">
        <div className="row justify-content-between bg-white rounded-start-4">
          <div className="col-lg-7 d-flex justify-content-center align-items-center">
            <div className="login-card py-lg-0 py-5">
              <h1 className="fw-bold">SHAQC ADMIN</h1>
              <h2 className="fw-semibold">Please login to your account</h2>
              <form className="form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3 col-12">
                    <label className="mb-1 fw-medium">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="mb-1 fw-medium">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 d-flex justify-content-between mt-3 checkbox">
                    <div className="d-flex">
                      <input className="form-check-input" type="checkbox" />
                      <label className="fw-medium ms-2">Remember password</label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn mt-4 w-100 text-white">
                  Sign in
                </button>
              </form>
              {errorMessage && <ErrorMessage message={errorMessage} />}
            </div>
          </div>
          <div className="col-lg-5 col-12 p-0">
            <img src={swimmingPoolImage} alt="" className="img-fluid w-100 h-100" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
