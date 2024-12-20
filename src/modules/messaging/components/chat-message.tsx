import React, { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { auth, firestore } from "@/app/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDoc, doc } from "firebase/firestore";
import { ChatItemProps } from "../types";
import { FaFile, FaImage, FaMusic, FaVideo } from "react-icons/fa";

interface Attachment {
  url: string;
  name: string;
  type: string;
  size: number;
}

export const ChatMessage: React.FC<{ message: ChatItemProps }> = ({
  message,
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  console.log(message);

  const { text, sender, senderAvatar, senderName, id, createdAt, attachments } =
    message;

  const handleDelete = async () => {
    if (!id) {
      console.error("Message ID is undefined. Cannot delete.");
      return;
    }
    if (confirm("Are you sure you want to delete this message?")) {
      const messageRef = doc(firestore, "chats", id);
      await deleteDoc(messageRef);
    }
  };

  const isSentByCurrentUser = sender === auth.currentUser?.uid;

  const renderAttachmentIcon = (type: string) => {
    if (type.startsWith("image/")) return <FaImage />;
    if (type.startsWith("video/")) return <FaVideo />;
    if (type.startsWith("audio/")) return <FaMusic />;
    return <FaFile />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderAttachments = (attachments: Attachment[]) => {
    return (
      <div
        className={`flex flex-wrap gap-2 mt-2 ${
          isSentByCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className={`
              flex items-center p-2 rounded-md 
              ${isSentByCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"}
            `}
          >
            <div className="mr-2">{renderAttachmentIcon(attachment.type)}</div>
            <div className="flex flex-col">
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate max-w-[200px]"
              >
                {attachment.name}
              </a>
              <span className="text-xs">{formatFileSize(attachment.size)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMediaAttachment = (attachments: Attachment[]) => {
    if (!attachments || attachments.length === 0) return null;

    const mediaAttachment = attachments[0];

    if (mediaAttachment.type.startsWith("image/")) {
      return (
        <div
          className={`mt-2 max-w-[300px] ${
            isSentByCurrentUser ? "ml-auto" : ""
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img
            src={mediaAttachment.url}
            alt={mediaAttachment.name}
            width={isExpanded ? 600 : 300}
            height={isExpanded ? 600 : 300}
            className={`
              rounded-lg cursor-pointer 
              transition-all duration-300 ease-in-out
              ${isSentByCurrentUser ? "ml-auto" : ""}
            `}
            style={{
              objectFit: "cover",
              maxHeight: isExpanded ? "600px" : "300px",
            }}
          />
        </div>
      );
    }

    if (mediaAttachment.type.startsWith("video/")) {
      return (
        <video
          controls
          className={`mt-2 max-w-[300px] rounded-lg ${
            isSentByCurrentUser ? "ml-auto" : ""
          }`}
        >
          <source src={mediaAttachment.url} type={mediaAttachment.type} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (mediaAttachment.type.startsWith("audio/")) {
      return (
        <audio
          controls
          className={`mt-2 ${isSentByCurrentUser ? "ml-auto" : ""}`}
        >
          <source src={mediaAttachment.url} type={mediaAttachment.type} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    return null;
  };

  // Safe type checking function
  const isMediaType = (attachment?: Attachment) => {
    if (!attachment || !attachment.type) return false;
    return /^(image|video|audio)\//.test(attachment.type);
  };

  // Safe type checking function for non-media attachments
  const isNonMediaType = (attachment?: Attachment) => {
    if (!attachment || !attachment.type) return false;
    return !/^(image|video|audio)\//.test(attachment.type);
  };

  return (
    <div
      className={`flex items-end gap-2 mb-4 ${
        isSentByCurrentUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* User Avatar */}
      {!isSentByCurrentUser && senderAvatar && (
        <img
          src={senderAvatar}
          alt={`${senderName}'s avatar`}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      {/* Message Container */}
      <div
        className={`relative max-w-[70%] p-3 rounded-lg flex-col ${
          isSentByCurrentUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        {/* Sender Name for received messages */}
        {!isSentByCurrentUser && (
          <div className="font-semibold text-sm mb-1">{senderName}</div>
        )}

        <div className="flex items-center gap-2 mb-2">
          {text && <p className="break-words">{text}</p>}
          {isSentByCurrentUser && (
            <DropdownMenu open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-blue-600">
                  <MoreVertical size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="flex flex-col p-1 bg-white shadow-md rounded-md"
                align="end"
                sideOffset={8}
              >
                <DropdownMenuItem
                  className="flex items-center text-red-500 hover:bg-red-50 p-2 cursor-pointer"
                  onSelect={handleDelete}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {attachments &&
          attachments.some(isMediaType) &&
          renderMediaAttachment(attachments.filter(isMediaType))}

        {attachments &&
          attachments.some(isNonMediaType) &&
          renderAttachments(attachments.filter(isNonMediaType))}

        {createdAt && (
          <span
            className={`text-xs mt-2 block ${
              isSentByCurrentUser ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {createdAt instanceof Date
              ? createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : createdAt.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </span>
        )}
      </div>
    </div>
  );
};
