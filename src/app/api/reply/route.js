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
  
  const sanitizedComment = xss(requestBody.text);

  const msgtype = 'reply';
  const name = session.user.name;
  const picture = session.user.image;
  const text = sanitizedComment;
  const idd = uuidv4();
  const replyid = idd+'reply';
  const parentId = requestBody.parentId;

  const comment = {
    type: msgtype,
    id: idd, 
    reply: replyid,
    username: name,
    avi: picture,
    body: text, 
    parentId: parentId
}
console.log(comment);
  if (!sanitizedComment) {
    console.log("Empty Comment");
    return new Response(
        JSON.stringify({ message: "Comment is empty." }),
        { status: 401 }
      );
  }

  const isAllSpaces = sanitizedComment.trim().length === 0;

  if (isAllSpaces) {
    return new Response(
        JSON.stringify({ message: "All Spaces." }),
        { status: 401 }
      );
  }
  
  // here we would continue with the logic of inserting to a database..

  const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  
  const channel = ably.channels.get('channel1');

  await channel.publish('message', comment);
  
  return new Response(
    JSON.stringify({ message: "Request processed successfully" }),
    { status: 200 }
  );
}