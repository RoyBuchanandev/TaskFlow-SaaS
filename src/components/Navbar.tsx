import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { scrollToSection } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-white">Task<span className="text-[#0099ff]">Flow</span> Pro</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Precios
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                    <AvatarFallback>{user.email ? user.email.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/95 border border-gray-800 text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "Usuario"}</p>
                    <p className="text-xs leading-none text-[#9b9ba4]">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="w-full cursor-pointer text-white hover:text-white hover:bg-white/10">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="hidden md:inline-flex text-white hover:text-white hover:bg-white/10"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="default"
                  className="bg-[#0099ff] text-white hover:bg-[#0099ff]/90"
                >
                  Comenzá gratis
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLinks = ({ 
  mobile = false, 
  user, 
  onSignOut,
  onSectionClick 
}: { 
  mobile?: boolean, 
  user: any,
  onSignOut: () => Promise<void>,
  onSectionClick: (sectionId: string) => void
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  const navLinks = [
    { name: "Inicio", path: "/", section: null },
    { name: "Características", path: "/#features", section: "features" },
    { name: "Precios", path: "/#pricing", section: "pricing" },
    { name: "Contacto", path: "/#contact", section: "contact" }
  ];

  const handleClick = (e: React.MouseEvent, link: { path: string, section: string | null }) => {
    if (link.section && isHomePage) {
      e.preventDefault();
      onSectionClick(link.section);
    }
  };

  const mobileClass = mobile ? "block px-3 py-2 rounded-md text-base font-medium" : "";
  const activeClass = "text-[#0099ff] font-medium";
  const inactiveClass = "text-[#9b9ba4] hover:text-white transition-colors duration-200";
  
  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          onClick={(e) => handleClick(e, link)}
          className={`${mobileClass} ${
            location.pathname === link.path ? activeClass : inactiveClass
          }`}
        >
          {link.name}
        </Link>
      ))}

      <div className={mobile ? "pt-4" : "flex items-center gap-3"}>
        {user ? (
          mobile ? (
            <div className="space-y-2">
              <Link to="/dashboard">
                <Button variant="outline" className="w-full flex justify-start border-gray-800 text-white hover:bg-white/10">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="destructive" size="default" className="w-full flex justify-start" onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                    <AvatarFallback>{user.email ? user.email.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/95 border border-gray-800 text-white" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "Usuario"}</p>
                    <p className="text-xs leading-none text-[#9b9ba4]">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="w-full cursor-pointer text-white hover:text-white hover:bg-white/10">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-red-500/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        ) : (
          <>
            <Link to="/login">
              <Button 
                variant="outline" 
                size={mobile ? "default" : "sm"} 
                className="border-gray-800 text-white hover:bg-white/10 h-9 px-4"
              >
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                size={mobile ? "default" : "sm"} 
                className="gradient-bg h-9 px-4"
              >
                Registrarse
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
