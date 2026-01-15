/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cioClient from '../../app/cioClient';
import { useCart } from '../../context/CartContext';
import { loadStatuses } from '../../utils/constants';
import Loader from '../Loader';
import Recommendations from '../Recommendations';

function ProductPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loadStatus, setLoadStatus] = useState(loadStatuses.STALE);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadStatus(loadStatuses.LOADING);
      try {
        const response = await cioClient.browse.getBrowseResultsForItemIds([itemId]);
        const productData = response?.response?.results?.[0];

        if (productData) {
          setProduct(productData);
          setLoadStatus(loadStatuses.SUCCESS);
        } else {
          setLoadStatus(loadStatuses.FAILED);
        }
      } catch (e) {
        setLoadStatus(loadStatuses.FAILED);
      }
    };

    if (itemId) {
      fetchProduct();
    }
  }, [itemId]);

  const price = product?.data?.price;
  const salePrice = product?.data?.sale_price;
  const hasDiscount = salePrice && salePrice < price;
  const displayPrice = hasDiscount ? salePrice : price;

  if (loadStatus === loadStatuses.LOADING) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (loadStatus === loadStatuses.FAILED || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, we could not find the product you are looking for.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className="product-page"
      data-cnstrc-product-detail
      data-cnstrc-item-id={product.data?.id}
      data-cnstrc-item-name={product.value}
      data-cnstrc-item-variation-id={product.data?.variation_id}
      data-cnstrc-item-price={displayPrice}
    >
      <nav className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
        >
          ← Back to results
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-1/2">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img src={product.data?.image_url} alt={product.value} className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="lg:w-1/2">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.value}</h1>

          <div className="mb-6">
            {hasDiscount && (
              <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded mb-2">
                SALE
              </span>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">${displayPrice?.toFixed(2)}</span>
              {hasDiscount && <span className="text-xl text-gray-400 line-through">${price?.toFixed(2)}</span>}
            </div>
          </div>

          {product.data?.description && (
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">{product.data.description}</p>
            </div>
          )}

          <div className="space-y-3 mb-8">
            <button
              type="button"
              data-cnstrc-btn="add_to_cart"
              onClick={() => {
                addToCart(product);
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
              }}
              className={`w-full font-semibold py-4 px-6 rounded-lg ${
                addedToCart ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-lg border-2 border-gray-300"
            >
              View Cart ({cartCount})
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>
                <span className="font-medium">ID: </span>
                {product.data?.id}
              </li>
              {product.data?.brand && (
                <li>
                  <span className="font-medium">Brand: </span>
                  {product.data.brand}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Recommendations />
      </div>
    </div>
  );
}

export default ProductPage;
