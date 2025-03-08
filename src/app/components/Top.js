'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import './styles/top.css';

const Top = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
         <div id="top-main">
      <div id="top-left"> 
        <div id="main-name">
          <h1>You must be logged in to comment...</h1>
        </div>
      </div>
      <div id="top-right">
       <button id ="sign-in-button" onClick={() => signIn("google")}>Sign In with Google</button>
      </div>
    </div>
  </div>
    );
  }

  return (
    <div id="top-main">
      <div id="top-left">
        <div id="main-pic">
          <img src={session.user.image} width={64} height={64} />
        </div>
        <div id="main-name">
          <h1>{session.user.name}</h1>
        </div>
      </div>
      <div id="top-right">
        <button id="sign-out-button" onClick={() => signOut()}>Log Out</button>
      </div>
    </div>
  );
};

export default Top; 