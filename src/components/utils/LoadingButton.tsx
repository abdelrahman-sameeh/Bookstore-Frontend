interface LoadingButtonProps {
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "main" | "alt" | "error";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;  
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  type = "button",
  variant = "main",
  className = "",
  style,
  children,
  onClick,  
}) => {
  const variantClass = variant === "alt" ? "alt-btn" : variant === "error" ? "btn-danger" : "main-btn";

  return (
    <button
      type={type}
      className={`${className} ${variantClass} btn text-capitalize text-light fw-bold`}
      style={{ ...style, minWidth: '170px' }}
      disabled={loading}
      onClick={onClick}
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
