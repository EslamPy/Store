import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ProductImageViewerProps {
  images: string[];
  productName: string;
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({ images, productName }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const fullscreenOverlayRef = useRef<HTMLDivElement>(null);
  
  // Handle mousemove for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate position in percentage (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Limit values to stay within boundaries
    const boundedX = Math.max(0, Math.min(1, x));
    const boundedY = Math.max(0, Math.min(1, y));
    
    setZoomPosition({ x: boundedX, y: boundedY });
  };
  
  // Open fullscreen view
  const openFullscreen = () => {
    if (fullscreenRef.current && fullscreenOverlayRef.current) {
      setShowFullscreen(true);
      
      gsap.fromTo(
        fullscreenOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      
      gsap.fromTo(
        fullscreenRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };
  
  // Close fullscreen view
  const closeFullscreen = () => {
    if (fullscreenRef.current && fullscreenOverlayRef.current) {
      gsap.to(fullscreenOverlayRef.current, {
        opacity: 0,
        duration: 0.3
      });
      
      gsap.to(fullscreenRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        onComplete: () => {
          setShowFullscreen(false);
        }
      });
    } else {
      setShowFullscreen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container with Zoom */}
      <div 
        ref={containerRef}
        className="relative bg-[#1e1e1e] rounded-lg overflow-hidden cyberpunk-border group h-[400px] cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={openFullscreen}
      >
        {/* Normal Image */}
        <img 
          src={images[activeImage]}
          alt={productName} 
          className="w-full h-full object-contain transition-opacity duration-300"
          style={{ opacity: isZoomed ? 0.3 : 1 }}
        />
        
        {/* Zoomed Image */}
        {isZoomed && (
          <div 
            ref={zoomRef}
            className="absolute inset-0 pointer-events-none overflow-hidden z-10 bg-[#1e1e1e]"
          >
            <img 
              src={images[activeImage]}
              alt={`${productName} - zoomed`}
              className="absolute w-[200%] h-[200%] max-w-none object-contain"
              style={{ 
                transform: `translate(-${zoomPosition.x * 100}%, -${zoomPosition.y * 100}%) scale(1.8)`,
                transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`
              }}
            />
          </div>
        )}
        
        {/* Overlay controls */}
        <div className="absolute top-3 right-3 space-x-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className="w-8 h-8 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              openFullscreen();
            }}
          >
            <i className="fas fa-expand-alt"></i>
          </button>
        </div>
        
        {/* Hover instructions */}
        <div className="absolute bottom-3 left-3 z-20 bg-black bg-opacity-50 px-3 py-1 rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <i className="fas fa-search-plus mr-1"></i> Hover to zoom / Click for fullscreen
        </div>
      </div>
      
      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:opacity-100 ${
                activeImage === index 
                  ? 'border-[#0bff7e] glow-primary opacity-100' 
                  : 'border-transparent opacity-70'
              }`}
              onClick={() => setActiveImage(index)}
            >
              <img 
                src={image}
                alt={`${productName} - Image ${index + 1}`} 
                className="w-20 h-20 object-cover"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Fullscreen View */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            ref={fullscreenOverlayRef}
            className="absolute inset-0 bg-[#121212] bg-opacity-90 backdrop-blur-sm" 
            onClick={closeFullscreen}
          ></div>
          
          <div 
            ref={fullscreenRef}
            className="relative bg-[#1e1e1e] max-h-[90vh] max-w-[90vw] rounded-lg overflow-hidden cyberpunk-border z-10"
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"
              onClick={closeFullscreen}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <div className="relative p-4">
              <img 
                src={images[activeImage]}
                alt={productName} 
                className="max-h-[80vh] max-w-[80vw] object-contain"
              />
              
              {/* Image navigation */}
              {images.length > 1 && (
                <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
                  <button 
                    className="w-10 h-10 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
                    }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className="w-10 h-10 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
                    }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
            
            {/* Thumbnail navigation in fullscreen */}
            {images.length > 1 && (
              <div className="flex justify-center space-x-2 p-4 bg-[#121212] bg-opacity-50">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index ? 'border-[#0bff7e] glow-primary' : 'border-transparent'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(index);
                    }}
                  >
                    <img 
                      src={image}
                      alt={`${productName} - Thumbnail ${index + 1}`} 
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageViewer; 