import { Link } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { CATEGORIES } from "../lib/marketplace";

export default function CategoriesPage() {
  return (
    <PageShell>
      <div className="container py-10">
        <header className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">All categories</h1>
          <p className="text-muted-foreground mt-1">Pick a category to explore listings.</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to={`/search?category=${c.slug}`}
              className="card-elevated rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-5xl" aria-hidden>{c.emoji}</span>
              <span className="font-display font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
