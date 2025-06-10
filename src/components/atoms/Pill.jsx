const Pill = ({ children, className = '' }) => {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${className}`}>
      {children}
    </span>
  );
};
export default Pill;