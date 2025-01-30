import React from 'react';
import Top from './components/Top.js';
import Post from './components/Post.js';
import Comments from './components/Comments.js';

function Page() {
  return (
    <div>
      <div id="main">
        <div id="nav"></div>
        <div id="banner">
          
        </div>
        <div id="social-icons"></div>
        <Top />
        <div id="chatter"></div>
        <Post />
        <div id="begin-flow"></div>
        <div id="new-flow">
            <Comments />
        </div>
      </div>
    </div>
  );
}

export default Page;