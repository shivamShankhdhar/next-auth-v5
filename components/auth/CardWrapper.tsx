"use client";

import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { BackButton } from "./BackButton";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backBttonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backBttonLabel,
  backButtonHref,
  showSocial = true,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backBttonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
