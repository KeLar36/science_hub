import { Link as RouterLink } from "react-router-dom";

export default function Link({
  children,
  href = "#",
  external = false,
  variant = "default",
  className = "",
  ...props
}) {
  const baseStyles =
    "transition-all duration-200 font-medium inline-flex items-center gap-1 cursor-pointer font-sans";

  const variants = {
    default:
      "text-brand hover:text-brand/80 underline underline-offset-4 decoration-brand/30",
    muted: "text-text-muted hover:text-text-primary",
    underline:
      "text-text-primary underline underline-offset-4 decoration-border-color hover:decoration-brand/50",
  };

  const isExternal =
    external || href.startsWith("http://") || href.startsWith("https://");

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} className={combinedClasses} {...props}>
      {children}
    </RouterLink>
  );
}
