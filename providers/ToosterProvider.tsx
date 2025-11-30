"use client";

import { Toaster } from "react-hot-toast";

const ToosterProvider = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
};

export default ToosterProvider;
