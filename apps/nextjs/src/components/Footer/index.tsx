import React from "react";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <div
      className={`footer p-3 bg-neutral text-neutral-content ${className}`}
    ></div>
  );
};
