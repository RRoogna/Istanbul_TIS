/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Browse from './components/Browse';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import ProductPage from './components/ProductPage';
import Search from './components/Search/Search';
import { CartProvider } from './context/CartContext';
import Layout from './Layout';

function App() {
  return (
    <CartProvider>
      <div className="App p-5 max-w-lg sm:max-w-7xl mx-auto">
        <Routes>
          <Route path="*" element={<Layout />}>
            <Route path="search" element={<Search />} />
            <Route path="browse" element={<Browse />}>
              <Route path=":groupId" element={<Browse />} />
            </Route>
            <Route path="product/:itemId" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          </Route>
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
