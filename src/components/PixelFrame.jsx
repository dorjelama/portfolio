export default function PixelFrame({ title, className = "", children, ...rest }) {
  return (
    <section className={`pixel-box p-4 md:p-5 ${className}`} {...rest}>
      {title && <h2 className="mb-3 text-xs uppercase tracking-wide md:text-sm">{title}</h2>}
      {children}
    </section>
  );
}
