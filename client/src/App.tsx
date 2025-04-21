import { useEffect } from "react";
import { Switch, Route } from "wouter";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import QuickViewModal from "./components/QuickViewModal";
import EasterEgg from "./components/EasterEgg";
import { useCart } from "./hooks/useCart";

function App() {
  const { isCartOpen } = useCart();

  // Disable scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  return (
    <div className="min-h-screen grid-background flex flex-col">
      <Navbar />
      <main className="mt-20 flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/products" component={ProductListingPage} />
          <Route path="/product/:id" component={ProductDetailsPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/:rest*" component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
      <Cart />
      <QuickViewModal />
      <EasterEgg />
    </div>
  );
}

export default App;
