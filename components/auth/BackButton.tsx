"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export const BackButton = ({
  href,
  label,
}: Readonly<{
  href: string;
  label: string;
}>) => {
  return (
    <Button
      size={"sm"}
      onClick={() => {}}
      variant="link"
      className="w-full font-normal"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
