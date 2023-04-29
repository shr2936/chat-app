import React, { useEffect } from "react";
import { useState } from "react";

var id = 0;

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage === "") return;

    let date = new Date();

    let messageData = {
      room: room,
      author: username,
      message: currentMessage,
      time: date.getHours() + ":" + date.getMinutes(),
      id: ++id,
    };

    setMessagesList((list) => [...list, messageData]);

    setCurrentMessage("");

    await socket.emit("send_message", messageData);

    scrollToBottom();
  };

  const scrollToBottom = () => {
    const elem = document.getElementById("chat-window");
    elem.scrollTop = elem.scrollHeight;
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessagesList((list) => [...list, data]);
      setTimeout(() => scrollToBottom(), 100);
    });
    return () => socket.off("receive_message");
  }, [socket, scrollToBottom]);

  const handleKeyDown = (event) => {
    if (event.keyCode == 13) {
      sendMessage();
    }
  };

  return (
    <div>
      <div>Live chat</div>
      <div className="chat-window" id="chat-window">
        {messagesList.map((data) => {
          return (
            <div
              className={
                data.author == username ? "sent-message" : "receieved-message"
              }
            >
              <div>{data.message}</div>
              <div className="metadata">
                <span>{data.time}</span>
                <span className="author">{data.author}</span>
              </div>
            </div>
          );
        })}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={currentMessage}
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
        onKeyDown={(event) => handleKeyDown(event)}
      />

      <button onClick={sendMessage}>&#9658;</button>
    </div>
  );
}

export default Chat;
