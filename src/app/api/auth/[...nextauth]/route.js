// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     // Add other providers here as needed
//   ],
//   session: {
//     strategy: "jwt",  // You can also use 'database' for persistent sessions
//   },
//   callbacks: {
//     async session({ session, token }) {
//       if (token?.user) {
//         session.user.id = token.user.id;
//         session.user.email = token.user.email;
//         session.user.name = token.user.name;
//         session.user.image = token.user.image;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.user = {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           image: user.image,
//         };
//       }
//       return token;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",  // Using JWT-based sessions
  },
  callbacks: {
    // When a session is checked, add extra information to the session
    async session({ session, token }) {
      if (token?.user) {
        console.log(token);
        session.user.id = token.user.id;
        session.user.email = token.user.email;
        session.user.name = token.user.name;
        session.user.image = token.user.image;
      }
      return session;
    },
    // When a JWT token is created, add user data to it
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token', // The name of the session token cookie
      options: {
        httpOnly: true,  // The cookie can't be accessed from JavaScript (for security)
        sameSite: 'lax',  // Change to 'None' if using cross-origin requests (production)
        path: '/',  // Cookie is available for the entire domain
        secure: process.env.NODE_ENV === 'production',  // Ensure cookies are secure in production
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
