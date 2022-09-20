import React from "react";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={`footer p-3 bg-neutral text-neutral-content ${className}`}></footer>
  );
};
