import React from "react";

interface LoadingButtonProps {
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "main" | "alt" | "error";  
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  type = "button",
  variant = "main",
  className = "",
  style,
  children,
}) => {
  const variantClass = variant === "alt" ? "alt-btn" : variant === "error" ? "btn-danger" : "main-btn";

  return (
    <button
    type={type}
      className={`${className} ${variantClass} btn text-capitalize text-light fw-bold`}
      style={{...style, minWidth: '170px'}}
      disabled={loading}
    >
      {loading ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
