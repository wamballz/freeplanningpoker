import React, { useState, useEffect } from "react";

import Input from '../Input/Input';
import Button from '../Button/Button';
// APIs
import * as Sockets from '../../utilities/api.js';

import './UserInfoModal.scss';

import useFormLogic from '../../hooks/useFormLogic';
import useModalRequirements from '../../hooks/useModalRequirements';

const UserInfoModal = ({
  joinRoom,
  roomId,
  changeUsername
}) => {
  const {
    showUserNameInput,
    setUserNameInput,
    showRoomInput,
    setRoomInput
  } = useModalRequirements();
  const { inputs, handleFormChange } = useFormLogic();
  const [validRoom, setValidRoom] = useState(null);
  const toggleUserName = () => {
    // Sanitize the inputs
    if (inputs.userName.length > 0) {
      setUserNameInput(false);
      setRoomInput(true);
      localStorage.setItem("username", inputs.userName);
      changeUsername(inputs.userName);
    }
  };

  const enterRoom = (newRoom = false) => {
    // Sanitize the inputs
    let thisRoomNumber =''; 
    console.log("enterRoom", newRoom);
    if (inputs.roomId.length === 4 || newRoom) {
      if(newRoom){
        thisRoomNumber = randomString(4,"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      } else{
        thisRoomNumber = inputs.roomId.toUpperCase();
      }
      window.history.pushState(
        thisRoomNumber,
        "Free Planning Poker",
        `/#/${thisRoomNumber}`
      );
      joinRoom(thisRoomNumber, localStorage.getItem("username"));
    }
  };

  const randomString= (length, chars) => {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  const resetUsername = () => {
    setUserNameInput(true);
    changeUsername("");
  };

  useEffect(() => {
    console.log(localStorage.getItem("username"));

    if (localStorage.getItem("username")) {
      setUserNameInput(false);
      setRoomInput(true);
    } else {
      setUserNameInput(true);
      //userNameRef.current.focus();
    }
    if (inputs.roomId.length === 4 && !showUserNameInput) {
      setValidRoom("checking");
      enterRoom();
    }
    if (roomId) {
      setValidRoom("joined");
      setValidRoom(null);
    }
  }, [inputs.roomId, roomId]);

  // If there are stored values for User Name and Room Number, things will change
  return (
    <div id="user-info-modal">
      <div className="inner-container">
        {showUserNameInput && (
          <>
            <Input
              inputType="text"
              placeholder="Enter Your Name"
              name="userName"
              value={inputs.userName}
              handleFormChange={handleFormChange}
              maxLength="15"
            />
            <Button className="info-modal" onClick={toggleUserName}>
              Confirm Name
            </Button>
          </>
        )}
        {showRoomInput && !showUserNameInput && (
          <>
            <h1>Join Room</h1>
            <Input
              inputType="text"
              placeholder="&mdash; &mdash; &mdash; &mdash;"
              name="roomId"
              value={inputs.roomId}
              handleFormChange={handleFormChange}
              maxLength="4"
              className={`${validRoom} userName`}
            />
            <hr />
            <Button
              className="info-modal"
              onClick={() => enterRoom(true)}
              disabled={validRoom}
            >
              Create New Room
            </Button>
            <Button
              className="username-modal"
              onClick={resetUsername}
              disabled={validRoom}
            >
              Change Username
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfoModal;