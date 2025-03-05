'use client';

import React, { useRef, useState, useEffect } from 'react';
import './styles/ReplyForm.css';

const ReplyForm = ({ parentId, onClose }) => {
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target)) {
        onClose();
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
    event.preventDefault();

    const text = replyText || "";

    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          parentId,
        }),
      });
    
      if (!response.ok) {
        throw new Error('Something went wrong.');
      }
    
      setReplyText('');
      onClose();
    } catch (error) {
      console.error('Error submitting reply:', error);
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