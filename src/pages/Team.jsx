import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  Mail,
  MoreVertical,
  Shield,
  Crown,
  Sparkles,
  UserCheck,
  Globe,
  Clock,
  Copy,
  X,
  Filter,
  SortAsc,
  SortDesc,
  MessageSquareMore,
  BarChart3,
  ListChecks,
  Trash2,
  Pencil,
} from "lucide-react";

import AppPage from "@/components/layout/AppPage";
import SearchBar from "@/components/app/SearchBar";
import FilterPill from "@/components/app/FilterPill";
import { PrimaryPillButton } from "@/components/app/ActionButtons";


const teamMembersSeed = [
  {
    id: 1,
    name: "Alex Dupont",
    role: "Owner",
    email: "alex@taskflow.com",
    status: "online",
    joined: "Jan 2024",
    projects: 12,
    isOwner: true,
    activity: 92,
  },
  {
    id: 2,
    name: "Sophie Martin",
    role: "Designer",
    email: "sophie@taskflow.com",
    status: "away",
    joined: "Mar 2024",
    projects: 8,
    activity: 76,
  },
  {
    id: 3,
    name: "Jean Leclerc",
    role: "Développeur",
    email: "jean@taskflow.com",
    status: "online",
    joined: "Fév 2024",
    projects: 15,
    activity: 88,
  },
  {
    id: 4,
    name: "Emma Dubois",
    role: "Manager",
    email: "emma@taskflow.com",
    status: "offline",
    joined: "Avr 2024",
    projects: 6,
    activity: 64,
  },
  {
    id: 5,
    name: "Lucas Moreau",
    role: "Développeur",
    email: "lucas@taskflow.com",
    status: "online",
    joined: "Juin 2024",
    projects: 10,
    activity: 81,
  },
];

const roleConfig = {
  Owner: { gradient: "from-purple-600 to-indigo-600", icon: Crown },
  Admin: { gradient: "from-rose-500 to-pink-600", icon: Shield },
  Manager: { gradient: "from-blue-500 to-cyan-600", icon: UserCheck },
  Designer: { gradient: "from-violet-500 to-purple-600", icon: Sparkles },
  Développeur: { gradient: "from-emerald-500 to-teal-600", icon: Globe },
};

const statusDot = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-gray-400",
};

const ROLES = ["Tous", "Owner", "Admin", "Manager", "Designer", "Développeur"];
const STATUTS = ["Tous", "online", "away", "offline"];
const SORTS = [
  { key: "name", label: "Nom (A→Z)" },
  { key: "-name", label: "Nom (Z→A)" },
  { key: "projects", label: "Projets ↑" },
  { key: "-projects", label: "Projets ↓" },
  { key: "activity", label: "Activité ↑" },
  { key: "-activity", label: "Activité ↓" },
];


const initialsOf = (fullName) =>
  fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const sortByKey = (arr, key) => {
  const desc = key.startsWith("-");
  const k = desc ? key.slice(1) : key;
  const sorted = [...arr].sort((a, b) => {
    const va = (a[k] ?? "").toString().toLowerCase();
    const vb = (b[k] ?? "").toString().toLowerCase();
    if (!isNaN(+va) && !isNaN(+vb)) return +va - +vb;
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
  return desc ? sorted.reverse() : sorted;
};


function MemberModal({ open, onClose, member, onPromote, onMessage }) {
  if (!open || !member) return null;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const Config = roleConfig[member.role] || roleConfig["Développeur"];
  const Icon = Config.icon || Shield;

  const modalUI = (
    <div className="fixed inset-0 z-[9999]">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />

      <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 180 }}
          className="pointer-events-auto w-full max-w-2xl"
        >
          <div className="rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">

            <div className="p-6 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-b border-indigo-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 p-1.5 shadow">
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-xl font-bold text-gray-800">
                      {initialsOf(member.name)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {member.name}
                    </h3>
                    <div
                      className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${Config.gradient} text-white text-xs font-bold`}
                    >
                      <Icon className="h-4 w-4" /> {member.role}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-black/5 transition"
                  aria-label="Fermer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>


            <div className="p-6 space-y-5">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{member.email}</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-gray-500">Depuis</p>
                  <p className="font-medium">{member.joined}</p>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-gray-500">Projets</p>
                  <p className="font-medium">{member.projects}</p>
                </div>
              </div>

              <div className="rounded-2xl border p-4">
                <p className="text-sm text-gray-500 mb-2">Activité</p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                      style={{ width: `${member.activity}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {member.activity}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Estimation basée sur tâches terminées / commentaires /
                  mentions.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onMessage(member)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
                >
                  <MessageSquareMore className="h-5 w-5" /> Envoyer un
                  message
                </button>
                <button
                  onClick={() => onPromote(member)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
                >
                  <Shield className="h-5 w-5" /> Promouvoir (Admin)
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition">
                  <ListChecks className="h-5 w-5" /> Voir ses tâches
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 transition">
                  <BarChart3 className="h-5 w-5" /> Statistiques
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return createPortal(
    <AnimatePresence>{open ? modalUI : null}</AnimatePresence>,
    document.body
  );
}

export default function Team() {
  const [members, setMembers] = useState(teamMembersSeed);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortKey, setSortKey] = useState("name");
  const [copiedId, setCopiedId] = useState(null);


  const [openModal, setOpenModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);


  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);


  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target)) return;
      setMenuOpenId(null);
    }
    if (menuOpenId !== null) {
      document.addEventListener("mousedown", onDocClick);
    }
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpenId]);

  const onlineCount = members.filter((m) => m.status === "online").length;

  const filtered = useMemo(() => {
    let arr = members.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase())
    );
    if (roleFilter !== "Tous") arr = arr.filter((m) => m.role === roleFilter);
    if (statusFilter !== "Tous")
      arr = arr.filter((m) => m.status === statusFilter);
    return sortByKey(arr, sortKey);
  }, [members, search, roleFilter, statusFilter, sortKey]);

  const copyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const openMember = (m) => {
    setSelectedMember(m);
    setOpenModal(true);
  };

  const handlePromote = (m) => {
    setMembers((prev) =>
      prev.map((x) =>
        x.id === m.id ? { ...x, role: "Admin", isOwner: x.isOwner } : x
      )
    );
    setOpenModal(false);
  };

  const handleEdit = (m) => {
    setSelectedMember(m);
    setOpenModal(true);
    setMenuOpenId(null);
  };

  const handleDelete = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setMenuOpenId(null);
  };

  const insights = useMemo(() => {
    const overloaded = members
      .map((m) => ({ ...m, overloadScore: m.projects * 5 - m.activity }))
      .sort((a, b) => b.overloadScore - a.overloadScore)[0];
    const needRole = members.some((m) => m.role === "Designer")
      ? null
      : "Designer";
    return { overloaded, needRole };
  }, [members]);

  return (
    <AppPage>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Équipe</h1>
              <p className="text-sm text-slate-500 mt-2">
                {members.length} membres • {onlineCount} en ligne
              </p>
            </div>

            <PrimaryPillButton icon={Plus}>
              Inviter un membre
            </PrimaryPillButton>
          </div>
        </div>


        <div className="mb-12 flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre, rôle ou email..."
            wrapperClassName="flex-1 min-w-[260px] max-w-xl"
          />

          <FilterPill
            icon={Filter}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={ROLES.map((r) => ({ value: r, label: r }))}
          />

          <FilterPill
            icon={Clock}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={STATUTS.map((s) => ({ value: s, label: s }))}
          />

          <FilterPill
            icon={sortKey.startsWith("-") ? SortDesc : SortAsc}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            options={SORTS.map((s) => ({ value: s.key, label: s.label }))}
          />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
          {filtered.map((member, i) => {
            const config = roleConfig[member.role] || roleConfig.Développeur;
            const Icon = config.icon;
            const isMenuOpen = menuOpenId === member.id;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="w-full"
              >
                <div
                  className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-500 relative cursor-pointer max-w-full"
                  onClick={() => openMember(member)}
                >
          
                  <div className="absolute top-7 right-7 pointer-events-none">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${statusDot[member.status]} shadow-lg`}
                    />
                  </div>

        
                  <button
                    className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition pointer-events-auto"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(isMenuOpen ? null : member.id);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Actions"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-700" />
                  </button>

 
                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute top-14 right-6 z-20 w-48 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                        onClick={() => handleEdit(member)}
                      >
                        <Pencil className="h-4 w-4" /> Modifier
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </button>
                    </div>
                  )}

       
                  <div className="flex items-start gap-6 mb-7">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-600 p-1.5 shadow-xl">
                        <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center text-2xl font-bold text-gray-800">
                          {initialsOf(member.name)}
                        </div>
                      </div>
                      {member.isOwner && (
                        <Crown className="absolute -top-3 -right-3 h-8 w-8 text-yellow-500 fill-yellow-500 drop-shadow-md" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {member.name}
                      </h3>
                      <div
                        className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-xs font-bold`}
                      >
                        <Icon className="h-4 w-4" />
                        {member.role}
                      </div>
                    </div>
                  </div>

     
                  <div className="space-y-5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Email</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyEmail(member.email, member.id);
                        }}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
                        title="Copier l'email"
                      >
                        <Copy className="h-4 w-4" />
                        {copiedId === member.id ? "Copié !" : "Copier"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-2">
                        Depuis {member.joined}
                      </div>
                      <div className="flex items-center gap-2">
                        {member.projects} projets
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                          style={{ width: `${member.activity}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">
                        {member.activity}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>


        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-3xl p-8 border border-indigo-200/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-7 w-7 text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Insights IA d’équipe
              </h3>
            </div>
            {insights.overloaded ? (
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong className="text-indigo-600">
                  {insights.overloaded.name}
                </strong>{" "}
                semble en surcharge (projets :{" "}
                <strong>{insights.overloaded.projects}</strong>, activité :{" "}
                <strong>{insights.overloaded.activity}%</strong>).
                <br />
                <span className="text-gray-600">Suggestion :</span> réassigner
                2–3 tâches à un membre disponible.
              </p>
            ) : (
              <p className="text-gray-700 text-lg">
                Aucune surcharge détectée ✅
              </p>
            )}
            {insights.needRole && (
              <p className="text-gray-700 text-lg mt-3">
                Profil manquant :{" "}
                <strong className="text-indigo-600">{insights.needRole}</strong>
                . Ajouter ce rôle pourrait améliorer la vélocité.
              </p>
            )}
            <div className="mt-6 flex gap-4">
              <button className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:scale-105 transition-all shadow-lg">
                Réassignation automatique
              </button>
              <button className="px-7 py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-semibold hover:bg-indigo-50 transition-all">
                Voir recommandations
              </button>
            </div>
          </div>
        </div>
      </div>


      <MemberModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        member={selectedMember}
        onPromote={handlePromote}
        onMessage={(m) => alert(`Message à ${m.name}`)}
      />
    </AppPage>
  );
}
