import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import xss from 'xss';
import Ably from 'ably';


export async function POST(req) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(
            JSON.stringify({ message: "Unauthorized" }),
            { status: 401 }
        );
    }

    const requestBody = await req.json();


    if(requestBody.userid !== session.user.id){
        return new Response(
            JSON.stringify({ message: "Unauthorized"}),
            { status: 401 }
        );
    }

    const sanitizedId = xss(requestBody.msgid);

    if (!sanitizedId) {
        console.log("Empty Comment");
        return new Response(
            JSON.stringify({ message: "Comment is empty." }),
            { status: 400 }
        );
    }

    const isAllSpaces = sanitizedId.trim().length === 0;

    if (isAllSpaces) {
        return new Response(
            JSON.stringify({ message: "All Spaces." }),
            { status: 400 }
        );
    }

    const comment = {
        type: 'delete',
        id: session.user.id,
        deleteId: sanitizedId
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