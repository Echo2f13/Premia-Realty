import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();

  // Generate breadcrumb items from pathname
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  // Format breadcrumb text
  const formatBreadcrumb = (text) => {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav aria-label="Breadcrumb" className="py-4 border-b border-border/30">
      <div className="container mx-auto px-6 lg:px-12">
        <ol className="flex items-center gap-2 text-sm">
          {/* Home link */}
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-foreground/60 hover:text-accent transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" strokeWidth={1.5} />
              <span>Home</span>
            </Link>
          </li>

          {/* Dynamic breadcrumb items */}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;

            return (
              <li key={routeTo} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-foreground/40" strokeWidth={1.5} />
                {isLast ? (
                  <span className="text-accent font-light" aria-current="page">
                    {formatBreadcrumb(name)}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-foreground/60 hover:text-accent transition-colors font-light"
                  >
                    {formatBreadcrumb(name)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
