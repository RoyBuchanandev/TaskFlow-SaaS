import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">Task<span className="text-[#0099ff]">Flow</span> Pro</h1>
          </Link>
        </div>

        <Card className="bg-black/50 backdrop-blur-sm border border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Iniciar sesión</CardTitle>
            <CardDescription className="text-[#9b9ba4]">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-white">Contraseña</Label>
                  <Link to="/reset-password" className="text-xs text-[#0099ff] hover:text-[#0099ff]/90">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button className="w-full bg-[#0099ff] hover:bg-[#0099ff]/90 text-white" type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <p className="text-sm text-center text-[#9b9ba4]">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-[#0099ff] hover:text-[#0099ff]/90">
                  Regístrate
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
