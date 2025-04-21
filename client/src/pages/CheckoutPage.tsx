import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '../hooks/useCart';
import { useToast } from '@/hooks/use-toast';

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review';

const CheckoutPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    phone: '',
    
    // Shipping Information
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment Information
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    
    // Other
    saveInfo: false,
    specialInstructions: '',
  });
  
  useEffect(() => {
    document.title = 'Checkout - MedTech';
    
    // Check if cart is empty and redirect to cart page
    if (cartItems.length === 0) {
      setLocation('/cart');
      toast({
        title: 'Your cart is empty',
        description: 'Please add items to your cart before proceeding to checkout.',
        variant: 'destructive'
      });
    }
    
    // Reinitialize AOS
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, [cartItems.length, setLocation, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 'information') {
      if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast({
          title: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        toast({
          title: 'Please fill in all payment information',
          variant: 'destructive'
        });
        return;
      }
      setCurrentStep('review');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('information');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: 'Order placed successfully!',
        description: 'Thank you for your purchase.',
      });
      
      // Clear cart and redirect to home
      clearCart();
      setLocation('/');
    }, 2000);
  };
  
  const getStepIndicatorClass = (step: CheckoutStep) => {
    const steps: { [key in CheckoutStep]: number } = {
      'information': 1,
      'shipping': 2,
      'payment': 3,
      'review': 4
    };
    
    const currentStepNumber = steps[currentStep];
    const stepNumber = steps[step];
    
    if (stepNumber < currentStepNumber) {
      return 'bg-[#0bff7e] text-black';
    } else if (stepNumber === currentStepNumber) {
      return 'bg-[#00b3ff] text-black';
    } else {
      return 'bg-[#2d2d2d] text-white';
    }
  };
  
  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const shipping = 0;
  const total = subtotal + tax + shipping;
  
  return (
    <div className="py-16 bg-[#121212]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-white">Checkout</h1>
          <Link href="/cart">
            <a className="text-[#00b3ff] hover:underline flex items-center">
              <i className="fas fa-arrow-left mr-2"></i> Back to Cart
            </a>
          </Link>
        </div>
        
        {/* Checkout Progress */}
        <div className="mb-8 hidden md:block">
          <div className="flex justify-between">
            <div className={`flex flex-col items-center ${currentStep === 'information' ? 'text-[#00b3ff]' : currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'review' ? 'text-[#0bff7e]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold ${getStepIndicatorClass('information')}`}>1</div>
              <span className="text-sm">Information</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'review' ? 'bg-[#0bff7e]' : 'bg-[#2d2d2d]'}`}></div>
            </div>
            
            <div className={`flex flex-col items-center ${currentStep === 'shipping' ? 'text-[#00b3ff]' : currentStep === 'payment' || currentStep === 'review' ? 'text-[#0bff7e]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold ${getStepIndicatorClass('shipping')}`}>2</div>
              <span className="text-sm">Shipping</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${currentStep === 'payment' || currentStep === 'review' ? 'bg-[#0bff7e]' : 'bg-[#2d2d2d]'}`}></div>
            </div>
            
            <div className={`flex flex-col items-center ${currentStep === 'payment' ? 'text-[#00b3ff]' : currentStep === 'review' ? 'text-[#0bff7e]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold ${getStepIndicatorClass('payment')}`}>3</div>
              <span className="text-sm">Payment</span>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${currentStep === 'review' ? 'bg-[#0bff7e]' : 'bg-[#2d2d2d]'}`}></div>
            </div>
            
            <div className={`flex flex-col items-center ${currentStep === 'review' ? 'text-[#00b3ff]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold ${getStepIndicatorClass('review')}`}>4</div>
              <span className="text-sm">Review</span>
            </div>
          </div>
        </div>
        
        {/* Current Step (for mobile) */}
        <div className="bg-[#1e1e1e] rounded-lg p-4 mb-6 md:hidden">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold ${getStepIndicatorClass(currentStep)}`}>
              {currentStep === 'information' ? 1 : currentStep === 'shipping' ? 2 : currentStep === 'payment' ? 3 : 4}
            </div>
            <span className="font-orbitron text-white">
              {currentStep === 'information' ? 'Information' : 
               currentStep === 'shipping' ? 'Shipping' : 
               currentStep === 'payment' ? 'Payment' : 'Review'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <form onSubmit={handleSubmitOrder}>
                {/* Information Step */}
                {currentStep === 'information' && (
                  <div data-aos="fade-up">
                    <h2 className="text-xl font-orbitron font-bold text-white mb-6 pb-2 border-b border-[#2d2d2d]">
                      Contact Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 mb-2 text-sm">Email Address <span className="text-red-500">*</span></label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Phone Number (Optional)</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                        />
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-orbitron font-bold text-white mb-6 pb-2 border-b border-[#2d2d2d]">
                      Shipping Address
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">First Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Last Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 mb-2 text-sm">Address <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 mb-2 text-sm">Apartment, suite, etc. (Optional)</label>
                        <input 
                          type="text" 
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">City <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">State/Province <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">ZIP / Postal Code <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2 text-sm">Country <span className="text-red-500">*</span></label>
                        <select 
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-6">
                      <input 
                        type="checkbox" 
                        name="saveInfo"
                        id="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        className="w-4 h-4 mr-2"
                      />
                      <label htmlFor="saveInfo" className="text-gray-400 text-sm">
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div data-aos="fade-up">
                    <h2 className="text-xl font-orbitron font-bold text-white mb-6 pb-2 border-b border-[#2d2d2d]">
                      Shipping Method
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="border border-[#2d2d2d] rounded-lg p-4 bg-[#121212] cursor-pointer">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="shippingMethod" 
                            id="standard" 
                            className="mr-3"
                            defaultChecked 
                          />
                          <label htmlFor="standard" className="flex-1 cursor-pointer">
                            <div className="text-white font-bold">Standard Shipping</div>
                            <div className="text-gray-400 text-sm">5-7 business days</div>
                          </label>
                          <div className="text-white font-bold">Free</div>
                        </div>
                      </div>
                      
                      <div className="border border-[#2d2d2d] rounded-lg p-4 bg-[#121212] cursor-pointer">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="shippingMethod" 
                            id="express" 
                            className="mr-3" 
                          />
                          <label htmlFor="express" className="flex-1 cursor-pointer">
                            <div className="text-white font-bold">Express Shipping</div>
                            <div className="text-gray-400 text-sm">2-3 business days</div>
                          </label>
                          <div className="text-white font-bold">$12.99</div>
                        </div>
                      </div>
                      
                      <div className="border border-[#2d2d2d] rounded-lg p-4 bg-[#121212] cursor-pointer">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="shippingMethod" 
                            id="overnight" 
                            className="mr-3" 
                          />
                          <label htmlFor="overnight" className="flex-1 cursor-pointer">
                            <div className="text-white font-bold">Overnight Shipping</div>
                            <div className="text-gray-400 text-sm">Next business day</div>
                          </label>
                          <div className="text-white font-bold">$24.99</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-400 mb-2 text-sm">Special Instructions (Optional)</label>
                      <textarea 
                        name="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                        rows={4}
                      ></textarea>
                    </div>
                  </div>
                )}
                
                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div data-aos="fade-up">
                    <h2 className="text-xl font-orbitron font-bold text-white mb-6 pb-2 border-b border-[#2d2d2d]">
                      Payment Information
                    </h2>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-4">
                        <div className="text-gray-400 text-sm">Accepted Cards</div>
                        <div className="flex space-x-2">
                          <i className="fab fa-cc-visa text-xl text-gray-400"></i>
                          <i className="fab fa-cc-mastercard text-xl text-gray-400"></i>
                          <i className="fab fa-cc-amex text-xl text-gray-400"></i>
                          <i className="fab fa-cc-discover text-xl text-gray-400"></i>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block text-gray-400 mb-2 text-sm">Name on Card <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-gray-400 mb-2 text-sm">Card Number <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="XXXX XXXX XXXX XXXX"
                            className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm">Expiry Date <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2 text-sm">CVV <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="XXX"
                            className="w-full bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-lg px-4 py-3 outline-none"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="bg-[#121212] p-4 rounded-lg border border-[#2d2d2d] mb-4">
                        <div className="text-gray-400 text-sm mb-2">
                          <i className="fas fa-lock mr-2"></i> Your payment information is secured with SSL encryption
                        </div>
                        <div className="text-gray-400 text-sm">
                          <i className="fas fa-shield-alt mr-2"></i> We do not store your card details
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-[#2d2d2d] pt-6">
                      <h3 className="text-white font-bold mb-4">Billing Address</h3>
                      
                      <div className="mb-4">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="billingAddress" 
                            id="sameAsShipping" 
                            className="mr-3"
                            defaultChecked 
                          />
                          <label htmlFor="sameAsShipping" className="text-white cursor-pointer">
                            Same as shipping address
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name="billingAddress" 
                            id="differentAddress" 
                            className="mr-3" 
                          />
                          <label htmlFor="differentAddress" className="text-white cursor-pointer">
                            Use a different billing address
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Review Step */}
                {currentStep === 'review' && (
                  <div data-aos="fade-up">
                    <h2 className="text-xl font-orbitron font-bold text-white mb-6 pb-2 border-b border-[#2d2d2d]">
                      Review Your Order
                    </h2>
                    
                    <div className="mb-8">
                      <h3 className="text-white font-bold mb-3">Order Summary</h3>
                      
                      <div className="space-y-4 mb-6">
                        {cartItems.map(item => (
                          <div key={item.product.id} className="flex items-center py-2">
                            <div className="relative w-16 h-16 mr-4">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#0bff7e] text-black rounded-full flex items-center justify-center text-xs font-bold">
                                {item.quantity}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="text-white">{item.product.name}</div>
                              <div className="text-gray-400 text-sm">{item.product.category}</div>
                            </div>
                            <div className="text-white font-bold">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t border-[#2d2d2d] pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax</span>
                          <span className="text-white">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping</span>
                          <span className="text-white">$0.00</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-[#2d2d2d]">
                          <span className="text-white font-bold">Total</span>
                          <span className="text-[#0bff7e] font-bold">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-white font-bold mb-3">Contact Information</h3>
                      <p className="text-gray-400">
                        {formData.email}<br />
                        {formData.phone}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h3 className="text-white font-bold mb-3">Shipping Address</h3>
                        <p className="text-gray-400">
                          {formData.firstName} {formData.lastName}<br />
                          {formData.address}<br />
                          {formData.apartment && `${formData.apartment}, `}
                          {formData.city}, {formData.state} {formData.zipCode}<br />
                          {formData.country}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-bold mb-3">Shipping Method</h3>
                        <p className="text-gray-400">
                          Standard Shipping (5-7 business days)
                        </p>
                        
                        <h3 className="text-white font-bold mt-6 mb-3">Payment Method</h3>
                        <p className="text-gray-400">
                          {formData.cardName}<br />
                          Card ending in {formData.cardNumber.slice(-4)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-[#2d2d2d] pt-6">
                      <div className="flex items-center mb-6">
                        <input 
                          type="checkbox" 
                          id="termsAgreement" 
                          className="mr-3" 
                          required
                        />
                        <label htmlFor="termsAgreement" className="text-gray-400 text-sm">
                          I agree to the <a href="#" className="text-[#00b3ff] hover:underline">Terms of Service</a> and <a href="#" className="text-[#00b3ff] hover:underline">Privacy Policy</a>
                        </label>
                      </div>
                      
                      <button 
                        type="submit"
                        className="w-full btn-hover-effect px-6 py-3 bg-[#0bff7e] text-black font-bold rounded-md glow-primary font-poppins flex items-center justify-center disabled:opacity-50"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <div className="mr-2 w-5 h-5 border-2 border-t-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            Processing Order...
                          </>
                        ) : (
                          'Place Order'
                        )}
                      </button>
                      
                      <p className="text-center text-gray-400 text-sm mt-4">
                        <i className="fas fa-lock mr-2"></i> Secured by SSL encryption. Your data is protected.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                {currentStep !== 'review' && (
                  <div className="flex justify-end mt-6 pt-6 border-t border-[#2d2d2d]">
                    {(currentStep === 'shipping' || currentStep === 'payment' || currentStep === 'review') && (
                      <button 
                        type="button"
                        className="px-6 py-3 border border-gray-500 text-white font-bold rounded-md mr-4"
                        onClick={handlePreviousStep}
                      >
                        Back
                      </button>
                    )}
                    
                    <button 
                      type="button"
                      className="px-6 py-3 bg-[#00b3ff] text-black font-bold rounded-md"
                      onClick={handleNextStep}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e1e1e] rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-orbitron font-bold text-white mb-6 pb-2 border-b border-[#2d2d2d]">Order Summary</h2>
              
              <div className="max-h-80 overflow-y-auto mb-6 pr-2">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center py-2">
                    <div className="relative w-16 h-16 mr-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#0bff7e] text-black rounded-full flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{item.product.name}</div>
                      <div className="text-gray-400 text-xs">{item.product.category}</div>
                    </div>
                    <div className="text-white text-sm font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between py-3 border-t border-b border-[#2d2d2d] mb-6">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#0bff7e] font-bold text-xl">${total.toFixed(2)}</span>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Promo Code</label>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter code"
                    className="flex-1 bg-[#121212] text-white border border-[#2d2d2d] focus:border-[#0bff7e] rounded-l-lg px-4 py-2 outline-none"
                  />
                  <button className="bg-[#0bff7e] text-black font-bold px-4 rounded-r-lg">
                    Apply
                  </button>
                </div>
              </div>
              
              <div className="bg-[#121212] p-4 rounded-lg border border-[#2d2d2d]">
                <div className="flex items-start mb-4">
                  <i className="fas fa-shield-alt text-[#0bff7e] mt-1 mr-3"></i>
                  <div>
                    <div className="text-white text-sm font-bold">Secure Checkout</div>
                    <div className="text-gray-400 text-xs">All information is encrypted and secure</div>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <i className="fas fa-exchange-alt text-[#0bff7e] mt-1 mr-3"></i>
                  <div>
                    <div className="text-white text-sm font-bold">Easy Returns</div>
                    <div className="text-gray-400 text-xs">30-day money-back guarantee</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-headset text-[#0bff7e] mt-1 mr-3"></i>
                  <div>
                    <div className="text-white text-sm font-bold">24/7 Support</div>
                    <div className="text-gray-400 text-xs">Our team is always here to help</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
