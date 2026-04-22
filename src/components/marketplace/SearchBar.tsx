import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CATEGORIES } from "../../lib/marketplace";
import { useState, FormEvent } from "react";

interface Props { compact?: boolean }

export function SearchBar({ compact = false }: Props) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (category && category !== "all") sp.set("category", category);
    navigate(`/search?${sp.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col sm:flex-row gap-2 ${compact ? "" : "p-2 rounded-2xl glass-panel shadow-elev"}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search iPhone, MacBook, BMW…"
          className="pl-9 h-12 bg-surface-2 border-border focus-visible:ring-primary"
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="sm:w-48 h-12 bg-surface-2 border-border">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.slug} value={c.slug}>{c.emoji} {c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" variant="hero" size="lg" className="h-12">
        <Search className="h-4 w-4" /> Search
      </Button>
    </form>
  );
}
