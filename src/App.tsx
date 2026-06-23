import { AppShell, Container } from '@mantine/core'
import Header from './components/Header/Header'
import { ProductGrid } from './components/ProductGrid/ProductGrid'
import useProducts from './hooks/useProducts';
import useCart from './hooks/useCart';
import './styles/global.css';
import type { Product } from './types';

function App() {
  const {
    products,
    loading,
    error,
    refetch
  } = useProducts();

  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart
  } = useCart();

  const handleAddToCart = (product: Product, quantity: number) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      currency: product.currency
    };
    addToCart(cartItem, quantity); 
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveFromCart = (id: number) => {
    removeFromCart(id);
  };

  return (
    <AppShell
      padding='md'
      header={{ height: 60 }}
      >
        <AppShell.Header>
          <Header
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            />
        </AppShell.Header>
        <AppShell.Main>
      <Container size='xl' pt={20}>
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onAddToCart={handleAddToCart}
          onRetry={refetch}
          />
      </Container>
      </AppShell.Main>
    </AppShell>  
  );

}
 
export default App;
