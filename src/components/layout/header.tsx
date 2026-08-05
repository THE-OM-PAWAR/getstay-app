"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, ArrowLeft, Menu, User, LogOut, Bookmark, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";

interface HeaderProps {
  pageTitle?: string;
  showBackButton?: boolean;
}

interface UserState {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

function HeaderContent({ pageTitle, showBackButton = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchPage = pathname === '/search';
  const isHomePage = pathname === '/';
  const urlQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // User auth state
  const [user, setUser] = useState<UserState | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Fetch session user
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to log out");
    }
  };

  // Scroll listener for homepage transparent-to-glass navigation transition
  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Determine if we should show the search page behavior (expanded search bar with X)
  const useSearchPageBehavior = isSearchPage && !showBackButton;

  // Update search query when URL changes
  useEffect(() => {
    if (isSearchPage && urlQuery) {
      setSearchQuery(urlQuery);
      if (useSearchPageBehavior && window.innerWidth < 768) {
        setIsMobileSearchOpen(true);
      }
    }
  }, [isSearchPage, urlQuery, useSearchPageBehavior]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (!useSearchPageBehavior) {
        setIsMobileSearchOpen(false);
      }
    }
  };

  const handleClose = () => {
    if (useSearchPageBehavior) {
      router.push('/');
      setSearchQuery("");
    }
    setIsMobileSearchOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const getUserInitials = () => {
    if (!user) return "GS";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "GS";
  };

  const getUserFullName = () => {
    if (!user) return "User";
    return `${user.firstName} ${user.lastName}`.trim();
  };

  // User Dropdown Component for Desktop
  const renderUserDropdown = (isDarkText: boolean = false) => {
    if (loadingAuth) {
      return (
        <div className="h-9 w-9 rounded-full bg-gray-200/50 animate-spin border-2 border-brand-primary border-t-transparent" />
      );
    }

    if (!user) {
      return (
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className={`text-sm font-semibold transition-colors duration-300 ${
              isDarkText ? "text-gray-700 hover:text-brand-primary dark:text-zinc-200" : "text-white hover:text-white/80"
            }`}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={`rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow transition-all duration-300 ${
              isDarkText
                ? "bg-brand-primary text-white hover:bg-brand-primary/95"
                : "bg-white text-brand-primary hover:bg-white/95"
            }`}
          >
            Sign Up
          </Link>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`relative flex items-center gap-2.5 rounded-full pl-2 pr-3 py-1.5 transition-all duration-200 ${
              isDarkText
                ? "bg-gray-100/80 hover:bg-gray-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-gray-200/60 dark:border-zinc-700"
                : "bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md"
            }`}
          >
            <Avatar className="h-7 w-7 border-2 border-brand-primary/40">
              <AvatarFallback className="bg-brand-primary text-white text-xs font-black">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold max-w-[120px] truncate">
              {user.firstName}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-gray-100 dark:border-zinc-800">
          <DropdownMenuLabel className="p-3 font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">
                {getUserFullName()}
              </p>
              <p className="text-xs text-muted-foreground truncate leading-none">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
            <Link href="/profile" className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-brand-primary" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
            <Link href="/bookings" className="flex items-center gap-2.5">
              <Bookmark className="h-4 w-4 text-brand-primary" />
              <span>My Bookings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="rounded-xl cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/40"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isHomePage) {
    return (
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled
          ? "border-gray-100/50 dark:border-gray-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-xs"
          : "border-transparent bg-transparent"
        }`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Left Section: Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`text-2xl font-black tracking-tight transition-colors duration-300 ${isScrolled ? "text-brand-primary" : "text-white"
                }`}
            >
              getstay
            </Link>
          </div>

          {/* Middle Section: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`relative text-sm font-semibold px-3 py-1.5 rounded-full border transition-all duration-300 ${isScrolled
                  ? "text-brand-primary bg-brand-primary/5 border-brand-primary/10"
                  : "text-white bg-white/10 border-white/20"
                }`}
            >
              Home
            </Link>
            <Link
              href="/destinations"
              className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? "text-gray-500 hover:text-brand-primary" : "text-white/80 hover:text-white"
                }`}
            >
              Explore
            </Link>
            <Link
              href="/hostels"
              className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? "text-gray-500 hover:text-brand-primary" : "text-white/80 hover:text-white"
                }`}
            >
              Hostels
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? "text-gray-500 hover:text-brand-primary" : "text-white/80 hover:text-white"
                }`}
            >
              About Us
            </Link>
          </nav>

          {/* Right Section: Auth Dropdown / Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {renderUserDropdown(isScrolled)}
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`rounded-lg p-2 transition-colors duration-300 md:hidden ${isScrolled ? "text-gray-500 hover:bg-gray-50" : "text-white hover:bg-white/10"
              }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className={`border-t px-6 py-4 md:hidden shadow-lg animate-in fade-in-50 duration-200 transition-all duration-300 ${isScrolled
              ? "border-gray-150 dark:border-gray-800 bg-white/95 dark:bg-black/95 text-foreground"
              : "border-white/10 bg-black/90 backdrop-blur-lg text-white"
            }`}>
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-semibold px-3 py-2 rounded-lg ${isScrolled ? "text-brand-primary bg-brand-primary/5" : "text-white bg-white/10"
                  }`}
              >
                Home
              </Link>
              <Link
                href="/destinations"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium px-3 py-2 transition-colors ${isScrolled ? "text-gray-500 hover:text-brand-primary" : "text-white/80 hover:text-white"
                  }`}
              >
                Explore
              </Link>
              <Link
                href="/hostels"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium px-3 py-2 transition-colors ${isScrolled ? "text-gray-500 hover:text-brand-primary" : "text-white/80 hover:text-white"
                  }`}
              >
                Hostels
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium px-3 py-2 transition-colors ${isScrolled ? "text-gray-500 hover:text-brand-primary" : "text-white/80 hover:text-white"
                  }`}
              >
                About Us
              </Link>
              <hr className={isScrolled ? "border-gray-150 dark:border-gray-800" : "border-white/10"} />
              
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-brand-primary/10">
                    <Avatar className="h-8 w-8 border-2 border-brand-primary">
                      <AvatarFallback className="bg-brand-primary text-white text-xs font-black">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold leading-none">{getUserFullName()}</p>
                      <p className="text-xs opacity-75 leading-none mt-1">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-semibold px-3 py-2 transition-colors ${isScrolled ? "text-gray-700 hover:text-brand-primary" : "text-white hover:text-white/80"
                      }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`rounded-full px-6 py-2.5 text-center text-sm font-semibold transition-all ${isScrolled
                        ? "bg-brand-primary text-white hover:bg-brand-primary/95"
                        : "bg-white text-brand-primary hover:bg-white/95"
                      }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }

  // Fallback / Subpages Header with Search Bar
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Mobile Search Expanded View */}
        {isMobileSearchOpen && (
          <div className="flex w-full items-center gap-2 md:hidden">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search hostels or rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 pl-10 pr-4 text-sm transition-all focus:border-brand-primary focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-brand-primary/20 backdrop-blur-md"
                  autoFocus={!isSearchPage}
                />
              </div>
            </form>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="shrink-0 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Normal Header Layout */}
        <div className={`flex w-full items-center justify-between ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
          {/* Left Section */}
          <div className="flex items-center gap-8 min-w-0">
            <div className="flex items-center gap-3">
              {showBackButton && !isHomePage ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="shrink-0 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  {pageTitle && (
                    <h2 className="truncate text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      {truncateTitle(pageTitle, 40)}
                    </h2>
                  )}
                </>
              ) : (
                <Link href="/" className="text-2xl font-black tracking-tight text-brand-primary">
                  getstay
                </Link>
              )}
            </div>

            {/* Navigation Links - Hidden on small screens */}
            {!showBackButton && (
              <nav className="hidden lg:flex items-center gap-6">
                <Link href="/destinations" className="text-sm font-medium text-zinc-600 hover:text-brand-primary dark:text-zinc-300 dark:hover:text-brand-primary transition-colors">
                  Explore
                </Link>
                <Link href="/hostels" className="text-sm font-medium text-zinc-600 hover:text-brand-primary dark:text-zinc-300 dark:hover:text-brand-primary transition-colors">
                  Hostels
                </Link>
                <Link href="/about" className="text-sm font-medium text-zinc-600 hover:text-brand-primary dark:text-zinc-300 dark:hover:text-brand-primary transition-colors">
                  About Us
                </Link>
              </nav>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Desktop Search bar */}
            <form onSubmit={handleSearch} className="relative hidden w-56 xl:w-72 md:flex">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 pl-10 text-sm transition-all focus:border-brand-primary focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-brand-primary/20 hover:bg-white dark:hover:bg-zinc-900"
              />
            </form>

            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Auth Buttons or User Dropdown */}
            {!showBackButton && renderUserDropdown(true)}
            
            {/* Mobile Menu Icon */}
            {!showBackButton && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors lg:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown for Fallback Header */}
      {isMobileMenuOpen && !showBackButton && (
        <div className="border-t border-zinc-150 dark:border-zinc-800 bg-white/95 dark:bg-black/95 px-6 py-4 shadow-lg backdrop-blur-xl lg:hidden animate-in fade-in-50 duration-200">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium px-3 py-2 text-zinc-600 hover:text-brand-primary dark:text-zinc-300 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/destinations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold px-3 py-2 text-brand-primary bg-brand-primary/5 rounded-lg"
            >
              Explore
            </Link>
            <Link
              href="/hostels"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium px-3 py-2 text-zinc-600 hover:text-brand-primary dark:text-zinc-300 transition-colors"
            >
              Hostels
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium px-3 py-2 text-zinc-600 hover:text-brand-primary dark:text-zinc-300 transition-colors"
            >
              About Us
            </Link>
            <hr className="border-zinc-150 dark:border-zinc-800" />
            
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-brand-primary/10">
                  <Avatar className="h-8 w-8 border-2 border-brand-primary">
                    <AvatarFallback className="bg-brand-primary text-white text-xs font-black">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">{getUserFullName()}</p>
                    <p className="text-xs text-muted-foreground leading-none mt-1">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold px-3 py-2 text-zinc-700 hover:text-brand-primary dark:text-zinc-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-full bg-brand-primary px-6 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-brand-primary/95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Header({ pageTitle, showBackButton = false }: HeaderProps) {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8 lg:px-12">
          <h1 className="text-2xl font-black tracking-tight text-brand-primary">
            getstay
          </h1>
        </div>
      </header>
    }>
      <HeaderContent pageTitle={pageTitle} showBackButton={showBackButton} />
    </Suspense>
  );
}
