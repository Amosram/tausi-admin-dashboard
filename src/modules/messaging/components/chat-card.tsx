import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { FiPaperclip, FiSend } from "react-icons/fi";

export const ChatCard = () => {
  return (
    <Card className="h-full w-full">
      <CardHeader className="flex w-full flex-row items-center py-6 border-b border-gray-400 justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-white rounded-full" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-300 rounded-full" />
              <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </div>
        </div>
        <MoreVertical className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter className="w-full">
        <div className="flex items-center gap-2 p-2 w-full">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-3 pl-10 pr-10 text-sm bg-sidebar border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary focus:outline-none cursor-pointer">
              <FiPaperclip size={18} />
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-gray-700 cursor-pointer">
              <FiSend size={18} />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
