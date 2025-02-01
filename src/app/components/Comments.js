'use client';

import React, { useState, useEffect } from 'react';
import './styles/commentsystem.css';
import Ably from 'ably';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Comments() {
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await axios.get('/api/ably');
        setToken(response.data);  // Axios stores the data in the 'data' property
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      const ably = new Ably.Realtime({
        authUrl: '/api/ably',
        clientId: 'realtime-comment-system',
      });

      const channel = ably.channels.get('channel1');
      channel.subscribe('message', (message) => {
        const type = message.data.type;
        switch (type) {
          case 'main':
            setMessages((m) => [{ ...message, likes: [], replies:[] },  ...m ]);
            break;
          case 'reply':
            alert('Reply');
            setMessages((m) => [{ ...message, likes: [] },  ...m ]);
            break;
          case 'like':
            alert('Like');
            break;
          case 'unlike':
            alert('Unlike');
            break;
          case 'flag':
            alert('Flag');
            break;
          case 'delete':
            setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.data.comid !== message.data.deleteId));
            break;
          case 'ban':
            alert('Banning User');
            break;
          case 'block':
            alert('Blocking User');
            break;
          default:
            alert('This is the default anything else!');
            break;
        }
      });
    }
  }, [token]);

 
  

  const handleDelete = async (msgid, userid) => {
    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msgid, userid }),
        credentials: 'same-origin', 
      });

      if (!response.ok) {
        alert("There has been an error");
      } 
    } catch (error) {
      console.error('Error', error);
      alert('An error occurred');
    }
  };


  const renderTextWithImages = (text) => {
    const regex = /(https?:\/\/[^\s]+(?:\.jpg|\.jpeg|\.png|\.gif))/g;  // Match image URLs
    const parts = text.split(regex); // Split the text into parts, where each part is either regular text or an image URL
  
    return parts.map((part, index) => {
      // If the part is a URL, render it as an image
      if (part.match(/https?:\/\/[^\s]+(?:\.jpg|\.jpeg|\.png|\.gif)/)) {
        return <img key={index} src={part} alt="comment image" style={{ maxWidth: '100%' }} />;
      }
      // Otherwise, return it as regular text
      return <span key={index}>{part}</span>;
    });
  };
  


  return (
    <div>
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.data.comid}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'auto', // Automatically adjust the height based on the content
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0.3 },
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="main-card-holder">
              <div className="main-card">
                <div className="main-card-top">
                  <div className="main-card-avi">
                    <img src={message.data.avi} />
                  </div>
                  <div className="main-card-body">
                    <div className="main-card-name">{message.data.name}</div>
                    <div className="main-card-text">{renderTextWithImages(message.data.text)}</div>
                  </div>
                </div>

                {/* Conditional rendering for likes */}
                {message.likes && message.likes.length > 0 && (
                  <div className="main-card-like-container">
                    <div className="main-card-like-thumb">
                      <img src="./images/thumb" alt="like-thumb" />
                    </div>
                    <div className="main-card-like-likers">
                      {/* You can map over the likes if they contain names or other info */}
                      {message.likes.map((like, idx) => (
                        <span key={idx}>{like}</span>
                      ))}
                    </div>
                  </div>
                )}

                  <div className="main-card-footer">
                    <div className="main-card-icon"><img width={16} height={16} src={null} /></div><div className="main-card-date"></div><div className="main-card-like"><span className="like">Like</span></div><div className="main-card-flag" ><span className="flag" onClick={() => handleDelete(message.data.comid, message.data.id)}>Flag</span></div><div className="main-card-reply"><span className="reply">Comment</span></div>
                  </div>
                </div>
            <div className="main-card-basement"></div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

  );
}
