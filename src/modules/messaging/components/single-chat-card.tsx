import { auth, firestore, storage } from "@/app/firebase";
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
  where,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState, useRef } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { ChatMessage } from "./chat-message";
import { FaChevronLeft } from "react-icons/fa";
import { useActiveComponentContext } from "../context";

interface SingleChatCardProps {
  recipientId: string;
  component: React.ReactNode;
}

export const SingleChatCard: React.FC<SingleChatCardProps> = ({
  recipientId,
  component,
}) => {
  const messagesRef = collection(firestore, "chats");
  const [messages, setMessages] = useState([]);
  const [messageInputValue, setMessageInputValue] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const { changeActiveComponent } = useActiveComponentContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const chatQuery = query(messagesRef, where("recipient", "==", recipientId));

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const chatMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(chatMessages);
    });

    return () => unsubscribe();
  }, [recipientId]);

  const uploadAttachment = async (file: File) => {
    if (!file) return null;

    try {
      const { uid } = auth.currentUser!;
      const storageRef = ref(
        storage,
        `chats/${uid}/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return {
        url: downloadURL,
        name: file.name,
        type: file.type,
        size: file.size,
      };
    } catch (error) {
      console.error("Error uploading attachment: ", error);
      return null;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInputValue.trim() && attachments.length === 0) return;

    const { uid, displayName, photoURL } = auth.currentUser!;

    // Upload attachments first
    const attachmentURLs = await Promise.all(attachments.map(uploadAttachment));

    const newMessage = {
      text: messageInputValue,
      createdAt: serverTimestamp(),
      sender: uid,
      senderName: displayName || "Unknown",
      senderAvatar: photoURL || "",
      recipient: recipientId,
      read: false,
      messageType:
        attachments.length > 0
          ? attachments[0].type.startsWith("image/")
            ? "image"
            : attachments[0].type.startsWith("video/")
            ? "video"
            : attachments[0].type.startsWith("audio/")
            ? "audio"
            : "text"
          : "text",
      attachments: attachmentURLs.filter(Boolean),
      reactions: {},
    };

    try {
      await addDoc(messagesRef, newMessage);
      setMessageInputValue("");
      setAttachments([]); // Clear attachments after sending
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      // Limit to 5 attachments
      setAttachments(fileList.slice(0, 5));
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);

    // Reset file input if no files left
    if (newAttachments.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader className="flex w-full flex-row items-center py-6 border-b border-gray-400 justify-between">
        <CardTitle>
          <button
            onClick={() => changeActiveComponent(component)}
            className="hover:underline flex items-center gap-2"
          >
            <FaChevronLeft size={16} />
            Chat with User {recipientId}
          </button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-4 py-4 overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </CardContent>

      {attachments.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative bg-gray-100 rounded-md p-2 flex items-center"
            >
              <span className="mr-2 text-sm truncate max-w-[150px]">
                {file.name}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <CardFooter className="w-full">
        <form
          onSubmit={sendMessage}
          className="relative w-full flex items-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            className="hidden"
            max-size="10485760" // 10MB max file size
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mr-2 text-primary hover:text-gray-700"
          >
            <FiPaperclip size={18} />
          </button>

          <input
            type="text"
            value={messageInputValue}
            onChange={(e) => setMessageInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 pl-10 pr-10 text-sm bg-sidebar border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
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
