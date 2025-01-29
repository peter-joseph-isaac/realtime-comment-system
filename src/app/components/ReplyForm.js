'use client';

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ReplyForm.css'; // Ensure you have this CSS file

const ReplyForm = ({ parentId, onClose }) => {
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target)) {
        onClose(); // Hide the textarea
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplySubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    
    const name = "Peter"; // This should ideally come from user state or context
    const picture = "Some picture"; // This should ideally come from user state or context
    const text = replyText || ""; // Ensure text is a string

    try {
      await axios.post('/api/reply', {
        name,
        picture,
        text,
        parentId, // Include the parentId to associate the reply
      });
      setReplyText(''); // Clear the textarea after submission
      onClose(); // Hide the textarea
    } catch (error) {
      console.error('Error submitting reply:', error); // Log the error for debugging
    }
  };

  return (
    <div ref={textareaRef} className="reply-form">
      <textarea
        className="reply-text-area"
        value={replyText}
        onChange={handleReplyChange}
        placeholder="Type your reply here..."
      />
      <button onClick={handleReplySubmit}>Submit</button>
    </div>
  );
};

export default ReplyForm;