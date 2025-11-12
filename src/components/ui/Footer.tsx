"use client";

export default function Footer({ isLoginScreen = false }: { isLoginScreen?: boolean }) {
  return (
    <>
      <style jsx>{`
        .footer-container {
          text-align: center;
          padding: 20px 0;
          font-size: 14px;
          color: #666;
          margin-top: ${isLoginScreen ? '30px' : '-20px'} !important;
        }
        
        @media screen and (min-width: 650px) {
          .footer-container {
            margin-top: 15px !important;
            padding: 10px 0;
          }
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
