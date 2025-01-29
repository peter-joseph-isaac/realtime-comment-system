// 'use client';

// import { signIn, signOut, useSession } from "next-auth/react";
// import './styles/top.css';

// const Top = () => {
//   const { data: session, status } = useSession();

//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }

//   if (!session) {
//     return (
//       <div>
//         <p>You are not logged in</p>
//         <br />
//         <p>Boo Yah!</p>
//         <button onClick={() => signIn("google")}>Sign In with Google</button>
//       </div>
//     );
//   }

//   return (
//     <div id="top-main">
//       <div id="top-left">
//           <div id="main-pic"><img src={session.user.image} width={64} height={64}/></div>
//           <div id="main-name"><h1>{session.user.name}</h1></div>
//       </div>
//       <div id="top-right">
//           <button id="sign-out-button" onClick={() => signOut()}>Log Out</button>
//       </div>
//     </div>
//   );
// };

// export default Top;

'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import './styles/top.css';

const Top = () => {
  const { data: session, status } = useSession();

  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }

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
       <button onClick={() => signIn("google")}>Sign In with Google</button>
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
