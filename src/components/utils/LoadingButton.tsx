interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "main" | "alt" | "error";
  title?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  variant = "main",
  className = "",
  title,
  children,
  ...props
}) => {
  const variantClass =
    variant === "alt" ? "alt-btn" : variant === "error" ? "btn-danger" : "main-btn-dark";

  return (
    <button
      title={title}
      className={`${className} ${variantClass} btn text-capitalize fw-bold`}
      style={{ minWidth: "170px" }}
      disabled={loading || props.disabled} // Handle disabled if passed
      {...props} // Spread any other props like onClick, etc.
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
