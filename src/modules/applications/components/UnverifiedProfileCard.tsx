import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { VerifiedBeauticians } from "@/models";


const ProfileCard: React.FC<{ beautician: VerifiedBeauticians }> = ({ beautician }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Personal Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center">
          <Avatar
            className="h-auto w-[50%] rounded-full object-contain cursor-pointer"
            onClick={handleModalToggle} // Toggle modal on click
          >
            <AvatarImage
              src={beautician.user?.profilePictureUrl || "/default-avatar.png"}
              alt={beautician.user?.name}
            />
            <AvatarFallback>
              {beautician.user?.name
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <p className="font-semibold md:text-4xl text-3xl">{beautician.user?.name}</p>
            <p className="text-muted-foreground text-md md:text-xl">{beautician.user?.email}</p>
            {beautician.user?.bio && <p className="text-sm mt-1">{beautician.user?.bio}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Modal for Full-Screen Image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={handleModalToggle} // Close modal when clicking outside the image
        >
          <div className="relative">
            <img
              src={beautician.user?.profilePictureUrl || "/default-avatar.png"}
              alt={beautician.user?.name}
              className="max-w-full max-h-screen rounded-md"
            />
            <button
              onClick={handleModalToggle}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              <IoCloseCircle/>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;