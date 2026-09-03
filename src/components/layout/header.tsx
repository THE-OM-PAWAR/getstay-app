"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, ArrowLeft, Menu, User, LogOut, Bookmark, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const isHomePage = pathname === '/';

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
            className={`text-sm font-semibold transition-colors duration-300 ${isDarkText ? "text-gray-700 hover:text-brand-primary dark:text-zinc-200" : "text-white hover:text-white/80"
              }`}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className={`rounded-full px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow transition-all duration-300 ${isDarkText
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
            className={`relative flex items-center gap-2.5 rounded-full pl-2 pr-3 py-1.5 transition-all duration-200 ${isDarkText
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
              href="/explore"
              className={`text-sm font-medium transition-colors duration-300 ${isScrolled ? "text-gray-500 hover:text-brand-primary" : "text-white/80 hover:text-white"
                }`}
            >
              Explore
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
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className={`rounded-lg p-2 transition-colors duration-300 md:hidden ${isScrolled ? "text-gray-500 hover:bg-gray-50" : "text-white hover:bg-white/10"
                  }`}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
          </Sheet>
        </div>

        {/* Mobile Navigation Dropdown */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="right" className="w-[85vw] sm:w-[350px] border-l border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl pt-12 flex flex-col p-6 shadow-2xl">
            <SheetTitle className="text-left font-bold text-xl mb-6 text-brand-primary">Menu</SheetTitle>
            <div className="flex flex-col gap-6 flex-1">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold px-4 py-3 rounded-xl text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/explore"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium px-4 py-3 rounded-xl text-zinc-600 hover:text-brand-primary hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Explore
                </Link>
                <Link
                  href="/city/bhopal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium px-4 py-3 rounded-xl text-zinc-600 hover:text-brand-primary hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Hostels
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium px-4 py-3 rounded-xl text-zinc-600 hover:text-brand-primary hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  About Us
                </Link>
              </nav>

              <div className="mt-auto">
                <hr className="border-zinc-150 dark:border-zinc-800 mb-6" />
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 shadow-sm">
                      <Avatar className="h-10 w-10 border-2 border-brand-primary">
                        <AvatarFallback className="bg-brand-primary text-white text-sm font-black">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">{getUserFullName()}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <User className="h-5 w-5 text-brand-primary" />
                        Profile
                      </Link>
                      <Link
                        href="/bookings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Bookmark className="h-5 w-5 text-brand-primary" />
                        Bookings
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-xl px-6 py-3.5 text-center text-sm font-bold text-zinc-700 hover:text-brand-primary bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all shadow-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-xl bg-brand-primary px-6 py-3.5 text-center text-sm font-bold text-white transition-all hover:bg-brand-primary/95 shadow-md hover:shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    );
  }

  // Fallback / Subpages Header
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Normal Header Layout */}
        <div className="flex w-full items-center justify-between">
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
                <Link href="/explore" className="text-sm font-medium text-zinc-600 hover:text-brand-primary dark:text-zinc-300 dark:hover:text-brand-primary transition-colors">
                  Explore
                </Link>
                <Link href="/city/bhopal" className="text-sm font-medium text-zinc-600 hover:text-brand-primary dark:text-zinc-300 dark:hover:text-brand-primary transition-colors">
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
            {/* Auth Buttons or User Dropdown */}
            {!showBackButton && renderUserDropdown(true)}

            {/* Mobile Menu Icon */}
            {!showBackButton && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors lg:hidden"
                    aria-label="Toggle menu"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown for Fallback Header */}
      {!showBackButton && (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="right" className="w-[85vw] sm:w-[350px] border-l border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl pt-12 flex flex-col p-6 shadow-2xl z-[100]">
            <SheetTitle className="text-left font-bold text-xl mb-6 text-brand-primary">Menu</SheetTitle>
            <div className="flex flex-col gap-6 flex-1">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold px-4 py-3 rounded-xl text-zinc-600 hover:text-brand-primary hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/explore"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium px-4 py-3 rounded-xl text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors"
                >
                  Explore
                </Link>
                <Link
                  href="/city/bhopal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium px-4 py-3 rounded-xl text-zinc-600 hover:text-brand-primary hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  Hostels
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium px-4 py-3 rounded-xl text-zinc-600 hover:text-brand-primary hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                >
                  About Us
                </Link>
              </nav>

              <div className="mt-auto">
                <hr className="border-zinc-150 dark:border-zinc-800 mb-6" />
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10 shadow-sm">
                      <Avatar className="h-10 w-10 border-2 border-brand-primary">
                        <AvatarFallback className="bg-brand-primary text-white text-sm font-black">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">{getUserFullName()}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <User className="h-5 w-5 text-brand-primary" />
                        Profile
                      </Link>
                      <Link
                        href="/bookings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Bookmark className="h-5 w-5 text-brand-primary" />
                        Bookings
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-xl px-6 py-3.5 text-center text-sm font-bold text-zinc-700 hover:text-brand-primary bg-zinc-100 hover:bg-zinc-200 dark:text-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all shadow-sm"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-xl bg-brand-primary px-6 py-3.5 text-center text-sm font-bold text-white transition-all hover:bg-brand-primary/95 shadow-md hover:shadow-lg"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </header>
  );
}

export function Header({ pageTitle, showBackButton = false }: HeaderProps) {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8 lg:px-12">
          <span className="text-2xl font-black tracking-tight text-brand-primary">
            getstay
          </span>
        </div>
      </header>
    }>
      <HeaderContent pageTitle={pageTitle} showBackButton={showBackButton} />
    </Suspense>
  );
}
