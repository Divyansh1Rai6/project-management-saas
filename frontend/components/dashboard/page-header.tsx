import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, breadcrumb, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)} style={{ animation: 'fade-in 0.4s ease-out' }}>
      {breadcrumb && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumb.map((item, i) => (
            <span key={item} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              <span className={cn(i === breadcrumb.length - 1 && 'font-medium text-foreground')}>{item}</span>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
