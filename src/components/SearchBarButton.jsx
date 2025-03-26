const SearchBarButton = ({
  id,
  value,
  className: customClassName,
  type = "button",
  onClick = () => {},
  children,
  icon,
  iconPosition = "left",
  isIconOnly,
  disabled = false,
  color = "primary",
  width,
  height,
  padding,
  margin,
  size = "medium",
}) => {
  const className = `
  searchbutton 
  searchbutton--${size} 
  searchbutton--${color}
  ${isIconOnly ? "searchbutton--icon-only" : ""}
  ${customClassName || ""}
`.trim();

  return (
    <button
      id={id}
      value={value}
      type={type} // submit, reset 활용 시 사용
      onClick={onClick} // 커스텀 onClick함수 선언 후 사용
      disabled={disabled}
      className={className}
      style={{ color, width, height, padding, margin }}
    >
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </button>
  );
};

export default SearchBarButton;
