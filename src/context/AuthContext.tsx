import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { avatar_url?: string; full_name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configurar el listener de cambio de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    );

    // Verificar si hay una sesión existente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor, confirma tu email antes de iniciar sesión.');
        }
        throw error;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Este email ya está registrado. Por favor, inicia sesión.');
        } else if (error.message.includes('weak password')) {
          throw new Error('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
        }
        throw error;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrarse');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      throw new Error('Error al cerrar sesión');
    }
  };

  const updateProfile = async (updates: { avatar_url?: string; full_name?: string }) => {
    try {
      if (!user) throw new Error('No hay usuario autenticado');
      
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        if (error.message.includes('large')) {
          throw new Error('La imagen es demasiado grande. Máximo 1MB.');
        }
        throw error;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar el perfil');
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
