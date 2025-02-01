// 'use client';

// import React, { useState } from 'react';
// import './styles/post.css';

// export default function Post() {
//   const [message, setMessage] = useState('');

  

//   const handlePost = async () => {
//     try {
//       const response = await fetch('/api/second', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // If the post was successful
//         alert(data.message); // Success message from the server
//         console.log('User:', data.user); // Session data (user info)
//       } else {
//         // If there was an error (e.g., not authenticated)
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error('Error posting message:', error);
//       alert('An error occurred while posting your comment.');
//     }
//   };

//   return (
//     <div>
//       <textarea
//         id="main-post"
//         placeholder="Type your comment here..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       ></textarea>
//       <div id="post-button-holder">
//         <button id="mainButton" onClick={handlePost}>Post</button>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import './styles/post.css';

export default function Post() {
  const [message, setMessage] = useState('');

  const handlePost = async () => {
    try {
      const response = await fetch('/api/second', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        credentials: 'same-origin', // Ensures cookies are sent with the request
      });

      const data = await response.json();

      if (response.ok) {
        // If the post was successful
       // alert(data.message); // Success message from the server
       setMessage('');
        // console.log('User:', data.user); // Session data (user info)
      } else {
        // If there was an error (e.g., not authenticated)
       // alert(data.message);
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
