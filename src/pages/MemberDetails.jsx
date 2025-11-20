
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Shield,
  Users,
  Activity,
  Clock,
} from "lucide-react";
import AppPage from "@/components/layout/AppPage";

const TEAM_MEMBERS_STORAGE_KEY = "taskflow_team_members";

const initialsOf = (fullName) =>
  fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export default function MemberDetails() {
  const { projectId, memberId } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [member, setMember] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setMembers(list);
      const m = list.find((x) => String(x.id) === String(memberId));
      setMember(m || null);
    } catch (err) {
      console.error("Erreur lecture storage team :", err);
    }
  }, [memberId]);

  const title = useMemo(() => {
    if (!member) return "Membre introuvable";
    return member.name;
  }, [member]);

  if (!member) {
    return (
      <AppPage>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate(`/app/team?projectId=${projectId}`)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 mb-6 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l’équipe
          </button>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Membre introuvable
          </h1>
          <p className="text-sm text-slate-600">
            Impossible de trouver ce membre dans les données locales.
          </p>
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <button
          onClick={() => navigate(`/app/team?projectId=${projectId}`)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 mb-2 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l’équipe
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 shadow-xl">
              <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center text-3xl font-bold text-slate-900">
                {initialsOf(member.name)}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {title}
              </h1>
              <p className="text-sm text-slate-500 break-all flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                {member.email}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold mt-2">
                <Shield className="h-3.5 w-3.5" />
                {member.role}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase">Statut</p>
              <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    member.status === "online"
                      ? "bg-emerald-500"
                      : member.status === "away"
                      ? "bg-amber-500"
                      : "bg-gray-400"
                  }`}
                />
                {member.status}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase">Depuis</p>
              <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                {member.joined}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase">
                Projets
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                {member.projects}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500 uppercase">
              Activité estimée
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                  style={{ width: `${member.activity}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                <Activity className="h-4 w-4 text-indigo-500" />
                {member.activity}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppPage>
  );
}
