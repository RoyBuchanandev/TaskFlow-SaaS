import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Calendar, CheckCheck, Clock, Plus, User, Users, Menu, Search, Grid, List, LogOut, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Tipos para las tareas
type TaskPriority = "low" | "medium" | "high";
type TaskStatus = "pending" | "in_progress" | "review" | "completed";
type TaskAssignee = {
  id: string;
  name: string;
  avatar?: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee?: TaskAssignee;
  createdAt: string;
};

// Datos de ejemplo para el dashboard
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Diseñar logo de la empresa",
    description: "Crear varias propuestas de logotipo para la revisión del cliente",
    status: "in_progress",
    priority: "high",
    dueDate: "2025-05-20",
    assignee: {
      id: "user-1",
      name: "Ana García",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    createdAt: "2025-05-12",
  },
  {
    id: "task-2",
    title: "Desarrollar página de inicio",
    description: "Implementar diseño responsivo usando React y Tailwind CSS",
    status: "pending",
    priority: "medium",
    dueDate: "2025-05-22",
    assignee: {
      id: "user-2",
      name: "Carlos López",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    createdAt: "2025-05-14",
  },
  {
    id: "task-3",
    title: "Optimizar SEO del sitio web",
    description: "Mejorar meta etiquetas y estructura para mejor posicionamiento",
    status: "review",
    priority: "medium",
    dueDate: "2025-05-18",
    assignee: {
      id: "user-3",
      name: "Laura Martínez",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    createdAt: "2025-05-10",
  },
  {
    id: "task-4",
    title: "Preparar propuesta de cliente",
    description: "Redactar documento con alcance, plazos y presupuesto del proyecto",
    status: "completed",
    priority: "high",
    dueDate: "2025-05-15",
    assignee: {
      id: "user-1",
      name: "Ana García",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    createdAt: "2025-05-08",
  },
  {
    id: "task-5",
    title: "Configurar servidor de producción",
    description: "Instalar y configurar entorno de producción para la aplicación",
    status: "pending",
    priority: "high",
    dueDate: "2025-05-25",
    assignee: {
      id: "user-4",
      name: "Daniel Fernández",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    createdAt: "2025-05-15",
  }
];

const sampleTeam: TaskAssignee[] = [
  { id: "user-1", name: "Ana García", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "user-2", name: "Carlos López", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "user-3", name: "Laura Martínez", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "user-4", name: "Daniel Fernández", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: "user-5", name: "María Rodríguez", avatar: "https://i.pravatar.cc/150?img=5" }
];

// Mapeo para etiquetas visuales
const statusLabels: Record<TaskStatus, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-gray-500" },
  in_progress: { label: "En progreso", color: "bg-blue-500" },
  review: { label: "En revisión", color: "bg-amber-500" },
  completed: { label: "Completada", color: "bg-green-500" }
};

const priorityLabels: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Baja", color: "bg-green-500" },
  medium: { label: "Media", color: "bg-amber-500" },
  high: { label: "Alta", color: "bg-red-500" }
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'calendar' | 'team' | 'settings'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: new Date().toISOString().split('T')[0]
  });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al cerrar sesión. Por favor, intenta de nuevo."
      });
    }
  };

  // Efecto para simular carga de datos
  useEffect(() => {
    // En una aplicación real, aquí cargaríamos datos desde Supabase
    setTasks(sampleTasks);
  }, []);

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Manejar creación de nueva tarea
  const handleCreateTask = () => {
    // Validación de entradas
    if (!newTask.title?.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El título de la tarea es obligatorio.",
      });
      return;
    }

    if (newTask.title.length > 100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El título no puede exceder los 100 caracteres.",
      });
      return;
    }

    if (newTask.description && newTask.description.length > 500) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La descripción no puede exceder los 500 caracteres.",
      });
      return;
    }

    // Sanitización de entradas
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title.trim(),
      description: newTask.description?.trim() || "",
      status: newTask.status as TaskStatus || "pending",
      priority: newTask.priority as TaskPriority || "medium",
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      assignee: newTask.assignee
    };

    // Validar fecha límite
    if (new Date(task.dueDate) < new Date()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La fecha límite no puede ser anterior a hoy.",
      });
      return;
    }

    setTasks(prev => [task, ...prev]);
    setNewTaskOpen(false);
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Tarea creada",
      description: "La tarea ha sido creada correctamente.",
    });
  };

  // Manejar cambio de estado de una tarea
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    
    toast({
      title: "Estado actualizado",
      description: `Tarea actualizada a: ${statusLabels[newStatus].label}`,
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'calendar':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-white mb-4">Calendario</h2>
            <Card className="bg-black/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Próximos eventos y tareas</CardTitle>
                <CardDescription className="text-[#9b9ba4]">
                  Visualiza y gestiona tus tareas en el calendario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-[#9b9ba4] py-8">
                  Funcionalidad de calendario en desarrollo
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'team':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-white mb-4">Equipo</h2>
            <Card className="bg-black/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Miembros del equipo</CardTitle>
                <CardDescription className="text-[#9b9ba4]">
                  Gestiona los miembros de tu equipo y sus roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleTeam.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-black/30">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{member.name}</p>
                          <p className="text-sm text-[#9b9ba4]">Miembro del equipo</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-[#9b9ba4] hover:text-white hover:bg-white/10">
                        Ver perfil
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-white mb-4">Configuración</h2>
            <Card className="bg-black/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Preferencias de usuario</CardTitle>
                <CardDescription className="text-[#9b9ba4]">
                  Gestiona tus preferencias y configuración de la cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Nombre</Label>
                    <Input
                      id="name"
                      value={user?.user_metadata?.full_name || ''}
                      className="bg-black/50 border-gray-800 text-white"
                      placeholder="Tu nombre"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      className="bg-black/50 border-gray-800 text-white"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9b9ba4]" />
                  <Input
                    placeholder="Buscar tareas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-800 text-white placeholder:text-gray-500 w-full sm:w-[250px]"
                  />
                </div>
                
                <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#0099ff] text-white hover:bg-[#0099ff]/90 w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva tarea
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/95 border border-gray-800 w-[95%] sm:w-full max-w-lg mx-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white">Crear nueva tarea</DialogTitle>
                      <DialogDescription className="text-[#9b9ba4]">
                        Completa los detalles de la nueva tarea
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Título</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          placeholder="Título de la tarea"
                          className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">Descripción</Label>
                        <Textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          placeholder="Describe la tarea..."
                          className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority" className="text-white">Prioridad</Label>
                          <Select
                            value={newTask.priority}
                            onValueChange={(value: TaskPriority) => setNewTask({ ...newTask, priority: value })}
                          >
                            <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                              <SelectValue placeholder="Seleccionar prioridad" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/95 border-gray-800">
                              <SelectItem value="low" className="text-white hover:bg-white/10">Baja</SelectItem>
                              <SelectItem value="medium" className="text-white hover:bg-white/10">Media</SelectItem>
                              <SelectItem value="high" className="text-white hover:bg-white/10">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate" className="text-white">Fecha límite</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            className="bg-black/50 border-gray-800 text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setNewTaskOpen(false)} className="text-white hover:bg-white/10">
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateTask} className="bg-[#0099ff] text-white hover:bg-[#0099ff]/90">
                        Crear tarea
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-6">
              <Card className="bg-black/50 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Vista general</CardTitle>
                  <CardDescription className="text-[#9b9ba4]">
                    Resumen de todas las tareas y su estado actual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="flex items-center gap-2 text-[#9b9ba4] mb-2">
                        <CheckCheck className="h-4 w-4" />
                        <span>Completadas</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {tasks.filter(t => t.status === "completed").length}
                      </p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="flex items-center gap-2 text-[#9b9ba4] mb-2">
                        <Clock className="h-4 w-4" />
                        <span>En progreso</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {tasks.filter(t => t.status === "in_progress").length}
                      </p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="flex items-center gap-2 text-[#9b9ba4] mb-2">
                        <User className="h-4 w-4" />
                        <span>Asignadas</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {tasks.filter(t => t.assignee).length}
                      </p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="flex items-center gap-2 text-[#9b9ba4] mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>Próximas</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {tasks.filter(t => new Date(t.dueDate) > new Date()).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilterStatus(value as TaskStatus | "all")}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <TabsList className="bg-black/30 border border-gray-800 w-full sm:w-auto">
                      <TabsTrigger value="all" className="text-white data-[state=active]:bg-[#0099ff]">Todas</TabsTrigger>
                      <TabsTrigger value="pending" className="text-white data-[state=active]:bg-[#0099ff]">Pendientes</TabsTrigger>
                      <TabsTrigger value="in_progress" className="text-white data-[state=active]:bg-[#0099ff]">En progreso</TabsTrigger>
                      <TabsTrigger value="completed" className="text-white data-[state=active]:bg-[#0099ff]">Completadas</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode("grid")}
                        className={`text-white hover:bg-white/10 ${viewMode === "grid" ? "bg-white/10" : ""}`}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode("list")}
                        className={`text-white hover:bg-white/10 ${viewMode === "list" ? "bg-white/10" : ""}`}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="all" className="mt-0">
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.map(task => (
                          <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <TaskTable tasks={filteredTasks} onStatusChange={handleStatusChange} />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-black/50 backdrop-blur-sm border-b md:border-r border-gray-800 md:min-h-screen">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Task<span className="text-[#0099ff]">Flow</span> Pro</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
            <Menu />
          </Button>
        </div>
        
        <div className="p-4 hidden md:block">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-white/10 ${activeSection === 'dashboard' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-white/10 ${activeSection === 'calendar' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveSection('calendar')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendario
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-white/10 ${activeSection === 'team' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveSection('team')}
            >
              <Users className="mr-2 h-4 w-4" />
              Equipo
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-white/10 ${activeSection === 'settings' ? 'bg-white/10' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Button>
          </div>
          
          <Separator className="my-4 bg-gray-800" />
        </div>
        
        <div className="fixed bottom-0 left-0 w-64 p-4 border-t border-gray-800 bg-black/50 backdrop-blur-sm hidden md:block">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || user?.email} />
              <AvatarFallback>{user?.email ? user.email.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">{user?.user_metadata?.full_name || "Usuario"}</p>
              <p className="text-xs text-[#9b9ba4]">{user?.email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto text-white hover:bg-white/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Mobile menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-gray-800 p-4 flex justify-between items-center md:hidden">
        <Button 
          variant="ghost" 
          className={`text-white hover:bg-white/10 ${activeSection === 'dashboard' ? 'bg-white/10' : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          <BarChart className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          className={`text-white hover:bg-white/10 ${activeSection === 'calendar' ? 'bg-white/10' : ''}`}
          onClick={() => setActiveSection('calendar')}
        >
          <Calendar className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          className={`text-white hover:bg-white/10 ${activeSection === 'team' ? 'bg-white/10' : ''}`}
          onClick={() => setActiveSection('team')}
        >
          <Users className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          className={`text-white hover:bg-white/10 ${activeSection === 'settings' ? 'bg-white/10' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

// Componente de tarjeta de tarea
const TaskCard = ({ task, onStatusChange }: { 
  task: Task; 
  onStatusChange: (id: string, status: TaskStatus) => void;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${priorityLabels[task.priority].color} hover:${priorityLabels[task.priority].color}`}>
            {priorityLabels[task.priority].label}
          </Badge>
          <StatusBadge status={task.status} onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)} />
        </div>
        <CardTitle className="text-lg mt-2">{task.title}</CardTitle>
        <CardDescription className="line-clamp-2">{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatDueDate(task.dueDate)}
          </div>
          {task.assignee && (
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-1">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de tabla de tareas
const TaskTable = ({ tasks, onStatusChange }: { 
  tasks: Task[]; 
  onStatusChange: (id: string, status: TaskStatus) => void;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarea</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prioridad</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha límite</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asignado a</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="py-4 px-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</p>
                </div>
              </td>
              <td className="py-4 px-4">
                <StatusBadge status={task.status} onStatusChange={(newStatus) => onStatusChange(task.id, newStatus)} />
              </td>
              <td className="py-4 px-4">
                <Badge className={`${priorityLabels[task.priority].color} hover:${priorityLabels[task.priority].color}`}>
                  {priorityLabels[task.priority].label}
                </Badge>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDueDate(task.dueDate)}
              </td>
              <td className="py-4 px-4">
                {task.assignee ? (
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={task.assignee.avatar} />
                      <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Sin asignar</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente de estado de tarea
const StatusBadge = ({ status, onStatusChange }: {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}) => {
  return (
    <Select
      defaultValue={status}
      onValueChange={(value) => onStatusChange(value as TaskStatus)}
    >
      <SelectTrigger className={`border-0 ${statusLabels[status].color} text-white w-auto h-6 text-xs px-2 rounded`}>
        <SelectValue>{statusLabels[status].label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending" className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
          <span>Pendiente</span>
        </SelectItem>
        <SelectItem value="in_progress" className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span>En progreso</span>
        </SelectItem>
        <SelectItem value="review" className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
          <span>En revisión</span>
        </SelectItem>
        <SelectItem value="completed" className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span>Completada</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

// Componente para estado vacío
const EmptyTasksState = ({ status }: { status?: TaskStatus }) => {
  const messages = {
    pending: "No hay tareas pendientes",
    in_progress: "No hay tareas en progreso",
    review: "No hay tareas en revisión",
    completed: "No hay tareas completadas",
    default: "No hay tareas que coincidan con tu búsqueda"
  };
  
  const message = status ? messages[status] : messages.default;
  
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <CheckCheck className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{message}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        {status 
          ? "Añade nuevas tareas usando el botón 'Nueva tarea' en la parte superior."
          : "Intenta ajustando tus filtros de búsqueda o crea una nueva tarea."}
      </p>
    </div>
  );
};

// Función auxiliar para formatear fechas
function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Hoy";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Mañana";
  } else {
    // Formato español: dd/mm/yyyy
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }
}

export default Dashboard;
