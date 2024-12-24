import { auth, firestore } from "@/app/firebase";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  collection,
  query,
  limit,
  orderBy,
  addDoc,
  serverTimestamp,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { ChatMessage } from "./chat-message";
import { TausiUser } from "@/models/user";
import { useGetUsersQuery } from "@/modules/users/api/usersApi";
import { ChatItemProps } from "../types";

export const MessagingChatCard = () => {
  const { data: users, isLoading, error } = useGetUsersQuery(10000);
  const messagesRef = collection(firestore, "chats");
  const messagesQuery = query(messagesRef, orderBy("createdAt"), limit(25));
  const [messageInputValue, setMessageInputValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [messagesSnapshot] = useCollection(messagesQuery);

  const beauticians =
    users?.filter(
      (user: TausiUser) => user.sessionData?.userTypeSession === "professional"
    ) || [];
  const clients =
    users?.filter(
      (user: TausiUser) => user.sessionData?.userTypeSession === "client"
    ) || [];

  const recipientIds = [
    ...beauticians.map((user) => user.id),
    ...clients.map((user) => user.id),
  ];

  const messages = messagesSnapshot?.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      text: data.text || "",
      sender: data.sender || "",
      recipient: data.recipients || [],
      read: data.read || false,
      timestamp: data.timestamp || "",
      createdAt: data.createdAt || new Date(),
      senderName: data.senderName || "Unknown",
      senderAvatar: data.senderAvatar || "",
      messageType: data.messageType || "text",
      attachments: data.attachments || [],
      replyTo: data.replyTo || null,
      reactions: data.reactions || {},
      edited: data.edited || false,
      delivered: data.delivered || false,
    } as ChatItemProps;
  });

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInputValue.trim()) return;

    const { uid, displayName, photoURL } = auth.currentUser!;

    const newMessage = {
      text: messageInputValue,
      createdAt: serverTimestamp(),
      sender: uid,
      senderName: displayName || "Unknown",
      senderAvatar: photoURL || "",
      recipients: recipientIds, // Array of recipient IDs
      read: false,
      messageType: "text",
      attachments: [],
      reactions: {},
    };

    try {
      await addDoc(messagesRef, newMessage);
      setMessageInputValue(""); // Clear the input
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const deleteAllMessages = async () => {
    if (confirm("Are you sure you want to delete all messages?")) {
      setIsDeleting(true); // Set loading state to true
      try {
        const querySnapshot = await getDocs(messagesRef);

        const deletePromises = querySnapshot.docs.map((doc) =>
          deleteDoc(doc.ref)
        );
        await Promise.all(deletePromises);
        alert("All messages have been deleted.");
      } catch (error) {
        console.error("Error deleting messages: ", error);
      } finally {
        setIsDeleting(false); // Reset loading state
      }
    }
  };

  return (
    <Card className="h-full w-full overflow-y-scroll">
      <CardHeader className="flex w-full flex-row items-center py-6 border-b border-gray-400 justify-between">
        <div className="flex gap-4 items-center">
          <CardTitle>Broadcast Chat</CardTitle>
        </div>
        <button
          onClick={deleteAllMessages}
          disabled={isDeleting}
          className={`text-sm ${
            isDeleting ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:underline"
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete All"}
        </button>
      </CardHeader>
      <CardContent>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </CardContent>
      <CardFooter className="w-full">
        <form onSubmit={sendMessage} className="relative w-full">
          <input
            type="text"
            value={messageInputValue}
            onChange={(e) => setMessageInputValue(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-3 pl-10 pr-10 text-sm bg-sidebar border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FiSend
            onClick={sendMessage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-gray-700 cursor-pointer"
            size={18}
          />
        </form>
      </CardFooter>
    </Card>
  );
};
