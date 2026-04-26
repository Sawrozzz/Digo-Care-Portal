import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-1 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && (
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          )}
          {item.path ? (
            <button
              onClick={() => navigate(item.path!)}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-600 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
