import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { MdInsertEmoticon } from 'react-icons/md';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { MdMoreVert } from 'react-icons/md';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: "Hello!",
      time: "10:00 AM",
      sender: "received",
    },
    {
      content: "Hi there!",
      time: "10:02 AM",
      sender: "sent",
    },
    {
      content: "How are you?",
      time: "10:03 AM",
      sender: "received",
    },
  ]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the server using Socket.IO
    const socket = io('https://51b4-202-47-49-109.ngrok-free.app');
    setSocket(socket);

    // Listen for incoming messages from the server
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUserClick = (index) => {
    setSelectedUser(index);
    setSelectedModerator(null);
  };

  const handleModeratorClick = (index) => {
    setSelectedModerator(index);
    setSelectedUser(null);
  };

  const handleMessageChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = {
        content: messageInput + selectedEmoji,
        time: getCurrentTime(),
        sender: "sent",
      };

      // Emit the message event to the server
      socket.emit('message', newMessage);

      setMessages([...messages, newMessage]);
      setMessageInput("");
      setSelectedEmoji("");
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji.native);
    setMessageInput(messageInput + emoji.native);
  };

  const getCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  };

  const users = [
    {
      name: "abdul qadeer",
      age: 59,
      img: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fHww&w=1000&q=80",
      selected: selectedUser === 0,
    },
    {
      name: "Aqib",
      age: 59,
      img: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fHww&w=1000&q=80",
      selected: selectedUser === 1,
    },
  ];

  const moderators = [
    {
      name: "abdul qadeer",
      age: 59,
      img: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fHww&w=1000&q=80",
      selected: selectedModerator === 0,
    },
    {
      name: "Aqib",
      age: 59,
      img: "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1nfGVufDB8fDB8fHww&w=1000&q=80",
      selected: selectedModerator === 1,
    },
  ];

  const toggleDeletePopup = () => {
    setShowDeletePopup(!showDeletePopup);
  };

  const cancelMessages = () => {
    setShowDeletePopup(false);
  };

  const deleteMessages = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete the messages',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setMessages([]);
        setShowDeletePopup(false);
        Swal.fire('Deleted!', 'The messages have been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The messages deletion has been cancelled.', 'error');
      }
    });
  };

  return (
    <>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-3">
            <div className="bg-primary text-white p-3 shadow">
              <div className="animated-bg">
                <h2>Customer Section</h2>
              </div>
            </div>
            <div>
              <div>
                <div className="bg-white p-3 shadow customer-section">
                  {users.map((user, index) => (
                    <div
                      className={`user-item ${user.selected ? "selected" : ""}`}
                      key={index}
                      onClick={() => handleUserClick(index)}
                    >
                      <img
                        src={user.img}
                        alt="Profile"
                        className="profile-picture"
                      />
                      <span>{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
          <div className="col">
            {/* Chat section */}
            <div className="bg-secondary text-white p-3 shadow">
              <div className="animated-bg">
                <h2>Chat Section</h2>
              </div>
            </div>
            <div className="bg-white p-0 shadow chat-container">
              {selectedUser !== null && (
                <div className="selected-user-container">
                  <img
                    src={users[selectedUser].img}
                    alt="Selected User"
                    className="selected-user-img"
                  />
                  <div className="selected-user-name">
                    {users[selectedUser].name}
                  </div>
                  <div className="more-options">
                    <MdMoreVert
                      className="deleteIcon"
                      size={24}
                      onClick={toggleDeletePopup}
                    />
                    {showDeletePopup && (
                      <div className="popupDelete">
                        <ul>
                          <li onClick={deleteMessages}>Delete Messages</li>
                          <li onClick={cancelMessages}>Cancel</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedModerator !== null && (
                <div className="selected-user-container">
                  <img
                    src={users[selectedModerator].img}
                    alt="Selected User"
                    className="selected-user-img"
                  />
                  <div className="selected-user-name">
                    {moderators[selectedModerator].name}
                  </div>
                  <div className="more-options">
                    <MdMoreVert
                      size={24}
                      className="deleteIcon"
                      onClick={toggleDeletePopup}
                    />
                    {showDeletePopup && (
                      <div className="popupDelete">
                        <ul>
                          <li onClick={deleteMessages}>Delete Messages</li>
                          <li onClick={cancelMessages}>Cancel</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  className={`message-container p-2 ${message.sender}`}
                  key={index}
                >
                  <div className="message">{message.content}</div>
                  <div className="time">{message.time}</div>
                </div>
              ))}
            </div>
            <div className="input-container">
              <div className="input-field">
                <div className="emoji-button" onClick={toggleEmojiPicker}>
                  <MdInsertEmoticon size={24} />
                </div>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput + selectedEmoji}
                  onChange={handleMessageChange}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                {showEmojiPicker && (
                  <div className="emoji-picker-container">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}
              </div>
              <button className="send-button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
          <div className="col-3">
            <div className="bg-info text-white p-3 shadow">
              <div className="animated-bg">
                <h2>Moderator Section</h2>
              </div>
            </div>
            <div className="bg-white p-3 shadow customer-section">
              {moderators.map((moderator, index) => (
                <div
                  className={`user-item ${
                    moderator.selected ? "selectedModerator" : ""
                  }`}
                  key={index}
                  onClick={() => handleModeratorClick(index)}
                >
                  <img
                    src={moderator.img}
                    alt="Profile"
                    className="profile-picture"
                  />
                  <span>{moderator.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;

