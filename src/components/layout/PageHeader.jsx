
export function PageHeader({
  title,
  subtitle,
  rightSlot,
  className = "mb-10",
  titleClassName,
  subtitleClassName,
}) {
  const baseTitle =
    "text-4xl font-bold text-gray-900"; 
  const baseSubtitle =
    "text-sm text-gray-600 mt-2";

  return (
    <div className={className}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className={titleClassName || baseTitle}>{title}</h1>
          {subtitle && (
            <p className={subtitleClassName || baseSubtitle}>{subtitle}</p>
          )}
        </div>
        {rightSlot && (
          <div className="flex items-center gap-3">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
