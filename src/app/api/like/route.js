import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import xss from 'xss';
import Ably from 'ably';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(
            JSON.stringify({ message: "Unauthorized" }),
            { status: 401 }
        );
    }

    const requestBody = await req.json();

    const sanitizedComId = xss(requestBody.comId);

    if (!sanitizedComId) {
        console.log("Empty Comment");
        return new Response(
            JSON.stringify({ message: "Comment and or Like ID is empty." }),
            { status: 400 }
        );
    }

    const likerId = uuidv4();

    const comment = {
        type: 'like',
        comid: sanitizedComId,
        id: session.user.id,
        image: session.user.image,
        name: session.user.name,
        likeId: likerId
    };

    try {
        const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
        const channel = ably.channels.get('channel1');
        await channel.publish('message', comment);
        return new Response(
            JSON.stringify({ message: "Request processed successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("There has been an error", error);
        return new Response(
            JSON.stringify({ message: "Failed to send the deleted comment to Ably" }),
            { status: 500 }
        );
    }

}