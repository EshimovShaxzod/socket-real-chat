import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (currentMessage !== "" && !isSending) {
      setIsSending(true);
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setIsSending(false);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col justify-center items-center">
      <div className="p-3 rounded-md w-full max-w-[300px] border-2">
        <div className="py-3">
          <p className="text-white font-bold text-xl">Live Chat</p>
        </div>
        <div className="h-[250px] bg-amber-100 p-2 rounded-t-md overflow-auto">
          {messageList.map((messageContent) => (
            <div key={messageContent.message}>
              <div
                className={`${
                  username === messageContent.author
                    ? "w-full flex flex-col items-end"
                    : "w-full flex flex-col items-start"
                }`}
              >
                <div className="flex items-center gap-x-2">
                  <p className="bg-green-500 px-4 py-1 rounded-md">
                    {messageContent.message}
                  </p>
                </div>
                <div className="flex items-center gap-x-1">
                  <p className="text-[10px] p-0">{messageContent.time}</p>
                  <p className="text-[12px] p-0">{messageContent.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-footer w-full flex items-center justify-between">
          <input
            type="text"
            className="p-2 outline-none"
            placeholder="Hey..."
            value={currentMessage} // inputni yangilaymiz
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage(); // Enter tugmasi bosilganda xabar yuborish
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-black w-full py-2 text-white"
            disabled={isSending} // Yuborish davomida tugma ishlamaydi
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

Chat.propTypes = {
  socket: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};

export default Chat;
