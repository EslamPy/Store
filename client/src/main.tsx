import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/globals.css";
import AOSInitializer from "./components/AOSInitializer";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// The AOSInitializer component will handle AOS initialization

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <AOSInitializer />
            <App />
            <Toaster />
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
