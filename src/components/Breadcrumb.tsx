import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [
    { label: "Início", href: "/" },
    ...items
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 px-4 py-3 text-sm bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 mb-6"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <motion.div
            key={index}
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {isLast ? (
              <span className="font-semibold text-foreground flex items-center gap-2">
                {index === 0 && <Home className="w-4 h-4" />}
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  to={item.href || "/"}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  {item.label}
                </Link>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </>
            )}
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
