import { Link } from "react-router-dom";
import { CATEGORIES } from "../../lib/marketplace";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {CATEGORIES.map((cat, i) => (
        <Link
          key={cat.slug}
          to={`/search?category=${cat.slug}`}
          className="card-elevated rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:scale-[1.03] animate-fade-up"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <span className="text-3xl" aria-hidden>{cat.emoji}</span>
          <span className="text-xs font-medium text-foreground/90">{cat.name}</span>
        </Link>
      ))}
    </div>
  );
}
