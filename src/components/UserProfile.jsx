import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
const handleLogOut = () => {
  localStorage.removeItem('awesomeLeadsToken');
      localStorage.removeItem('tokenTimestamp');
      console.log("done");
navigate('/');
}
  return (
    <div className="nav-item absolute right-0 top-12 bg-white dark:bg-[#42464D] p-4 rounded-lg w-2/3 md:w-1/3">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-100">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> Shaqc Admin </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  Administrator   </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> shaqc.com </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
      <button
      type="button"
      onClick={handleLogOut}
      className={` text- p-3 text-gray-200  hover:drop-shadow-xl bg-blue-400 w-full rounded-sm m-auto`}
    >
       Logout
    </button>
      </div>
    </div>

  );
};

export default UserProfile;