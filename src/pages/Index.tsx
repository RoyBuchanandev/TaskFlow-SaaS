import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, ArrowRight, Star, BarChart, Calendar, UserCheck, Layers, Zap, Lock, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const startSectionRef = useRef<HTMLElement>(null);

  const scrollToSection = () => {
    startSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      }),
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animation').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black selection:bg-blue-500/90 selection:text-white">
      <Navbar />
      
      <section className="hero-pattern min-h-screen flex items-center justify-center pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-[1200px]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 mb-8 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <span className="text-sm text-[#9b9ba4]">✨ Descubre la nueva forma de gestionar tareas</span>
              <ChevronRight className="w-4 h-4 ml-2 text-[#9b9ba4]" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gradient leading-[1.1] tracking-[-0.02em] mb-6">
              La plataforma completa para la gestión de tareas
            </h1>
            <p className="text-lg sm:text-xl text-[#9b9ba4] mb-12 max-w-2xl mx-auto leading-relaxed">
              TaskFlow Pro proporciona las herramientas y la infraestructura para construir, escalar y asegurar una gestión de tareas más rápida y personalizada.
            </p>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <div className="relative rounded-xl border border-gray-800 bg-black/40 backdrop-blur-sm p-2 transition-all duration-300 group-hover:border-gray-700">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="TaskFlow Pro Dashboard" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900/20"></div>
        <div className="container mx-auto max-w-[1200px] relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient tracking-tight">
              Todo lo que necesita tu equipo en un solo lugar
            </h2>
            <p className="text-lg text-[#9b9ba4] leading-relaxed">
              TaskFlow Pro ha sido diseñado para que los equipos logren más con menos esfuerzo.
              Gestiona tareas, colabora en tiempo real y mejora la productividad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layers className="h-8 w-8 text-[#0099ff]" />}
              title="Organización intuitiva"
              description="Organiza las tareas en tableros, listas y tarjetas. Prioriza y categoriza según tus necesidades."
              delay={1}
            />
            <FeatureCard 
              icon={<UserCheck className="h-8 w-8 text-blue-500" />}
              title="Asignación y responsabilidades"
              description="Asigna tareas, establece plazos y mantén a todos al tanto de sus responsabilidades."
              delay={2}
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-blue-500" />}
              title="Calendario integrado"
              description="Vista de calendario para planificar a corto y largo plazo. Sincronización con Google Calendar."
              delay={3}
            />
            <FeatureCard 
              icon={<BarChart className="h-8 w-8 text-blue-500" />}
              title="Análisis y reportes"
              description="Métricas visuales para seguir el progreso del equipo y optimizar los flujos de trabajo."
              delay={4}
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-blue-500" />}
              title="Automatizaciones"
              description="Automatiza tareas repetitivas con reglas personalizables y ahorra tiempo valioso."
              delay={5}
            />
            <FeatureCard 
              icon={<Lock className="h-8 w-8 text-blue-500" />}
              title="Seguridad avanzada"
              description="Protección de datos de nivel empresarial con control de acceso y cifrado de extremo a extremo."
              delay={6}
            />
          </div>
        </div>
      </section>

      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900/20"></div>
        <div className="container mx-auto max-w-[1200px] relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient tracking-tight">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-[#9b9ba4] leading-relaxed">
              Descubre cómo TaskFlow Pro ha ayudado a equipos de todo el mundo a mejorar su productividad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="TaskFlow Pro ha revolucionado nuestra forma de trabajar. Ahora todos en el equipo saben exactamente qué deben hacer y cuándo."
              author="María Rodríguez"
              role="Gerente de Proyecto, InnoTech"
              rating={5}
              delay={1}
            />
            <TestimonialCard 
              quote="Desde que adoptamos TaskFlow Pro, hemos reducido las reuniones innecesarias en un 40%. La comunicación fluye directamente en las tareas."
              author="Carlos Martínez"
              role="Director de Operaciones, AgileTeam"
              rating={5}
              delay={2}
            />
            <TestimonialCard 
              quote="La interfaz intuitiva y las funciones de automatización han hecho que la gestión de nuestros proyectos sea mucho más eficiente."
              author="Laura Sánchez"
              role="Líder de Equipo, CreativeStudio"
              rating={4}
              delay={3}
            />
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-black"></div>
        <div className="container mx-auto max-w-[1200px] relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient tracking-tight">
              Precios transparentes
            </h2>
            <p className="text-lg text-[#9b9ba4] leading-relaxed">
              Sin sorpresas ni costos ocultos. Elige el plan que mejor se adapte a las necesidades de tu equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              title="Básico"
              price="Gratis"
              description="Perfecto para equipos pequeños que están empezando"
              features={[
                "Hasta 5 usuarios",
                "Tableros ilimitados",
                "Tareas básicas",
                "Colaboración en tiempo real",
                "Aplicación móvil"
              ]}
              buttonText="Comenzar gratis"
              buttonLink="/register"
              delay={1}
            />
            <PricingCard 
              title="Profesional"
              price="12€"
              period="usuario / mes"
              description="Para equipos que necesitan más herramientas y capacidades"
              features={[
                "Usuarios ilimitados",
                "Tableros y tareas ilimitadas",
                "Campos personalizados",
                "Automatizaciones avanzadas",
                "Reportes y análisis",
                "Prioridad en soporte"
              ]}
              highlighted={true}
              buttonText="Probar gratis"
              buttonLink="/register"
              delay={2}
            />
            <PricingCard 
              title="Empresarial"
              price="25€"
              period="usuario / mes"
              description="Solución completa para empresas con necesidades avanzadas"
              features={[
                "Todo lo de Profesional",
                "Integraciones avanzadas",
                "SSO y funciones de seguridad",
                "Soporte prioritario 24/7",
                "Administración avanzada",
                "Personalización completa"
              ]}
              buttonText="Contactar ventas"
              buttonLink="/contact"
              delay={3}
            />
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient tracking-tight">
              Preguntas frecuentes
            </h2>
            <p className="text-lg text-[#9b9ba4] leading-relaxed">
              Todo lo que necesitas saber sobre TaskFlow Pro. ¿No encuentras la respuesta? Contáctanos.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-gray-800">
            <FAQItem 
              question="¿Qué es TaskFlow Pro?" 
              answer="TaskFlow Pro es una plataforma de gestión de tareas y proyectos diseñada para equipos pequeños y medianos. Ofrece herramientas para organizar el trabajo, colaborar en tiempo real y realizar un seguimiento del progreso de los proyectos."
              delay={1}
            />
            <FAQItem 
              question="¿Puedo probar TaskFlow Pro antes de pagar?" 
              answer="Sí, ofrecemos una prueba gratuita de 14 días para nuestros planes de pago. También tenemos un plan Básico gratuito con funcionalidades limitadas que puedes usar indefinidamente."
              delay={2}
            />
            <FAQItem 
              question="¿Cómo funciona la facturación?" 
              answer="Facturamos mensualmente o anualmente por usuario activo. Puedes elegir entre pago mensual o anual con un descuento. Solo pagas por los usuarios que realmente usan la plataforma."
              delay={3}
            />
            <FAQItem 
              question="¿Es seguro TaskFlow Pro para los datos de mi empresa?" 
              answer="Absolutamente. TaskFlow Pro utiliza cifrado de extremo a extremo, tiene certificaciones ISO 27001 y cumple con GDPR. Tus datos están protegidos y nunca se comparten con terceros."
              delay={4}
            />
            <FAQItem 
              question="¿Puedo integrar TaskFlow Pro con otras herramientas?" 
              answer="Sí, TaskFlow Pro se integra con muchas herramientas populares como Google Workspace, Microsoft 365, Slack, GitHub y más. Los planes Profesional y Empresarial incluyen integraciones avanzadas."
              delay={5}
            />
          </div>
        </div>
      </section>

      <section ref={startSectionRef} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[#0099ff] opacity-10"></div>
        <div className="container mx-auto max-w-[1200px] relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gradient tracking-tight">
              Empieza a impulsar la productividad de tu equipo hoy
            </h2>
            <p className="text-lg text-[#9b9ba4] mb-12 leading-relaxed">
              Únete a miles de equipos que ya han mejorado su forma de trabajar con TaskFlow Pro.
              Prueba gratis durante 14 días.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="gradient-bg w-full sm:w-auto text-base h-12 px-8"
                onClick={() => navigate('/register')}
              >
                Comienza gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-800 text-white hover:bg-white/10 w-full sm:w-auto text-base h-12 px-8"
                onClick={() => navigate('/contact')}
              >
                Contactar ventas
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay = 0 }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay?: number;
}) => {
  return (
    <div 
      className="p-8 rounded-xl border border-gray-800 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:bg-black/60 scroll-animation opacity-0 translate-y-10 group"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="h-12 w-12 rounded-lg bg-[#0099ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white tracking-tight">{title}</h3>
      <p className="text-[#9b9ba4] leading-relaxed">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role, rating = 5, delay = 0 }: { 
  quote: string; 
  author: string; 
  role: string;
  rating: number;
  delay?: number;
}) => {
  return (
    <div 
      className="p-8 rounded-xl border border-gray-800 bg-black/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:bg-black/60 scroll-animation opacity-0 translate-y-10 group"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-[#0099ff] fill-[#0099ff]" />
        ))}
      </div>
      <blockquote className="text-lg text-white mb-6 leading-relaxed">{quote}</blockquote>
      <div>
        <cite className="text-white font-semibold not-italic tracking-tight">{author}</cite>
        <p className="text-[#9b9ba4] text-sm mt-1">{role}</p>
      </div>
    </div>
  );
};

const PricingCard = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  buttonText, 
  buttonLink,
  highlighted = false,
  delay = 0
}: { 
  title: string; 
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
  delay?: number;
}) => {
  return (
    <div 
      className={`p-8 rounded-xl border ${
        highlighted ? 'border-[#0099ff]' : 'border-gray-800'
      } bg-black/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:bg-black/60 scroll-animation opacity-0 translate-y-10 ${
        highlighted ? 'relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-[#0099ff]/10 before:to-transparent before:rounded-xl before:-z-10' : ''
      }`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <h3 className="text-xl font-semibold mb-2 text-white tracking-tight">{title}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-white tracking-tight">{price}</span>
        {period && <span className="text-[#9b9ba4]">/{period}</span>}
      </div>
      <p className="text-[#9b9ba4] mb-8 leading-relaxed">{description}</p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-[#9b9ba4]">
            <Check className="h-5 w-5 text-[#0099ff] mr-3 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to={buttonLink}>
        <Button 
          className={`w-full h-12 ${highlighted ? 'gradient-bg' : 'border-gray-800 hover:bg-white/10'}`}
          variant={highlighted ? 'default' : 'outline'}
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

const FAQItem = ({ question, answer, delay = 0 }: { 
  question: string; 
  answer: string;
  delay?: number;
}) => {
  return (
    <div 
      className="py-8 scroll-animation opacity-0 translate-y-10 group"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <h3 className="text-lg font-medium text-white mb-3 tracking-tight group-hover:text-[#0099ff] transition-colors">{question}</h3>
      <p className="text-[#9b9ba4] leading-relaxed">{answer}</p>
    </div>
  );
};

export default Index;
