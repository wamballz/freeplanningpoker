// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useState } from 'react';

import Header from './_components/Header/Header';
import Portal from './_components/Portal/Portal';
import UserInfoModal from './_components/UserInfoModal/UserInfoModal';
import CardHolder from "./_components/CardHolder/CardHolder";
import PlayingSurface from "./_components/PlayingSurface/PlayingSurface";

// Hooks
import useModalRequirements from './hooks/useModalRequirements';

// APIs
import * as Sockets from './utilities/api.js';
// Styles
import './styles/App.scss';
import './styles/Common.scss';

const App = () => {
  const [roomUsers, setRoomUsers] = useState([]);
  const [roomId, setRoomId] = useState();
  const [userName, setUserName] = useState();
  const [sessionId, setSessionId] = useState();
  const { showModal, setShowModal } = useModalRequirements();

  

  const changeUsername = (username) => {
    setUserName(username);
  };


  const joinRoom = async (roomId, userName) => {
    setUserName(userName);
    await Sockets.sendUsername(userName);
    await Sockets.joinRoom(roomId);
    setShowModal(false);
  };

  const leaveRoom = () => {
    window.history.pushState('', "Free Planning Poker", `/`);
    Sockets.leaveRoom();
    setShowModal(true);
  };
  

  useEffect(() => {
    Sockets.socketInit(err => {});
    let roomURL = window.location.hash.replace("#/", "");
    console.log("roomURL", roomURL);
    let userNameLocalHost = localStorage.getItem("username");
    console.log(userNameLocalHost);
    console.log(roomURL);
    if (roomURL.length === 4) {
      setRoomId(roomURL);
      if (userNameLocalHost) {
        console.log("LETS JOIN!");
        setUserName(userNameLocalHost);
        joinRoom(roomURL, userNameLocalHost);
      }
    }
  }, []);

  useEffect(() => {
    Sockets.readRoomId(roomId => {
      console.log("roomId", roomId);
      setRoomId(roomId);
    });
  }, [roomId]);
  
  useEffect(() => {
      Sockets.readRoomUsers(roomUsers => {
        console.log(roomUsers);
        Sockets.getSessionId();
        setRoomUsers(roomUsers);
      });
      Sockets.setSessionId(sessionId => {
        setSessionId(sessionId);
      });
    }, [sessionId]);

  return (
    <div className="App">
      <Header
        roomId={roomId}
        userName={userName}
        leaveRoom={leaveRoom}
        changeUsername={changeUsername}
      />

      <CardHolder />
      {showModal && (
        <Portal>
          <div id="overlay">
            <UserInfoModal
              joinRoom={joinRoom}
              roomId={roomId}
              changeUsername={changeUsername}
            />
          </div>
        </Portal>
      )}
      <PlayingSurface roomUsers={roomUsers} sessionId={sessionId} />
    </div>
  );
}

export default App;
