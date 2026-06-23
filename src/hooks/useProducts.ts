import { useState, useEffect, useCallback } from "react";
import type { Product, ApiResponse } from "../types";

const PRODUCTS_API_URL = 'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json';

const useProduct = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try{
            setLoading(true);
            setError(null);

            const response = await fetch(PRODUCTS_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
                const data: ApiResponse = await response.json();
                const processedProducts = data.map(product =>({
                    ...product,
                    inStock: true,
                    description: product.description || `Свежие ${product.name.toLowerCase()}`
                }));

                setProducts(processedProducts);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                const errorMessage = err instanceof Error
                ? `Ошибка загрузки товаров: ${err.message}`
                : 'Произошла неизвестная ошибка при загрузке товаров';
            setError(errorMessage);
            setProducts([]);
            } finally {
                setLoading(false);
            }
        }, []);

        useEffect(() => {
            fetchProducts();
        }, [fetchProducts]);
    
        return {
            products,
            loading,
            error,
            refetch: fetchProducts 
        };
};

export default useProduct;