import { getSession } from 'next-auth/react'; // NextAuth function to get session

export async function POST(req) {
  // Parse the incoming request body (JSON)
  const { message } = await req.json();

  console.log(message);

  // Get session data
  const session = await getSession({ req });

  if (!session) {
    return new Response(JSON.stringify({ message: 'Not authenticated motherfucker' }), { status: 401 });
  }

  // Process the message (you can store it in a database here)
  console.log('Message received:', JSON.stringify(message));

  // Return success response with session user data
  return new Response(
    JSON.stringify({
      message: 'Comment posted successfully',
      user: session.user,
    }),
    { status: 200 }
  );
}
