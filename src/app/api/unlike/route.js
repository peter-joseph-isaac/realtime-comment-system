import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // I

export async function POST(req) {
    // Retrieve the session using getServerSession
    const session = await getServerSession(authOptions);
  
    // If no session, return an error response
    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // unlike logic goes here..



}