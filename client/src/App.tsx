import { useEffect } from "react";
import { Switch, Route } from "wouter";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import NotFoundPage from "./pages/NotFoundPage";
import PolicyPage from "./pages/PolicyPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DiscountsPage from "./pages/DiscountsPage";
import ArticlePage from "./pages/ArticlePage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import QuickViewModal from "./components/QuickViewModal";
import CartNotification from "./components/CartNotification";
import WishlistNotification from "./components/WishlistNotification";
import EasterEgg from "./components/EasterEgg";
import { useCart } from "./hooks/useCart";
import { ProductProvider } from "./context/ProductContext";
import { NotificationProvider } from "./components/ui/NotificationManager";
import { Toaster } from "./components/ui/toaster";

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
    <NotificationProvider>
      <ProductProvider>
        <div className="min-h-screen grid-background flex flex-col">
          <Navbar />
          <main className="mt-20 flex-grow">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/products" component={ProductListingPage} />
              <Route path="/product/:id" component={ProductDetailsPage} />
              <Route path="/cart" component={CartPage} />
              <Route path="/checkout" component={CheckoutPage} />
              <Route path="/wishlist" component={WishlistPage} />
              <Route path="/policy/:type" component={PolicyPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/discounts" component={DiscountsPage} />
              <Route path="/article/:id" component={ArticlePage} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/:rest*" component={NotFoundPage} />
            </Switch>
          </main>
          <Footer />
          <Cart />
          <QuickViewModal />
          <CartNotification />
          <WishlistNotification />
          <EasterEgg />
          <Toaster />
        </div>
      </ProductProvider>
    </NotificationProvider>
  );
}

export default App;
