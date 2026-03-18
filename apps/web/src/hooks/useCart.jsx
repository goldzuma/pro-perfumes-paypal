
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'e-commerce-cart';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems || []));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }, [cartItems]);

  const getValidCartItems = useCallback(() => {
    if (!cartItems || !Array.isArray(cartItems)) {
      return [];
    }
    
    return cartItems.filter(item => {
      const hasId = item && (item.id || item.variant?.id || item.product?.id);
      const hasPrice = item && (item.price !== undefined || item.variant?.price_in_cents !== undefined || item.product?.price !== undefined);
      const hasQuantity = item && typeof item.quantity === 'number' && item.quantity > 0;
      return hasId && hasPrice && hasQuantity;
    });
  }, [cartItems]);

  const validateCart = useCallback(() => {
    const validItems = getValidCartItems();
    return validItems.length > 0;
  }, [getValidCartItems]);

  const addToCart = useCallback((product, variant, quantity, availableQuantity) => {
    return new Promise((resolve, reject) => {
      if (variant?.manage_inventory) {
        const existingItem = (cartItems || []).find(item => item.variant?.id === variant.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        if ((currentCartQuantity + quantity) > availableQuantity) {
          const error = new Error(`Estoque insuficiente para ${product.title || product.name}. Apenas ${availableQuantity} disponíveis.`);
          reject(error);
          return;
        }
      }

      setCartItems(prevItems => {
        const safePrevItems = Array.isArray(prevItems) ? prevItems : [];
        const productId = variant?.id || product.id;
        
        const existingItemIndex = safePrevItems.findIndex(item => 
          (item.variant?.id && item.variant.id === productId) || 
          (item.id && item.id === productId) ||
          (item.product?.id && item.product.id === productId)
        );

        if (existingItemIndex >= 0) {
          const newItems = [...safePrevItems];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity
          };
          return newItems;
        }

        return [...safePrevItems, { 
          id: product.id,
          name: product.name || product.title,
          price: product.price,
          image: product.image || (product.image_urls && product.image_urls[0]),
          product, 
          variant, 
          quantity 
        }];
      });
      resolve();
    });
  }, [cartItems]);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prevItems => {
      const safePrevItems = Array.isArray(prevItems) ? prevItems : [];
      return safePrevItems.filter(item => 
        item.id !== itemId && item.variant?.id !== itemId && item.product?.id !== itemId
      );
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) return;
    setCartItems(prevItems => {
      const safePrevItems = Array.isArray(prevItems) ? prevItems : [];
      return safePrevItems.map(item =>
        (item.id === itemId || item.variant?.id === itemId || item.product?.id === itemId)
          ? { ...item, quantity } 
          : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    const validItems = getValidCartItems();
    
    if (validItems.length === 0) return 0;

    const total = validItems.reduce((sum, item) => {
      let itemPrice = 0;
      
      if (item.price !== undefined && item.price !== null) {
        itemPrice = parseFloat(item.price);
      } else if (item.variant?.sale_price_in_cents !== undefined && item.variant?.sale_price_in_cents !== null) {
        itemPrice = parseFloat(item.variant.sale_price_in_cents) / 100;
      } else if (item.variant?.price_in_cents !== undefined && item.variant?.price_in_cents !== null) {
        itemPrice = parseFloat(item.variant.price_in_cents) / 100;
      } else if (item.product?.price !== undefined && item.product?.price !== null) {
        itemPrice = parseFloat(item.product.price);
      }

      if (isNaN(itemPrice)) itemPrice = 0;
      
      const itemTotal = itemPrice * item.quantity;
      return sum + itemTotal;
    }, 0);

    return Number(total) || 0;
  }, [getValidCartItems]);

  const value = useMemo(() => ({
    cartItems: Array.isArray(cartItems) ? cartItems : [],
    getValidCartItems,
    validateCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  }), [cartItems, getValidCartItems, validateCart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
