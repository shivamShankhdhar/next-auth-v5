import React from "react";

import { Header } from "./header";

import { BackButton } from "./BackButton";

import { Card, CardFooter, CardHeader } from "../ui/card";
import { CardWrapper } from "./CardWrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backBttonLabel="Back to Login"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="h-10 w-10 text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
