import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, User as UserIcon, Heart, MessageCircle, Plus, LogOut, LayoutDashboard, Menu, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";

export function Header() {
  const { user, roles, signOut, isAdmin, isSuper, isDemo, isSeller } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
        }
        onClick={() => setMobileOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
        }
        onClick={() => setMobileOpen(false)}
      >
        Categories
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
        }
        onClick={() => setMobileOpen(false)}
      >
        Browse
      </NavLink>
      {isAdmin && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
          }
          onClick={() => setMobileOpen(false)}
        >
          Admin
        </NavLink>
      )}
      {isSuper && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
          }
          onClick={() => setMobileOpen(false)}
        >
          Super Admin
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass-panel">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 group" aria-label="AdFlow Pro home">
          <div className="relative h-9 w-9 rounded-lg bg-gradient-emerald grid place-items-center shadow-emerald transition-transform group-hover:scale-105">
            <span className="font-display font-extrabold text-primary-foreground">A</span>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-display font-bold text-lg tracking-tight">AdFlow</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary -mt-0.5">Pro</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 ml-6">{navLinks}</nav>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-10 pr-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = (e.target as HTMLInputElement).value;
                  navigate(`/search?q=${encodeURIComponent(q)}`);
                }
              }}
            />
          </div>
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <>
              <Button asChild variant="ghost" size="icon" aria-label="Favorites">
                <Link to="/dashboard/favorites"><Heart className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="ghost" size="icon" aria-label="Messages">
                <Link to="/dashboard/messages"><MessageCircle className="h-5 w-5" /></Link>
              </Button>
              {isSeller && (
                <Button asChild variant="hero" size="default">
                  <Link to="/post-ad"><Plus className="h-4 w-4" /> Post Ad</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Account">
                    <UserIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col gap-1 truncate">
                    <span className="truncate">{user.email}</span>
                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${isDemo ? "bg-yellow-500/15 text-yellow-200" : "bg-sky-500/15 text-sky-200"}`}>
                      {isDemo ? "Demo user" : "Real user"}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/ads")}>My Ads</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>Profile</DropdownMenuItem>
                  {(isAdmin || isSuper) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/dashboard")} className="text-primary">
                        {isSuper ? "Super Admin Panel" : "Admin Panel"}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user && isSeller && (
            <Button asChild variant="hero" size="sm">
              <Link to="/post-ad"><Plus className="h-4 w-4" /></Link>
            </Button>
          )}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menu"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-surface border-border">
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-4">{navLinks}</nav>
                <div className="border-t border-border pt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Button asChild variant="outline"><Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link></Button>
                      <Button asChild variant="outline"><Link to="/dashboard/favorites" onClick={() => setMobileOpen(false)}>Favorites</Link></Button>
                      <Button asChild variant="outline"><Link to="/dashboard/messages" onClick={() => setMobileOpen(false)}>Messages</Link></Button>
                      {(isAdmin || isSuper) && (
                        <Button asChild variant="outline" className="text-primary">
                          <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                            {isSuper ? "Super Admin" : "Admin"} Panel
                          </Link>
                        </Button>
                      )}
                      {isSeller && (
                        <Button asChild variant="hero"><Link to="/post-ad" onClick={() => setMobileOpen(false)}><Plus className="h-4 w-4" /> Post Ad</Link></Button>
                      )}
                      <Button variant="ghost" onClick={() => { signOut(); setMobileOpen(false); }} className="text-destructive justify-start">
                        <LogOut className="h-4 w-4" /> Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="hero"><Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link></Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-16 py-8 bg-surface/40">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AdFlow Pro — built for modern marketplaces.</p>
        <div className="flex items-center gap-4">
          <Link to="/categories" className="hover:text-foreground">Categories</Link>
          <Link to="/search" className="hover:text-foreground">Browse</Link>
          <a href="#" className="hover:text-foreground">Help</a>
        </div>
      </div>
    </footer>
  );
}
