// 상품 리스트 : 아이템
const ItemDetails = ({
  text,
  children,
  fontSize = "16",
  color = "semiblack",
  bold = false,
  mb = "12",
  mr = false,
  inline = false,
  overflow = false,
}) => {
  const itemClassName = `
    detail-list__${fontSize} 
    detail-list__${color} 
    ${bold ? "detail-list__bold" : ""} 
    detail-list__mb-${mb}
    ${mr ? "detail-list__mr-4" : ""} 
    ${inline ? "detail-list__inline" : ""} 
    ${overflow ? "detail-list__overflow" : ""} 
  `.trim();

  return (
    <li className={itemClassName}>
      {text}
      {children}
    </li>
  );
};

export default ItemDetails;
