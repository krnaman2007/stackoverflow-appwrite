interface HeroSectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function HeroSectionHeader({ title, subtitle, className }: HeroSectionHeaderProps) {
  return (
    <div className={`mb-6 ${className ?? ""}`}>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}