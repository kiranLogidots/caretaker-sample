import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
