import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí iría la lógica para enviar el mensaje
      // Por ahora solo mostraremos un toast de éxito
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      // Limpiar el formulario
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar el mensaje. Por favor, intenta de nuevo.",
      });
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
            <CardTitle className="text-white">Contacta con ventas</CardTitle>
            <CardDescription className="text-[#9b9ba4]">
              Envíanos un mensaje y te responderemos lo antes posible
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
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
                <Label htmlFor="message" className="text-white">Mensaje</Label>
                <Textarea
                  id="message"
                  placeholder="¿En qué podemos ayudarte?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500 min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-[#0099ff] hover:bg-[#0099ff]/90 text-white" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Contact; 