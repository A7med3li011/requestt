import avatar from "../../../assets/images/Avatar.jpg";
export const Image = ({ src, alt, className, width, height }) => {
  return (
    <img
      src={`https://api.request-sa.com/${src}` || avatar}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  );
};
