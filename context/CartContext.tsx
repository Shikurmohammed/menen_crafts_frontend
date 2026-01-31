'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    artisan: string;
}

interface CartContextType {
    items: CartItem[];
    total: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('menen_cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setItems(parsedCart.items || []);
            setTotal(parsedCart.total || 0);
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('menen_cart', JSON.stringify({ items, total }));
    }, [items, total]);

    const addToCart = (item: CartItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);

            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                return [...prevItems, item];
            }
        });

        setTotal(prevTotal => prevTotal + (item.price * item.quantity));
    };

    const removeFromCart = (itemId: string) => {
        setItems(prevItems => {
            const item = prevItems.find(i => i.id === itemId);
            if (item) {
                setTotal(prevTotal => prevTotal - (item.price * item.quantity));
            }
            return prevItems.filter(i => i.id !== itemId);
        });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.id === itemId) {
                    const oldTotal = item.price * item.quantity;
                    const newTotal = item.price * quantity;
                    setTotal(prevTotal => prevTotal - oldTotal + newTotal);
                    return { ...item, quantity };
                }
                return item;
            });
            return updatedItems;
        });
    };

    const clearCart = () => {
        setItems([]);
        setTotal(0);
    };

    const getCartCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            items,
            total,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};