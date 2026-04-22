import { Link } from "react-router-dom";
import { Eye, MapPin, Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import { categoryName, conditionLabel, formatPrice, getFallbackImage } from "../../lib/marketplace";
import { cn } from "../../lib/utils";

export type AdCardData = {
  id: string;
  title: string;
  price: number;
  currency?: string;
  location: string;
  image: string;
  category: string;
  condition?: string;
  view_count?: number;
  is_featured?: boolean;
  description?: string;
};

interface AdCardProps {
  ad: AdCardData;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
  className?: string;
  index?: number;
}

export function AdCard({ ad, onToggleFavorite, isFavorite, className, index = 0 }: AdCardProps) {
  return (
    <article
      className={cn("card-elevated rounded-2xl overflow-hidden group relative animate-fade-up", className)}
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <Link to={`/ad/${ad.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-3">
          <img
            src={ad.image}
            alt={ad.title}
            loading="lazy"
            onError={(event) => { event.currentTarget.src = getFallbackImage(ad.category); }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
          {ad.is_featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-emerald text-primary-foreground border-0 shadow-emerald">
              ★ Featured
            </Badge>
          )}
          {ad.condition && (
            <Badge variant="secondary" className="absolute top-3 right-3 bg-background/70 backdrop-blur border-border">
              {conditionLabel(ad.condition)}
            </Badge>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {ad.title}
            </h3>
          </div>
          <p className="text-xl font-display font-bold text-gradient-emerald">
            {formatPrice(Number(ad.price), ad.currency)}
          </p>
          {ad.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{ad.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60 mt-2">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{ad.location}</span>
            </span>
            <span className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-primary/80">{categoryName(ad.category)}</span>
              {typeof ad.view_count === "number" && (
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ad.view_count}</span>
              )}
            </span>
          </div>
        </div>
      </Link>
      {onToggleFavorite && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite(ad.id); }}
          className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-background/80 backdrop-blur border border-border grid place-items-center hover:border-primary hover:text-primary transition-all"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("h-4 w-4 transition-all", isFavorite && "fill-primary text-primary")} />
        </button>
      )}
    </article>
  );
}
