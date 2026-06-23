import { useState, useEffect, useCallback } from 'react'
import type { CartItem, CartState } from '../types' 


const useCart = () => {
    
    const [cart, setCart] = useState<CartState>(() => {
        const savedCart = localStorage.getItem('vegetable-cart');
        return savedCart ? JSON.parse(savedCart) : {
            items: [],
            totalQuantity: 0,
            totalPrice: 0,
        };
    });

    useEffect(() => {
        localStorage.setItem('vegetable-cart', JSON.stringify(cart));
        }, [cart]);

    const addToCart = useCallback((
        item: Omit<CartItem, 'quantity'>,
        quantity: number = 1
    ) => {
        setCart(prev => {
            const existingItemIndex = prev.items.findIndex(i => i.id === item.id);
            const updatedItems = [...prev.items];
            if (existingItemIndex >= 0) {
            updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex],
                quantity: updatedItems[existingItemIndex].quantity + quantity
            };
            } else {
                updatedItems.push({
                    ...item,
                    quantity
                });
            }
            const totalQuantity = updatedItems.reduce(
                (sum, item) => sum + item.quantity, 0
            );

            const totalPrice = updatedItems.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );

            return {
                items: updatedItems,
                totalQuantity,
                totalPrice
            };
        });
    
    }, []);

     const removeFromCart = useCallback((id: number) => {
        setCart(prev => {
            const updatedItems = prev.items.filter(item => item.id !== id);
            const totalQuantity = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            const totalPrice = updatedItems.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );

            return {
                items: updatedItems,
                totalQuantity,
                totalPrice
            };
        });
    }, []);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
               
        setCart(prev => {
            const updatedItems = prev.items.map(item => item.id === id ? {
                ...item, quantity
            } : item);
            
            const totalQuantity = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            const totalPrice = updatedItems.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );

            return {
                items: updatedItems,
                totalQuantity,
                totalPrice
            };
        });
    }, [removeFromCart]);

   
        const clearCart = useCallback(() => {
            setCart({
                items: [],
                totalQuantity: 0,
                totalPrice: 0
            });
        }, []);

        return {
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart
        };
    
    }

export default useCart;