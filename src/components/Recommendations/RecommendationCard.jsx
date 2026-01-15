import { useNavigate } from 'react-router-dom';

function RecommendationCard({ product }) {
  const navigate = useNavigate();
  const imageTagClassesLoading =
    'w-full h-[200px] object-cover transition-opacity opacity-0';
  const imageTagClassesLoaded =
    'w-full h-[200px] object-cover transition-opacity opacity-100';

  const handleClick = () => {
    navigate(`/product/${product.data.id}`);
  };

  const price = product.data?.price;
  const salePrice = product.data?.sale_price;
  const hasDiscount = salePrice && salePrice < price;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="recommendation-card cursor-pointer group"
      data-cnstrc-item="recommendation"
      data-cnstrc-item-id={product.data.id}
      data-cnstrc-item-name={product.value}
      data-cnstrc-item-variation-id={product.data?.variation_id}
      data-cnstrc-strategy-id={product.strategy?.id}
    >
      <div className="bg-stone-100 rounded-xl overflow-hidden mb-3 aspect-square">
        <img
          className={imageTagClassesLoading}
          src={product.data.image_url}
          alt={product.value}
          onError={(event) => {
            event.target.style.display = 'none';
          }}
          onLoad={(event) => {
            event.target.className = imageTagClassesLoaded;
          }}
        />
      </div>
      <div className="px-1">
        <p className="text-stone-800 text-sm font-medium line-clamp-2 group-hover:text-stone-600 transition-colors mb-1">
          {product.value}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-stone-900 font-semibold">
            ${hasDiscount ? salePrice?.toFixed(2) : price?.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-stone-400 text-sm line-through">
              ${price?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecommendationCard;
