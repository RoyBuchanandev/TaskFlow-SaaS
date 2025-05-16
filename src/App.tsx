import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();


  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};


const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();


  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } />
            <Route path="/register" element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            } />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
