import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  Filter,
  SortAsc,
  SortDesc,
  Users,
  FolderKanban,
  Trash2,
  Pencil,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import AppPage from "@/components/layout/AppPage";
import SearchBar from "@/components/app/SearchBar";
import FilterPill from "@/components/app/FilterPill";
import { PrimaryPillButton } from "@/components/app/ActionButtons";

const MOCK_PROJECTS = [
  { id: 1, name: "TaskFlow App" },
  { id: 2, name: "Supermarché IA" },
  { id: 3, name: "Dashboard Analytics" },
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


const MOCK_MEMBERS = [
  {
    id: 1,
    projectId: 1,
    name: "Yosra",
    role: "Owner",
    email: "yosra@example.com",
    status: "online",
    joined: "Jan 2025",
    projects: 3,
    activity: 92,
    isOwner: true,
  },
  {
    id: 2,
    projectId: 1,
    name: "Alex",
    role: "Développeur",
    email: "alex@example.com",
    status: "away",
    joined: "Feb 2025",
    projects: 2,
    activity: 78,
    isOwner: false,
  },
  {
    id: 3,
    projectId: 2,
    name: "Sara",
    role: "Designer",
    email: "sara@example.com",
    status: "online",
    joined: "Dec 2024",
    projects: 4,
    activity: 88,
    isOwner: false,
  },
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

export default function Team() {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortKey, setSortKey] = useState("name");
  const [copiedId, setCopiedId] = useState(null);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const projectIdFromUrl = searchParams.get("projectId");


  useEffect(() => {
    const initialId = projectIdFromUrl
      ? Number(projectIdFromUrl)
      : MOCK_PROJECTS[0]?.id;
    setSelectedProjectId(initialId);

    const projMembers = MOCK_MEMBERS.filter(
      (m) => m.projectId === initialId
    );
    setMembers(projMembers);
  }, [projectIdFromUrl]);


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

  const currentProject = MOCK_PROJECTS.find(
    (p) => p.id === selectedProjectId
  );

  const handleProjectChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setSelectedProjectId(value);

    const projMembers = MOCK_MEMBERS.filter(
      (m) => m.projectId === value
    );
    setMembers(projMembers);

    const params = new URLSearchParams(location.search);
    if (value) params.set("projectId", String(value));
    else params.delete("projectId");
    navigate({ search: params.toString() }, { replace: true });
  };

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

  const handleDelete = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setMenuOpenId(null);
  };

  const handleEdit = (m) => {
    console.log("✏️ Modifier membre (front only):", m);
    setMenuOpenId(null);
  };

  const handleAddMemberClick = () => {
    if (!selectedProjectId) return;
    navigate(`/app/projects/${selectedProjectId}/add-member`);
  };

  const insights = useMemo(() => {
    if (!members.length) return { overloaded: null, needRole: null };
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
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/70 shadow-sm px-6 py-6 md:px-8 md:py-7 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-indigo-100 text-xs font-semibold text-indigo-600 shadow-sm">
                <Users className="h-4 w-4" />
                Espace équipe
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Équipe {currentProject ? `– ${currentProject.name}` : ""}
              </h1>

              {currentProject ? (
                <p className="text-sm text-slate-600">
                  {members.length} membre{members.length > 1 ? "s" : ""} •{" "}
                  <span className="font-medium text-emerald-600">
                    {onlineCount} en ligne
                  </span>
                </p>
              ) : (
                <p className="text-sm text-slate-600">
                  Choisis un projet pour voir son équipe et ses insights.
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-[260px]">
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500 block mb-1">
                  Projet courant
                </span>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-indigo-500">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <select
                    value={selectedProjectId || ""}
                    onChange={handleProjectChange}
                    className="w-full rounded-2xl border border-indigo-100 bg-white/80 pl-9 pr-9 py-2.5 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm appearance-none"
                  >
                    <option value="">
                      Sélectionner un projet
                    </option>
                    {MOCK_PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <SortDesc className="h-4 w-4 rotate-90" />
                  </div>
                </div>
              </div>

              {selectedProjectId && (
                <PrimaryPillButton icon={Plus} onClick={handleAddMemberClick}>
                  Inviter un membre
                </PrimaryPillButton>
              )}
            </div>
          </div>
        </div>


        {selectedProjectId && (
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
        )}


        {!selectedProjectId ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <Users className="h-10 w-10 text-indigo-500" />
            </div>
            <div className="space-y-2 max-w-xl">
              <h2 className="text-xl font-semibold text-slate-900">
                Aucun projet sélectionné
              </h2>
              <p className="text-sm text-slate-600">
                Sélectionne un projet dans la liste en haut à droite pour
                afficher son équipe, ou va dans l’onglet{" "}
                <span className="font-medium">Projets</span> pour en créer un
                nouveau.
              </p>
            </div>
          </div>
        ) : (
          <>
      
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
              {filtered.map((member, i) => {
                const config =
                  roleConfig[member.role] || roleConfig.Développeur;
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
                    <div className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-500 relative cursor-pointer max-w-full">
                      <div className="absolute top-7 right-7 pointer-events-none">
                        <div
                          className={`w-3.5 h-3.5 rounded-full ${
                            statusDot[member.status] || "bg-gray-400"
                          } shadow-lg`}
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
                            <Clock className="h-4 w-4" />
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
                    Insights d’équipe
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
                    <span className="text-gray-600">Suggestion :</span>{" "}
                    réassigner 2–3 tâches à un membre disponible.
                  </p>
                ) : (
                  <p className="text-gray-700 text-lg">
                    Aucune surcharge détectée ✅
                  </p>
                )}
                {insights.needRole && (
                  <p className="text-gray-700 text-lg mt-3">
                    Profil manquant :{" "}
                    <strong className="text-indigo-600">
                      {insights.needRole}
                    </strong>
                    . Ajouter ce rôle pourrait améliorer la vélocité.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppPage>
  );
}
