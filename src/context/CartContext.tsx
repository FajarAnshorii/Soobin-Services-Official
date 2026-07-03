'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  category: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalPrice: string;
  status: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CartContextType {
  cart: CartItem[];
  orderHistory: Order[];
  guestId: string;
  toasts: Toast[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  placeOrder: (items: CartItem[]) => void;
  placeDirectOrder: (serviceName: string) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [guestId, setGuestId] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 1. Initialize guest ID
  useEffect(() => {
    let storedGuestId = localStorage.getItem('soobin_guest_id');
    if (!storedGuestId) {
      storedGuestId = Math.floor(1000 + Math.random() * 9000).toString();
      localStorage.setItem('soobin_guest_id', storedGuestId);
    }
    setGuestId(storedGuestId);
  }, []);

  // 2. Load user-specific cart & history when logged in
  useEffect(() => {
    if (user) {
      // Load cart
      const savedCart = localStorage.getItem(`soobin_cart_${user.email}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }

      // Load order history
      const savedHistory = localStorage.getItem(`soobin_orders_${user.email}`);
      if (savedHistory) {
        setOrderHistory(JSON.parse(savedHistory));
      } else {
        setOrderHistory([]);
      }
    } else {
      setCart([]);
      setOrderHistory([]);
    }
  }, [user]);

  // 3. Save cart to localStorage
  const saveCartToStorage = (newCart: CartItem[]) => {
    if (user) {
      localStorage.setItem(`soobin_cart_${user.email}`, JSON.stringify(newCart));
    }
  };

  // 4. Save history to localStorage
  const saveHistoryToStorage = (newHistory: Order[]) => {
    if (user) {
      localStorage.setItem(`soobin_orders_${user.email}`, JSON.stringify(newHistory));
    }
  };

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addToCart = (item: CartItem) => {
    if (!user) {
      addToast('Silakan login terlebih dahulu untuk menambah ke keranjang!', 'warning');
      return;
    }

    const alreadyInCart = cart.some((cartItem) => cartItem.id === item.id);
    if (alreadyInCart) {
      addToast(`${item.name} sudah ada di keranjang!`, 'info');
      return;
    }

    const updatedCart = [...cart, item];
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
    addToast(`${item.name} berhasil ditambahkan ke keranjang!`, 'success');
  };

  const removeFromCart = (itemId: number) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
    addToast('Layanan dihapus dari keranjang!', 'info');
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`soobin_cart_${user.email}`);
    }
  };

  const placeOrder = (items: CartItem[]) => {
    if (items.length === 0) return;

    const newOrder: Order = {
      id: `SB-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items,
      totalPrice: items.reduce((acc, curr) => {
        if (curr.price.includes('Rp')) {
          const num = parseInt(curr.price.replace(/[^0-9]/g, ''));
          return acc + num;
        }
        return acc;
      }, 0) > 0 ? `Rp ${items.reduce((acc, curr) => {
        if (curr.price.includes('Rp')) {
          const num = parseInt(curr.price.replace(/[^0-9]/g, ''));
          return acc + num;
        }
        return acc;
      }, 0).toLocaleString('id-ID')}` : 'Hubungi Admin',
      status: 'Sedang Diproses'
    };

    if (user) {
      const updatedHistory = [newOrder, ...orderHistory];
      setOrderHistory(updatedHistory);
      saveHistoryToStorage(updatedHistory);

      // Trigger user order notification
      items.forEach((item) => {
        addToast(`User ${user.name} telah memesan jasa ${item.name}`, 'success');
      });
    } else {
      // Guest ordering
      items.forEach((item) => {
        addToast(`Guest #${guestId} telah memesan jasa ${item.name}`, 'success');
      });
    }
  };

  const placeDirectOrder = (serviceName: string) => {
    const directItem: CartItem = {
      id: Math.floor(Math.random() * 1000000),
      name: serviceName,
      price: 'WhatsApp Order',
      category: 'Direct'
    };

    // If logged in, add to order history
    if (user) {
      const newOrder: Order = {
        id: `SB-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        items: [directItem],
        totalPrice: 'WhatsApp Order',
        status: 'Hubungi WhatsApp'
      };

      const updatedHistory = [newOrder, ...orderHistory];
      setOrderHistory(updatedHistory);
      saveHistoryToStorage(updatedHistory);

      addToast(`User ${user.name} telah memesan jasa ${serviceName}`, 'success');
    } else {
      addToast(`Guest #${guestId} telah memesan jasa ${serviceName}`, 'success');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orderHistory,
        guestId,
        toasts,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        placeDirectOrder,
        addToast
      }}
    >
      {children}

      {/* Cybercom682 Toast Notification Overlay */}
      <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 max-w-sm w-full px-4 md:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isInfo = toast.type === 'info';
            const isWarning = toast.type === 'warning';
            const isError = toast.type === 'error';

            let bgColor = 'bg-green-100 dark:bg-green-950 border-green-500';
            let textColor = 'text-green-900 dark:text-green-100';
            let iconColor = 'text-green-600';
            let hoverBg = 'hover:bg-green-200 dark:hover:bg-green-900';

            if (isInfo) {
              bgColor = 'bg-blue-100 dark:bg-blue-950 border-blue-500';
              textColor = 'text-blue-900 dark:text-blue-100';
              iconColor = 'text-blue-600';
              hoverBg = 'hover:bg-blue-200 dark:hover:bg-blue-900';
            } else if (isWarning) {
              bgColor = 'bg-yellow-100 dark:bg-yellow-950 border-yellow-500';
              textColor = 'text-yellow-900 dark:text-yellow-100';
              iconColor = 'text-yellow-600';
              hoverBg = 'hover:bg-yellow-200 dark:hover:bg-yellow-900';
            } else if (isError) {
              bgColor = 'bg-red-100 dark:bg-red-950 border-red-500';
              textColor = 'text-red-900 dark:text-red-100';
              iconColor = 'text-red-600';
              hoverBg = 'hover:bg-red-200 dark:hover:bg-red-900';
            }

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                layout
                role="alert"
                className={`border-l-4 p-3 rounded-lg flex items-center shadow-lg transition duration-300 ease-in-out transform hover:scale-102 ${bgColor} ${textColor} ${hoverBg}`}
              >
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-5 w-5 shrink-0 mr-2 ${iconColor}`}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
                <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
