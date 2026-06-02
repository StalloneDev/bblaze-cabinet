"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Services", path: "/#services" },
    { label: "À Propos", path: "/#about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-auto bg-white p-1.5 rounded-lg border border-border flex items-center shrink-0 shadow-soft transition-bounce group-hover:scale-105">
              <Image
                src="/logo.jpg"
                alt="BBLAZE Logo"
                width={80}
                height={36}
                className="h-9 w-auto object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground leading-none">BBLAZE</h1>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mt-1">Cabinet Conseil</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-sm font-medium text-foreground hover:text-accent transition-smooth relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent after:scale-x-0 after:origin-right after:transition-transform hover:after:scale-x-100 hover:after:origin-left"
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-medium hover:scale-105 transition-smooth">
              <Link href="/contact">Demander un Service</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-smooth"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-sm font-medium text-foreground hover:text-accent transition-smooth py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2">
                <ThemeToggle />
                <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1 ml-4">
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Demander un Service</Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
