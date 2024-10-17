import io from "socket.io-client";
import "./index.css";
import { useState } from "react";
import Chat from "./chat";

const socket = io.connect("http://localhost:3001");

const Home = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowchat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }

    setShowchat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <h2 className="font-semibold text-3xl mb-4">Join A Chat</h2>
          <div className="w-full max-w-[400px] py-4 bg-gray-600 flex flex-col items-center gap-y-4 rounded-md">
            <input
              type="text"
              className="p-2 rounded-md outline-none"
              placeholder="John..."
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type="text"
              className="p-2 rounded-md outline-none"
              placeholder="Chat ID..."
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
            <button
              onClick={joinRoom}
              className="flex items-center justify-center bg-blue-700 px-4 py-2 rounded-full text-white"
            >
              Join A Room
            </button>
          </div>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
};

export default Home;
