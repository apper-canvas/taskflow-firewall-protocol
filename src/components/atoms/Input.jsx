const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-3 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${className}`}
      {...props}
    />
  );
};
export default Input;