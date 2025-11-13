"use client";

import { useEffect, useState, useRef } from "react";

export default function Footer({ isLoginScreen = false }: { isLoginScreen?: boolean }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 2, y: 2 });
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoginScreen) return;

    const moveFooter = () => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;

        const footerWidth = footerRef.current?.offsetWidth || 200;
        const footerHeight = footerRef.current?.offsetHeight || 50;
        const maxX = window.innerWidth - footerWidth;
        const maxY = window.innerHeight - footerHeight;

        // Bounce off walls
        if (newX <= 0 || newX >= maxX) {
          newVelX = -newVelX;
          newX = newX <= 0 ? 0 : maxX;
        }
        if (newY <= 0 || newY >= maxY) {
          newVelY = -newVelY;
          newY = newY <= 0 ? 0 : maxY;
        }

        setVelocity({ x: newVelX, y: newVelY });
        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(moveFooter, 20);
    return () => clearInterval(interval);
  }, [isLoginScreen, velocity]);

  if (isLoginScreen) {
    return (
      <>
        <style jsx>{`
          .footer-container {
            text-align: center;
            padding: 20px 0;
            font-size: 14px;
            color: #666;
            margin-top: 30px !important;
          }
        `}</style>
        <div className="footer-container">
          <p style={{ margin: 0 }}>
            made with 🧠 by{" "}
            <a 
              href="https://github.com/steakfisher" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: "#7f0019",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#635dff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#7f0019"}
            >
              JDP
            </a>
            {" "}and{" "}
            <a 
              href="https://github.com/thedevyashsaini" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: "#7f0019",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#635dff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#7f0019"}
            >
              TDS
            </a>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        .footer-bouncing {
          position: fixed;
          font-size: 14px;
          color: #666;
          z-index: 9999;
          pointer-events: auto;
        }
      `}</style>
      <div 
        ref={footerRef}
        className="footer-bouncing"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <p style={{ margin: 0, whiteSpace: 'nowrap' }}>
          made with 🧠 by{" "}
          <a 
            href="https://github.com/steakfisher" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: "#7f0019",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#635dff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#7f0019"}
          >
            JDP
          </a>
          {" "}and{" "}
          <a 
            href="https://github.com/thedevyashsaini" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: "#7f0019",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#635dff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#7f0019"}
          >
            TDS
          </a>
        </p>
      </div>
    </>
  );
}
