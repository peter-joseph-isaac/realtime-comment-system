'use client';

import React, { useState, useEffect } from 'react';
import './styles/commentsystem.css';
import Ably from 'ably';
import { motion, AnimatePresence } from 'framer-motion';


export default function Comments() {
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch('/api/ably');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setToken(data);  
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
  
      const handleMessage = (message) => {
        const type = message.data.type;
        switch (type) {
          case 'main':
            setMessages((m) => [{ ...message, likes: [], replies: [] }, ...m]);
            break;
          case 'reply':
            setMessages((m) => [{ ...message, likes: [] }, ...m]);
            break;
          case 'like':
            setMessages((m) =>
              m.map((msg) =>
                msg.data.comid === message.data.comid
                  ? { ...msg, likes: [...msg.likes, { id: message.data.likeId, name: message.data.name, image: message.data.image }] }
                  : msg
              )
            );
            break;
          case 'delete':
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.data.comid !== message.data.deleteId)
            );
            break;
          default:
            break;
        }
      };
  
      channel.subscribe('message', handleMessage);
  
      return () => {
        channel.unsubscribe('message', handleMessage);
        ably.close();
      };
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

  const handleLike = async (comId) => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comId }),
        credentials: 'same-origin',
      });
      if(!response.ok) {
        alert('Something went wrong liking comment.');
      }
    } catch (error) {
      console.error('There was an error', error);
    } finally {
      setTimeout(() => setIsLiking(false), 500);
    }
  };

  const renderTextWithImages = (text) => {
    const regex = /(https?:\/\/[^\s]+(?:\.jpg|\.jpeg|\.png|\.gif))/g;
    const parts = text.split(regex);
  
    return parts.map((part, index) => {
      if (part.match(/https?:\/\/[^\s]+(?:\.jpg|\.jpeg|\.png|\.gif)/)) {
        return <img key={index} src={part} alt="comment image" style={{ maxWidth: '100%' }} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.data.comid}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
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

                {message.likes && message.likes.length > 0 && (
                    <div className="main-card-like-container">
                      <div className="main-card-like-thumb">
                        <img src="./images/likes.png" />
                      </div>
                      <div className="main-card-like-likers">
                        {message.likes.map((like) => (
                          <div key={like.id} className="like-user">
                            <div className="like-image"><img src={like.image || "/default-avatar.png"} alt={like.name || "Unknown"} /></div>
                            <div className="like-image">{like.name || "Anonymous"}</div>
                          </div>
                        ))}
                        <div className="likes-this">likes this</div>
                      </div>
                    </div>
                  )}

                  <div className="main-card-footer">
                    <div className="main-card-icon"><img width={16} height={16} src="./images/comments.png" /></div><div className="main-card-date">Date</div><div className="main-card-like"><span className="like" onClick={() => handleLike(message.data.comid)}>Like</span></div><div className="main-card-flag" ><span className="flag" onClick={() => handleDelete(message.data.comid, message.data.id)}>Flag</span></div><div className="main-card-reply"><span className="reply">Reply</span></div>
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