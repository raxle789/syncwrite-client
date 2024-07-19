"use client";
import React from "react";
import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <LoaderCircle className="text-primary animate-spin" size={50} />
    </div>
  );
};

export default Loading;
