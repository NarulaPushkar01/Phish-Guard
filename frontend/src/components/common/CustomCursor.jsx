import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'A' ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'SELECT'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Variants for the outer circle (the trail)
  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: 'rgba(0, 255, 136, 0.1)',
      border: '1px solid rgba(0, 255, 136, 0.5)',
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
      backgroundColor: 'rgba(0, 255, 136, 0.2)',
      border: '1px solid rgba(0, 255, 136, 0.8)',
    }
  };

  return (
    <>
      {/* Inner Dot (instant movement) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-cyber-neon rounded-full pointer-events-none z-[9999] mix-blend-screen"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0 }}
      />
      
      {/* Outer Ring (smooth trailing movement) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
        variants={variants}
        animate={isHovering ? "hover" : "default"}
        transition={{ 
          type: "spring", 
          stiffness: 150, 
          damping: 15, 
          mass: 0.5 
        }}
      />
    </>
  );
};

export default CustomCursor;
