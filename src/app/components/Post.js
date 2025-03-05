'use client';

import React, { useState } from 'react';
import './styles/post.css';

export default function Post() {
  const [message, setMessage] = useState('');

  const handlePost = async () => {
    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        credentials: 'same-origin', 
      });

      const data = await response.json();

      if (response.ok) {
       setMessage('');
      } 
    } catch (error) {
      console.error('Error posting message:', error);
      alert('An error occurred while posting your comment.');
    }
  };

  return (
    <div>
      <textarea
        id="main-post"
        placeholder="Type your comment here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <div id="post-button-holder">
        <button id="mainButton" onClick={handlePost}>
          Post
        </button>
      </div>
    </div>
  );
}