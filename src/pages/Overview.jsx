import React, { useContext, useEffect, useState } from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import Select from 'react-select';
import { Button } from '../components';
import { earningData, dropdownData } from '../data/dummy';
import { UserContext } from "../contexts/UserContext";
import earningsImage from '../data/earnings.jpg';
import Doughnut from './Charts/Pie';
import ErrorMessage from "../components/ErrorMessage";
import { useNavigate } from 'react-router-dom';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <Select
      id="time"
      options={dropdownData}
      value={{ label: 'Time', value: 'Id' }}
      styles={{
        control: (provided) => ({
          ...provided,
          border: 'none',
          color: currentMode === 'Dark' ? 'white' : 'black', 
        }),
      }}
      menuPortalTarget={document.body}
      menuPosition="fixed"
    />
  </div>
);


const Overview = () => {
  const { currentColor, currentMode } = useContext(UserContext);
  const [registeredUsers, setRegisteredUsers] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [registeredSwimmers, setRegisteredSwimmers] = useState(null);
  const [bookedSwimmers, setBookedSwimmers] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [ecomPieChartData, setEcomPieChartData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const token = localStorage.getItem('awesomeLeadsToken');

  const navigate = useNavigate();

  const isTokenExpired = () => {
    
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    if (!tokenTimestamp) {
      // Token timestamp not found, considering token as expired
      return true;
    }
  
    const currentTime = new Date().getTime();
    const tokenExpirationTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    return (currentTime - parseInt(tokenTimestamp, 10)) > tokenExpirationTime;
  };

  const checkTokenExpiration = () => {
    if (isTokenExpired()) {
      // Clear token and any other relevant data
     
      console.log("done");
navigate('/');
      // Redirect user to logout or login page, or perform any other action as needed
      // Example: window.location.href = '/logout';
    }
  };
  
  useEffect(() => {
    checkTokenExpiration()
  }, [])

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const endpoints = [
          "https://shaqc-admin-backend.onrender.com/parents/team/mombasa_rd/count",
          "https://shaqc-admin-backend.onrender.com/parents/team/kiambu_rd/count",
          "https://shaqc-admin-backend.onrender.com/parents/team/langata_rd/count",
          "https://shaqc-admin-backend.onrender.com/parents/team/ngong_rd/count",
        ];

        const promises = endpoints.map(async (endpoint) => {
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch data from ${endpoint}`);
          }
          const data = await response.json();
          return data;
        });

        const [mombasaData, kiambuData, langataData, ngongData] = await Promise.all(promises);

        const mombasa = mombasaData.total_parents_mombasa_rd || 0;
        const kiambu = kiambuData.total_parents_kiambu_rd || 0;
        const langata = langataData.total_parents_langata_rd || 0;
        const ngong = ngongData.total_parents_ngong_rd || 0;

        setTeamData([
          { name: 'Mombasa Road', users: mombasa },
          { name: 'Kiambu Road', users: kiambu },
          { name: 'Langata Road', users: langata },
          { name: 'Ngong Road', users: ngong },
        ]);

        console.log("Fetched team data:", { mombasa, kiambu, langata, ngong });
      } catch (error) {
        console.error("Error fetching team data:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchTeamData();
  }, [token]);


  useEffect(() => {
    const fetchEcomData = async () => {
      try {
        const endpoints = [
          "https://shaqc-admin-backend.onrender.com/bookings/upcoming/count",
          "https://shaqc-admin-backend.onrender.com/bookings/cancelled/count",
          "https://shaqc-admin-backend.onrender.com/bookings/completed/count",
        ];

        const promises = endpoints.map(async (endpoint) => {
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch data from ${endpoint}`);
          }
          const data = await response.json();
          return data;
        });

        const [upcomingData, cancelledData, completedData] = await Promise.all(promises);

        const upcoming = upcomingData.total_upcoming_bookings || 0;
        const cancelled = cancelledData.total_cancelled_bookings || 0;
        const completed = completedData.total_completed_bookings || 0;

        setEcomPieChartData([
          { x: 'upcoming', y: upcoming, text: `${upcoming} %` },
          { x: 'cancelled', y: cancelled, text: `${cancelled} %` },
          { x: 'completed', y: completed, text: `${completed} %` },
        ]);

        console.log("Fetched e-commerce data:", { upcoming, cancelled, completed });
      } catch (error) {
        console.error("Error fetching e-commerce data:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchEcomData();
  }, [token]);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        const response = await fetch("https://shaqc-admin-backend.onrender.com/parents/count", requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong. Couldn't load the leads");
        } else {
          const data = await response.json();
          setRegisteredUsers(data.total_parents);
          console.log("Fetched registered users:", data.total_parents);
        }
      } catch (error) {
        console.error("Error fetching registered users:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchRegisteredUsers();
  }, [token]);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        const response = await fetch("https://shaqc-admin-backend.onrender.com/parents/count", requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong. Couldn't load the leads");
        } else {
          const data = await response.json();
          setRegisteredUsers(data.total_parents);
          console.log("Fetched registered users:", data.total_parents);
        }
      } catch (error) {
        console.error("Error fetching registered users:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchRegisteredUsers();
  }, [token]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        const response = await fetch("https://shaqc-admin-backend.onrender.com/bookings/count", requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong. Couldn't load the leads");
        } else {
          const data = await response.json();
          setBookings(data.total_bookings);
          console.log("Fetched bookings:", data.total_bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchBookings();
  }, [token]);

  useEffect(() => {
    const fetchRegisteredSwimmers = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        const response = await fetch("https://shaqc-admin-backend.onrender.com/parents/children/count", requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong. Couldn't load the leads");
        } else {
          const data = await response.json();
          setRegisteredSwimmers(data.total_parent_children);
          console.log("Fetched registered swimmers:", data.total_parent_children);
        }
      } catch (error) {
        console.error("Error fetching registered swimmers:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchRegisteredSwimmers();
  }, [token]);

  useEffect(() => {
    const fetchBookedSwimmers = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        const response = await fetch("https://shaqc-admin-backend.onrender.com/bookings/children/count", requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong. Couldn't load the leads");
        } else {
          const data = await response.json();
          setBookedSwimmers(data.total_booking_children);
          console.log("Fetched booked swimmers:", data.total_booking_children);
        }
      } catch (error) {
        console.error("Error fetching booked swimmers:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchBookedSwimmers();
  }, [token]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        const response = await fetch("https://shaqc-admin-backend.onrender.com/bookings/totalcost", requestOptions);
        if (!response.ok) {
          throw new Error("Something went wrong. Couldn't load the leads");
        } else {
          const data = await response.json();
          setEarnings(data.total_booking_cost);
          console.log("Fetched earnings:", data.total_booking_cost);
        }
      } catch (error) {
        console.error("Error fetching earnings:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchEarnings();
  }, [token]);

  return (
    <div className="mt-5 px-5">
      <div className="flex flex-col lg:flex-nowrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full m-auto lg:w-80 p-8 pt-9  bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${earningsImage})` }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Earnings</p>
              <p className="text-2xl">{errorMessage ? 'Error fetching earnings' : earnings}</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4"
            >
              <BsCurrencyDollar />
            </button>
          </div>
        
        </div>
        <div className="grid grid-cols-1 gap-2 p-5">
          {earningData.map((item, index) => (
            <div key={index} className="bg-gray-200 h-44 dark:text-gray-200 dark:bg-secondary-dark-bg  p-4 pt-9 rounded-2xl flex flex-col items-center ">
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3 text-gray-600">
                <span className="text-lg font-semibold">{errorMessage ? `Error fetching ${item.title}` : (index === 0 ? registeredUsers : index === 1 ? bookings : index === 2 ? registeredSwimmers : bookedSwimmers)}</span>
                <span className={`text-sm text-black  ml-2`}>
                  {item.percentage} 
                </span>
              </p>
              <p className="text-sm text-gray-700 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
        <div className="w-3/4  mx-auto">
          <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
          <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-black">Status</th>
                <th className="border border-gray-300 p-2 text-black">Count</th>
              </tr>
            </thead>
            <tbody>
              {ecomPieChartData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td className="border border-gray-300 p-2 text-gray-700">{item.x}</td>
                  <td className="border border-gray-300 p-2 text-gray-700">{item.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {/* Responsive table */}
      <div className="mt-8 w-3/4  mx-auto">
        <h2 className="text-xl font-semibold mb-4">Teams</h2>
        <table className="w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-black">Team</th>
              <th className="border border-gray-300 p-2 text-black">Users</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((team, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                <td className="border border-gray-300 p-2 text-gray-700">{team.name}</td>
                <td className="border border-gray-300 p-2 text-gray-700">{team.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overview;


