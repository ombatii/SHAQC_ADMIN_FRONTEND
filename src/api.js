import React, { useState, useEffect } from 'react';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { IoBookmarksSharp } from 'react-icons/io5';
import { FaChild } from 'react-icons/fa';

const getIconColor = (index) => {
  switch (index) {
    case 0:
      return '#03C9D7'; // Registered Users icon color
    case 1:
      return 'rgb(0, 255, 0)'; // Bookings icon color
    case 2:
      return 'rgb(255, 244, 229)'; // Children of Registered Users icon color
    case 3:
      return 'rgb(228, 106, 118)'; // Children of Bookings icon color
    default:
      return ''; // Default color
  }
};

const getIconBg = (index) => {
  switch (index) {
    case 0:
      return '#E5FAFB'; // Registered Users icon background color
    case 1:
      return 'rgb(235, 250, 242)'; // Bookings icon background color
    case 2:
      return 'rgb(254, 201, 15)'; // Children of Registered Users icon background color
    case 3:
      return 'rgb(255, 244, 229)'; // Children of Bookings icon background color
    default:
      return ''; // Default color
  }
};

const getPcColor = (index) => {
  switch (index) {
    case 0:
      return 'red-600'; // Registered Users percentage color
    case 1:
      return 'red-600'; // Bookings percentage color
    case 2:
    case 3:
      return 'green-600'; // Children percentage color
    default:
      return ''; // Default color
  }
};

const EarningDataComponent = () => {
  const [earningData, setEarningData] = useState([]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await fetch('https://shaqc-admin-backend.onrender.com/earnings');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setEarningData(data);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      }
    };

    fetchEarningsData();
  }, []);

  return (
    <div>
      {earningData.map((item, index) => (
        <div key={index} className="earning-item">
          <div className="icon" style={{ color: getIconColor(index), backgroundColor: getIconBg(index) }}>
            {index === 0 && <MdOutlineSupervisorAccount />}
            {index === 1 && <IoBookmarksSharp />}
            {(index === 2 || index === 3) && <FaChild />}
          </div>
          <div className="details">
            <p className="amount">{item.amount}</p>
            <p className={`percentage text-${getPcColor(index)}`}>{item.percentage}</p>
            <p className="title">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EarningDataComponent;
