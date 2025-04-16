
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layers, 
  MessageSquare, 
  Upload, 
  User, 
  Menu as MenuIcon, 
  X
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    { name: 'Collections', path: '/', icon: Layers },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Upload', path: '/upload', icon: Upload },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const MobileNavigation = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat Collection Genius</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {routes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md transition-colors",
                      location.pathname === route.path
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <route.icon className="h-5 w-5" />
                    <span>{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  const DesktopNavigation = () => (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 border-r bg-card">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold">Chat Collection Genius</h1>
          </div>
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === route.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <route.icon className="mr-3 h-5 w-5" />
                {route.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <header className="bg-background sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4">
          <MobileNavigation />
          <h1 className="text-lg font-semibold">Chat Collection Genius</h1>
        </header>
      ) : (
        <DesktopNavigation />
      )}
      <main
        className={cn(
          "flex-1 overflow-auto",
          isMobile ? "pt-4 pb-20" : "md:pl-64"
        )}
      >
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
