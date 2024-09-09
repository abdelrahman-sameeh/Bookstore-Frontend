import React from "react";

interface LoadingButtonProps {
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  type = "button",
  className = "",
  style,
  children,
}) => {
  return (
    <button
      type={type}
      className={`btn text-capitalize ${className}`}
      style={style}
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
