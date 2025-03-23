
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Landmark, Menu, X, CreditCard, LogIn, UserRound, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const location = useLocation();
  const { pathname } = location;
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const NavItems = [
    { name: "Home", path: "/", icon: <Landmark className="h-4 w-4" /> },
    ...(user
      ? [
          { name: "Apply for Loan", path: "/apply", icon: <CreditCard className="h-4 w-4" /> },
          { name: "Payments", path: "/payments", icon: <FileText className="h-4 w-4" /> },
          { name: "Profile", path: "/profile", icon: <UserRound className="h-4 w-4" /> },
          ...(isAdmin
            ? [{ name: "Admin Dashboard", path: "/dashboard", icon: <Shield className="h-4 w-4" /> }]
            : []),
        ]
      : [{ name: "Login", path: "/login", icon: <LogIn className="h-4 w-4" /> }]),
  ];

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <header className="flex h-14 lg:h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <Landmark className="h-6 w-6" />
        <span className="hidden sm:block whitespace-nowrap">LoanQuest</span>
      </Link>

      <div className="flex-1">
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {NavItems.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 text-lg font-medium transition-colors hover:text-foreground/80 ${
                      pathname === link.path ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                {user && (
                  <Button onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }} variant="outline" className="mt-4">
                    Sign Out
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="ml-6 flex gap-6">
            <div className="hidden md:flex gap-6">
              {NavItems.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80 ${
                    pathname === link.path ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      {user && !isMobile && (
        <Button onClick={signOut} variant="outline" size="sm">
          Sign Out
        </Button>
      )}
    </header>
  );
}
