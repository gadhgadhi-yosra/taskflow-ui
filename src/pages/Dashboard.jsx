import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain, Zap, Target, TrendingUp, Sparkles, Plus, Clock, AlertCircle,
  CheckCircle, Users, Activity, Lightbulb, BarChart3, Calendar,
  MessageSquare, Smile, ArrowRight, Bot
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const stats = {
  aiUsage: "94%",
  tasksToday: 28,
  goalsReached: 21,
  productivity: "+38%"
};

const todayTasks = [
  { id: 1, title: "Finaliser maquette Figma", status: "late", priority: "Haute" },
  { id: 2, title: "Review PR backend", status: "today", priority: "Moyenne" },
  { id: 3, title: "Déploiement v2.1", status: "done", priority: "Haute" },
];

const activeProjects = [
  { name: "TaskFlow App", progress: 82, tasksOpen: 14, tasksDone: 46, color: "from-indigo-500 to-violet-600" },
  { name: "Refonte E-commerce", progress: 67, tasksOpen: 9, tasksDone: 31, color: "from-emerald-500 to-teal-600" },
  { name: "Dashboard Analytics", progress: 95, tasksOpen: 2, tasksDone: 58, color: "from-orange-500 to-pink-600" },
];

const teamLoad = [
  { name: "Yosra", tasks: 7, status: "normal" },
  { name: "Ahmed", tasks: 19, status: "overload" },
  { name: "Sara", tasks: 11, status: "medium" },
];

const recentActivity = [
  { user: "Yosra", action: "a terminé", task: "Design du Dashboard", time: "il y a 20 min" },
  { user: "Ahmed", action: "a créé", task: "Tâche urgente API", time: "il y a 1h" },
  { user: "IA TaskFlow", action: "a suggéré", task: "Fusion de 3 tâches similaires", time: "il y a 2h" },
];

const productivityData = [
  { day: "Lun", total: 18, ai: 14 },
  { day: "Mar", total: 24, ai: 19 },
  { day: "Mer", total: 20, ai: 16 },
  { day: "Jeu", total: 30, ai: 27 },
  { day: "Ven", total: 26, ai: 23 },
  { day: "Sam", total: 15, ai: 13 },
  { day: "Dim", total: 12, ai: 10 },
];

const aiFeatures = [
  { name: "Auto-génération", value: 38, color: "#8b5cf6" },
  { name: "Priorisation IA", value: 30, color: "#3b82f6" },
  { name: "Résumés", value: 18, color: "#10b981" },
  { name: "Suggestions", value: 14, color: "#f59e0b" },
];

const aiSuggestions = [
  "Fusionner les tâches 'Design Header' et 'Design Footer' ?",
  "Ahmed est surchargé → redistribuer 3 tâches ?",
  "Activer le mode Focus (productivité +42% en moyenne) ?"
];

export default function Dashboard() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [mood, setMood] = useState(null);

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-black dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">


          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Bon retour !
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Ton assistant IA analyse tout en temps réel • {new Date().toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </motion.div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Brain, label: "IA utilisée", value: stats.aiUsage, gradient: "from-violet-500 to-purple-600" },
              { icon: Zap, label: "Tâches aujourd'hui", value: stats.tasksToday, gradient: "from-blue-500 to-cyan-500" },
              { icon: Target, label: "Objectifs atteints", value: stats.goalsReached, gradient: "from-emerald-500 to-teal-600" },
              { icon: TrendingUp, label: "Productivité", value: stats.productivity, gradient: "from-orange-500 to-pink-600" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Card className="p-6 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/30 hover:scale-105 transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-4xl font-black mt-1 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

   
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Calendar className="h-8 w-8 text-indigo-600" /> Ma Journée
              </h2>
              <Button asChild>
                <Link to="/tasks" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Nouvelle tâche
                </Link>
              </Button>
            </div>

            <Card className="p-6 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/30">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold">Avancement journalier</span>
                <span className="text-2xl font-bold text-indigo-600">71%</span>
              </div>
              <Progress value={71} className="h-4 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {todayTasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border-2 ${
                      task.status === "late" ? "border-red-500 bg-red-50 dark:bg-red-950/30" :
                      task.status === "done" ? "border-green-500 bg-green-50 dark:bg-green-950/30" :
                      "border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{task.title}</p>
                      {task.status === "late" && <AlertCircle className="h-5 w-5 text-red-600" />}
                      {task.status === "done" && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <Badge className="mt-2" variant={task.priority === "Haute" ? "destructive" : "secondary"}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </section>

      
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-violet-600" /> Projets actifs
              </h2>
              <Button variant="outline" asChild>
                <Link to="/projects">Voir tout <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeProjects.map((proj, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="p-6 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/30">
                    <h3 className="text-xl font-bold mb-3">{proj.name}</h3>
                    <Progress value={proj.progress} className="h-3 mb-4" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{proj.tasksOpen} en cours</span>
                      <span className="text-green-600">{proj.tasksDone} terminées</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

     
          <div className="grid lg:grid-cols-2 gap-10">
            <Card className="p-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/30">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="h-7 w-7 text-emerald-600" /> Charge de travail
              </h3>
              <div className="space-y-6">
                {teamLoad.map((m) => (
                  <div key={m.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{m.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-sm text-muted-foreground">{m.tasks} tâches assignées</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${m.status === "overload" ? "bg-red-500" : m.status === "medium" ? "bg-orange-500" : "bg-green-500"} animate-pulse`} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/30">
              <h3 className="text-2xl font-bold mb-6">Comment vas-tu aujourd’hui ?</h3>
              <div className="flex justify-center gap-10 text-7xl">
                {["happy", "neutral", "sad"].map((feeling) => (
                  <button
                    key={feeling}
                    onClick={() => setMood(feeling)}
                    className={`transition hover:scale-125 ${mood === feeling ? "scale-125" : ""}`}
                  >
                    {feeling === "happy" ? "great" : feeling === "neutral" ? "neutral" : "sad"}
                  </button>
                ))}
              </div>
              {mood && (
                <p className="text-center mt-8 text-lg font-medium">
                  Merci ! Tu te sens <span className="text-indigo-600 font-bold">
                    {mood === "happy" ? "au top" : mood === "neutral" ? "correct" : "fatigué"}
                  </span> aujourd’hui.
                </p>
              )}
            </Card>
          </div>


          <Card className="p-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/30">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Activity className="h-7 w-7 text-blue-600" /> Activité récente
            </h3>
            <div className="space-y-5">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    {act.user === "IA TaskFlow" ? <Bot className="h-5 w-5" /> : act.user[0]}
                  </div>
                  <div className="flex-1">
                    <p>
                      <strong>{act.user}</strong> {act.action} <strong>{act.task}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          
          <section className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-3xl p-8 border border-indigo-300 dark:border-indigo-700">
            <h3 className="text-3xl font-bold mb-8 flex items_center gap-4">
              <Lightbulb className="h-9 w-9 text-yellow-500" /> Suggestions intelligentes de TaskFlow IA
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {aiSuggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="p-6 bg-white/80 dark:bg-black/70 rounded-2xl shadow-lg hover:shadow-2xl transition"
                >
                  <p className="text-lg mb-4">{s}</p>
                  <Button size="sm" className="w-full">
                    Oui, applique
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>

      
          <div className="grid lg:grid-cols-2 gap-10">
            <Card className="p-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/30">
              <h3 className="text-2xl font-bold mb-6">Productivité cette semaine</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#94a3b8" strokeWidth={3} />
                  <Line type="monotone" dataKey="ai" stroke="#8b5cf6" strokeWidth={5} dot={{ fill: "#8b5cf6" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-8 bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-white/30">
              <h3 className="text-2xl font-bold mb-6">Fonctionnalités IA utilisées</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={aiFeatures} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                    {aiFeatures.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

    
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        >
          <Brain className="h-9 w-9 text-white animate-pulse" />
        </motion.button>
      </div>

      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </>
  );
}


