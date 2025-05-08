"use client";

import { UserButton as ClerkUserButton } from "@clerk/nextjs";

const UserProfileButton = () => {
  return (
    <ClerkUserButton 
      appearance={{
        elements: {
          userButtonAvatarBox: "h-8 w-8 border-2 border-primary/30",
          userButtonTrigger: "focus:shadow-none hover:opacity-80 transition-opacity"
        }
      }}
    />
  );
};

export default UserProfileButton; 