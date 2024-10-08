"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const onClick = () => {
    signOut();
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LogoutButton;
