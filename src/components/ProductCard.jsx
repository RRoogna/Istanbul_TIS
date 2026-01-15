/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const imageTagClassesLoading =
    "w-[225px] md:w-[300px] h-[225px] t-cover transition-opacity opacity-0 ml-auto mr-auto";
  const imageTagClassesLoaded =
    "w-[225px] md:w-[300px] h-[225px] object-cover transition-opacity opacity-100 ml-auto mr-auto";

  const handleClick = () => {
    navigate(`/product/${product.data.id}`);
  };

  return (
    <div
      className="product-card text-center cursor-pointer hover:opacity-80 transition-opacity"
      data-cnstrc-item-id={product.data.id}
      data-cnstrc-item-name={product.value}
      data-cnstrc-item-variation-id={product.data?.variation_id}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      role="button"
      tabIndex={0}
    >
      <div className="mb-1 h-[225px]">
        <img
          className={imageTagClassesLoading}
          src={product.data.image_url}
          alt={product.value}
          onError={(event) => {
            event.target.style.display = "none";
          }}
          onLoad={(event) => {
            event.target.className = imageTagClassesLoaded;
          }}
        />
      </div>
      {product.value}
    </div>
  );
}

export default ProductCard;
