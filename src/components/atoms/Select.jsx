const Select = ({ className = '', children, ...props }) => {
  return (
    <select
      className={`px-3 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
export default Select;