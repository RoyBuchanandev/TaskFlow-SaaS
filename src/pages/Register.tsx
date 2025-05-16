import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor ingresa un email válido");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      
      if (data.user && data.session) {
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada correctamente.",
        });
        navigate("/dashboard");
      } else {
        setSuccess(true);
      }
    } catch (error: any) {
      setError(error.message || "Error al crear la cuenta. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Verifica tu email</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Hemos enviado un enlace de confirmación a <strong>{email}</strong>.
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
          </p>
          <Button asChild>
            <Link to="/">Volver a la página de inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

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
            <CardTitle className="text-white">Crear cuenta</CardTitle>
            <CardDescription className="text-[#9b9ba4]">
              Introduce tus datos para crear una cuenta en TaskFlow Pro
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Te hemos enviado un email de confirmación. Por favor, revisa tu bandeja de entrada.
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Nombre y apellido"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500"
                />
              </div>
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
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-[#9b9ba4]">
                  La contraseña debe tener al menos 8 caracteres
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button className="w-full bg-[#0099ff] hover:bg-[#0099ff]/90 text-white" type="submit" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
              <p className="text-sm text-center text-[#9b9ba4]">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-[#0099ff] hover:text-[#0099ff]/90">
                  Inicia sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
