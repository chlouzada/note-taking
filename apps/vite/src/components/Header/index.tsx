export const Header = ({ className }: { className?: string }) => {
  return (
    <header
      className={`flex items-center justify-between px-4 py-3 bg-gray-800 text-white ${className}`}
    >
      Note Taking
    </header>
  );
};
