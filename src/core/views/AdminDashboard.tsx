import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { defaultFirebaseConfig, getStoredFirebaseConfig, db, collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from '../config/firebase';
import { X, Shield, Sliders, Users, BarChart3, Key, CheckCircle2, AlertTriangle, Check, UserX, Clock, RefreshCw, Trash2, Bot, Mic, Sparkles, Crown, BookOpen, Box } from 'lucide-react';
import { UserData } from '../types';
import { getAdminAiApiKey, setAdminAiApiKey } from '../services/aiService';
import { CurriculumMarkdownStudio } from '../components/admin/CurriculumMarkdownStudio';
import { Omni3DStudioAdmin } from '../components/admin/Omni3DStudioAdmin';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
  graphicsConfig: {
    sunIntensity: number;
    ambientIntensity: number;
    rotationSpeed: number;
    atmosphereGlow: boolean;
    highResTextures: boolean;
    shadowsEnabled: boolean;
    xpMultiplier: number;
  };
  onUpdateGraphicsConfig: (newCfg: any) => void;
}

interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  isApproved: boolean;
  xp: number;
  streak: number;
  age?: number;
  grade?: string;
  ageTranche?: string;
  educationalStage?: string;
  interests?: string[];
  onboardingCompleted?: boolean;
  createdAt?: string;
  rawUserData?: UserData;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  isEmbedded = false,
  graphicsConfig,
  onUpdateGraphicsConfig
}) => {
  const { user, isAdmin } = useAuth();
  const { userData, showToast } = useProgress();

  const [activeTab, setActiveTab] = useState<'users' | 'apps' | 'analytics' | 'firebase' | 'ai_voice' | 'curriculum' | 'omni_3d'>('omni_3d');
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [customAiApiKey, setCustomAiApiKey] = useState(() => getAdminAiApiKey());

  // Filtros de Alumnos
  const [filterAgeTranche, setFilterAgeTranche] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<UserRecord | null>(null);

  // Apps Status State (Admin control)
  const [appsStatus, setAppsStatus] = useState({
    astro: { active: true, name: 'Astro (Astrofísica 3D)', xpMultiplier: 1.0 },
    languages: { active: true, name: 'Idiomas (AstroLingo)', xpMultiplier: 1.0 },
    school: { active: true, name: 'Escolar (Tutor IA)', xpMultiplier: 1.0 },
    verify: { active: true, name: 'Verifica (Investigación)', xpMultiplier: 1.0 }
  });

  // Firebase Config State
  const [customApiKey, setCustomApiKey] = useState(() => getStoredFirebaseConfig().apiKey || '');
  const [customProjectId, setCustomProjectId] = useState(() => getStoredFirebaseConfig().projectId || '');
  const [customAuthDomain, setCustomAuthDomain] = useState(() => getStoredFirebaseConfig().authDomain || '');

  useEffect(() => {
    if (!isOpen || !isAdmin || !db) return;
    setLoadingUsers(true);

    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const records: UserRecord[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as UserData & { email?: string; displayName?: string; isApproved?: boolean };
        const uid = docSnap.id;
        const userEmail = data.email || (uid === user?.uid ? user?.email : `${uid.slice(0, 6)}@estudiante.com`);
        const name = data.learnerProfile?.identity?.name || data.displayName || data.childProfile?.childName || (uid === user?.uid ? user?.displayName : 'Estudiante');
        const isAdminUser = userEmail === 'josferestudio@gmail.com';
        const studentAge = data.learnerProfile?.education?.age || (data.childProfile?.age ? Number(data.childProfile.age) : undefined);
        const studentGrade = data.learnerProfile?.education?.grade || data.childProfile?.grade;
        const studentTranche = data.learnerProfile?.education?.ageTranche || (studentAge ? (studentAge <= 7 ? '6-7' : studentAge <= 9 ? '8-9' : studentAge <= 11 ? '10-11' : studentAge <= 13 ? '12-13' : '14-15') : undefined);
        const studentStage = data.learnerProfile?.education?.educationalStage || data.childProfile?.educationalStage;
        const studentInterests = data.learnerProfile?.preferences?.interests || data.childProfile?.interests || [];
        const onboardingDone = data.learnerProfile?.onboarding?.globalCompleted ?? (Boolean(data.childProfile?.age) && Number(data.childProfile?.age) >= 6);

        records.push({
          uid,
          email: userEmail || 'estudiante@email.com',
          displayName: name || 'Estudiante',
          isApproved: isAdminUser || data.isApproved === true,
          xp: data.xp || 0,
          streak: data.streak || 1,
          age: studentAge,
          grade: studentGrade,
          ageTranche: studentTranche,
          educationalStage: studentStage,
          interests: studentInterests,
          onboardingCompleted: onboardingDone,
          rawUserData: data
        });
      });

      if (records.length === 0 && user) {
        records.push({
          uid: user.uid,
          email: user.email || 'josferestudio@gmail.com',
          displayName: user.displayName || 'Super Admin',
          isApproved: true,
          xp: userData.xp,
          streak: userData.streak,
          age: 9,
          grade: 'Super Admin',
          ageTranche: '8-9',
          onboardingCompleted: true,
          rawUserData: userData
        });
      }

      setUsersList(records);
      setLoadingUsers(false);
    }, (err) => {
      console.warn("Error escuchando usuarios en tiempo real:", err);
      setLoadingUsers(false);
    });

    return () => unsub();
  }, [isOpen, isAdmin, user, userData]);

  const handleApproveAllPending = async () => {
    const pendingUsers = usersList.filter(u => !u.isApproved && u.email !== 'josferestudio@gmail.com');
    if (pendingUsers.length === 0) return;
    try {
      if (db) {
        for (const u of pendingUsers) {
          await setDoc(doc(db, 'users', u.uid), { isApproved: true, status: 'approved' }, { merge: true });
        }
      }
      showToast(`Aprobados los ${pendingUsers.length} usuarios pendientes`);
    } catch (e) {
      showToast("Error al aprobar usuarios");
    }
  };

  const handleRefreshUsers = () => {
    setLoadingUsers(true);
    showToast("Sincronizando usuarios en tiempo real...");
    setTimeout(() => setLoadingUsers(false), 600);
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer">
        <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 text-center max-w-sm space-y-3 font-display cursor-default">
          <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="font-bold text-base text-white">Acceso Restringido</h3>
          <p className="text-xs text-slate-400">Este panel de administración es exclusivo para el Super Admin.</p>
          <button onClick={onClose} className="w-full py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white">Cerrar</button>
        </div>
      </div>
    );
  }

  const handleToggleUserApproval = async (targetUid: string, currentApproved: boolean) => {
    const nextApproved = !currentApproved;
    try {
      if (db) {
        await setDoc(doc(db, 'users', targetUid), { isApproved: nextApproved }, { merge: true });
      }
      setUsersList((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, isApproved: nextApproved } : u))
      );
      showToast(nextApproved ? "Usuario aprobado correctamente" : "Autorización revocada");
    } catch (e) {
      showToast("Error al actualizar estado en Firestore");
    }
  };

  const handleDeleteUserDoc = async (targetUid: string, userEmail: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la cuenta ${userEmail} de la base de datos?`)) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'users', targetUid));
      }
      setUsersList((prev) => prev.filter((u) => u.uid !== targetUid));
      showToast("Registro de usuario eliminado de la base de datos");
    } catch (e) {
      showToast("Error al eliminar el registro en Firestore");
    }
  };

  const handlePurgeAllTestUsers = async () => {
    if (!window.confirm("¿Seguro que deseas borrar todos los registros de prueba excepto el Super Admin?")) return;
    try {
      if (db) {
        const toDelete = usersList.filter(u => u.email !== 'josferestudio@gmail.com');
        for (const u of toDelete) {
          await deleteDoc(doc(db, 'users', u.uid));
        }
      }
      setUsersList((prev) => prev.filter(u => u.email === 'josferestudio@gmail.com'));
      showToast("Base de datos purgada. Usuarios de prueba eliminados.");
    } catch (e) {
      showToast("Error al purgar registros de la base de datos");
    }
  };

  const handleSaveFirebaseConfig = () => {
    if (!customApiKey.trim() || !customProjectId.trim()) {
      alert("Introduce valores válidos para la configuración.");
      return;
    }
    const newCfg = {
      ...defaultFirebaseConfig,
      apiKey: customApiKey.trim(),
      projectId: customProjectId.trim(),
      authDomain: customAuthDomain.trim() || `${customProjectId.trim()}.firebaseapp.com`,
      storageBucket: `${customProjectId.trim()}.firebasestorage.app`
    };
    localStorage.setItem('goals_firebase_config', JSON.stringify(newCfg));
    showToast("Configuración de Firebase actualizada. Recargando...");
    setTimeout(() => window.location.reload(), 1200);
  };

  const pendingCount = usersList.filter(u => !u.isApproved && u.email !== 'josferestudio@gmail.com').length;

  const dashboardContent = (
    <div className={`bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl sm:rounded-3xl w-full h-full flex flex-col relative shadow-2xl overflow-hidden font-display transition-all duration-300`}>
      
      {/* Header del Admin Dashboard */}
      <div className="p-3.5 sm:p-4 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 flex-wrap">
              <span>Panel de Autorización & Admin</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono">
                josferestudio@gmail.com
              </span>
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400">Gestión de accesos, aprobación de cuentas y analíticas</p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          title="Volver a GOALS"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Cerrar</span>
        </button>
      </div>

      {/* Banner Alerta de Solicitudes Pendientes */}
        {pendingCount > 0 && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Hay <b>{pendingCount}</b> {pendingCount === 1 ? 'solicitud de usuario esperando' : 'solicitudes de usuarios esperando'} autorización.</span>
            </div>
            <button
              onClick={handleApproveAllPending}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aprobar Todos ({pendingCount})</span>
            </button>
          </div>
        )}

        {/* Pestañas de Administración */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-[90px] py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'users' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Usuarios</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`flex-1 min-w-[90px] py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'apps' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Apps & 3D</span>
          </button>

          <button
            onClick={() => setActiveTab('omni_3d')}
            className={`flex-1 min-w-[120px] py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'omni_3d' ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4 text-cyan-400" />
            <span>3D Genesis IA</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 min-w-[90px] py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'analytics' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analíticas</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`flex-1 min-w-[90px] py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'firebase' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Firebase</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_voice')}
            className={`flex-1 min-w-[90px] py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'ai_voice' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>IA</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex-1 min-w-[110px] py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'curriculum' ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Currículum MD</span>
          </button>
        </div>

        {/* Contenido del Panel Admin */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: AUTORIZACIÓN DE USUARIOS */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white">Gestión y Filtro Educativo de Alumnos</h3>
                  <p className="text-[10px] text-slate-400">Supervisa perfiles, etapas LOMLOE y autoriza accesos en tiempo real.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePurgeAllTestUsers}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                    title="Borrar registros de prueba excepto el Admin"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Limpiar BD</span>
                  </button>
                  <button
                    onClick={handleRefreshUsers}
                    disabled={loadingUsers}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                    <span>Refrescar</span>
                  </button>
                </div>
              </div>

              {/* BARRA DE FILTROS ADAPTATIVOS */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center gap-2 text-xs">
                {/* FILTRO POR TRAMO DE EDAD */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tramo:</span>
                  <select
                    value={filterAgeTranche}
                    onChange={(e) => setFilterAgeTranche(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">Todas las edades</option>
                    <option value="6-7">6–7 años (1º-2º Primaria)</option>
                    <option value="8-9">8–9 años (3º-4º Primaria)</option>
                    <option value="10-11">10–11 años (5º-6º Primaria)</option>
                    <option value="12-13">12–13 años (1º-2º ESO)</option>
                    <option value="14-15">14–15 años (3º-4º ESO)</option>
                  </select>
                </div>

                {/* FILTRO POR ESTADO DE ACCESO */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estado:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">Todos ({usersList.length})</option>
                    <option value="approved">Aprobados ({usersList.filter(u => u.isApproved).length})</option>
                    <option value="pending">Pendientes ({pendingCount})</option>
                  </select>
                </div>

                {/* BUSCADOR */}
                <div className="flex-1 min-w-[140px]">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1 text-slate-200 text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* TABLA DE ALUMNOS */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                    <tr>
                      <th className="p-3">Alumno / Email</th>
                      <th className="p-3">Tramo & LOMLOE</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Progreso</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {usersList
                      .filter((u) => {
                        if (filterStatus === 'approved' && !u.isApproved) return false;
                        if (filterStatus === 'pending' && (u.isApproved || u.email === 'josferestudio@gmail.com')) return false;
                        if (filterAgeTranche !== 'all' && u.ageTranche !== filterAgeTranche) return false;
                        if (searchQuery.trim()) {
                          const q = searchQuery.toLowerCase();
                          const matchName = u.displayName.toLowerCase().includes(q);
                          const matchEmail = u.email.toLowerCase().includes(q);
                          const matchGrade = u.grade?.toLowerCase().includes(q);
                          if (!matchName && !matchEmail && !matchGrade) return false;
                        }
                        return true;
                      })
                      .map((u) => {
                        const isSuperAdmin = u.email === 'josferestudio@gmail.com';
                        return (
                          <tr key={u.uid} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                <span>{u.displayName}</span>
                                {u.onboardingCompleted && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Onboarding completado">
                                    ✓ Onboard
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </td>
                            <td className="p-3">
                              {u.age ? (
                                <div className="space-y-0.5">
                                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold inline-block">
                                    {u.age} años • {u.ageTranche}
                                  </span>
                                  {u.grade && (
                                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{u.grade}</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500 italic">Sin edad asignada</span>
                              )}
                            </td>
                            <td className="p-3">
                              {isSuperAdmin ? (
                                <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1 w-fit">
                                  <Crown className="w-3 h-3 text-amber-400" /> Super Admin
                                </span>
                              ) : u.isApproved ? (
                                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1 w-fit">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Aprobado
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1 w-fit">
                                  <Clock className="w-3 h-3 text-amber-400" /> Pendiente
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-[11px]">
                              <div className="text-amber-400 font-bold">{u.xp} XP</div>
                              <div className="text-rose-400 text-[10px]">{u.streak} Días racha</div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* BOTÓN VER FICHA DEL ALUMNO */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudentForModal(u)}
                                  className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[10px] transition-all cursor-pointer"
                                  title="Ver expediente detallado del alumno"
                                >
                                  Ficha 👁️
                                </button>

                                {!isSuperAdmin && (
                                  <>
                                    <button
                                      onClick={() => handleToggleUserApproval(u.uid, u.isApproved)}
                                      className={`px-2 py-1 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95 cursor-pointer ${
                                        u.isApproved
                                          ? 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300'
                                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                                      }`}
                                    >
                                      {u.isApproved ? (
                                        <>
                                          <UserX className="w-3 h-3" />
                                          <span>Revocar</span>
                                        </>
                                      ) : (
                                        <>
                                          <Check className="w-3 h-3" />
                                          <span>Aprobar</span>
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUserDoc(u.uid, u.email)}
                                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all active:scale-95 cursor-pointer"
                                      title="Eliminar registro"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* MODAL DE FICHA DETALLADA DEL ALUMNO */}
              {selectedStudentForModal && (
                <div
                  onClick={() => setSelectedStudentForModal(null)}
                  className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-950 border border-slate-700 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl text-white"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl">
                          👨‍🎓
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white">{selectedStudentForModal.displayName}</h3>
                          <p className="text-xs text-slate-400">{selectedStudentForModal.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedStudentForModal(null)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* SECCIÓN 1: PERFIL EDUCATIVO GLOBAL */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
                      <h4 className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                        1. Perfil del Alumno (SSOT)
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <div><b>Edad:</b> {selectedStudentForModal.age || 'No declarada'} años</div>
                        <div><b>Tramo LOMLOE:</b> {selectedStudentForModal.ageTranche || 'Sin tramo'}</div>
                        <div><b>Curso:</b> {selectedStudentForModal.grade || 'Sin curso'}</div>
                        <div><b>Onboarding:</b> {selectedStudentForModal.onboardingCompleted ? '✅ Completado' : '⏳ Pendiente'}</div>
                      </div>
                      {selectedStudentForModal.interests && selectedStudentForModal.interests.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[10px] text-slate-400 block">Intereses declarados:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedStudentForModal.interests.map((it, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-cyan-300 border border-slate-700">
                                {it}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECCIÓN 2: ESTADO GLOBAL GOALS */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
                      <h4 className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
                        2. Rendimiento Global GOALS
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-xl bg-slate-950 border border-white/5 text-center">
                          <span className="text-[10px] text-slate-400 block">XP Total</span>
                          <span className="text-sm font-bold text-amber-400">{selectedStudentForModal.xp}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950 border border-white/5 text-center">
                          <span className="text-[10px] text-slate-400 block">Racha</span>
                          <span className="text-sm font-bold text-rose-400">{selectedStudentForModal.streak} días</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950 border border-white/5 text-center">
                          <span className="text-[10px] text-slate-400 block">Estado Acceso</span>
                          <span className={`text-[11px] font-bold ${selectedStudentForModal.isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {selectedStudentForModal.isApproved ? 'Aprobado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECCIÓN 3: DESGLOSE POR MINIAPPS */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
                      <h4 className="font-mono text-[11px] uppercase tracking-wider text-purple-400 font-bold">
                        3. Progreso Desglosado por MiniApps
                      </h4>
                      <div className="space-y-1.5 text-slate-300">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-white/5">
                          <span className="flex items-center gap-1.5">
                            <span>🌌</span>
                            <b>Cosmos 3D:</b>
                          </span>
                          <span className="font-mono text-cyan-300">
                            {selectedStudentForModal.rawUserData?.experiences?.astro?.xp || 0} XP • {Object.keys(selectedStudentForModal.rawUserData?.experiences?.astro?.lessons || {}).length} Unidades
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-white/5">
                          <span className="flex items-center gap-1.5">
                            <span>📚</span>
                            <b>Escuela IA:</b>
                          </span>
                          <span className="font-mono text-cyan-300">
                            {selectedStudentForModal.rawUserData?.experiences?.school?.xp || 0} XP
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-white/5">
                          <span className="flex items-center gap-1.5">
                            <span>🌍</span>
                            <b>Idiomas:</b>
                          </span>
                          <span className="font-mono text-cyan-300">
                            {selectedStudentForModal.rawUserData?.experiences?.languages?.xp || 0} XP
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-white/5">
                          <span className="flex items-center gap-1.5">
                            <span>🔍</span>
                            <b>Criterio / Verifica:</b>
                          </span>
                          <span className="font-mono text-cyan-300">
                            {selectedStudentForModal.rawUserData?.experiences?.verify?.xp || selectedStudentForModal.rawUserData?.experiences?.criterio?.xp || 0} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForModal(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Cerrar Ficha
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: APLICACIONES & AJUSTES 3D */}
          {activeTab === 'apps' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-slate-300">Control de Aplicaciones Educativas</h3>

              <div className="space-y-2.5">
                {Object.entries(appsStatus).map(([key, app]) => (
                  <div key={key} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-white">{app.name}</h4>
                      <p className="text-[10px] text-slate-400">Multiplicador XP: {app.xpMultiplier}x</p>
                    </div>

                    <button
                      onClick={() => {
                        setAppsStatus((prev: any) => ({
                          ...prev,
                          [key]: { ...prev[key], active: !prev[key].active }
                        }));
                        showToast(`Estado de ${app.name} actualizado`);
                      }}
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        app.active
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {app.active ? 'Activa' : 'Desactivada'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Ajustes Gráficos 3D */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-xs text-cyan-300">Ajustes Gráficos Laboratorio 3D Astro</h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Intensidad Luz Solar ({graphicsConfig.sunIntensity})</label>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={graphicsConfig.sunIntensity}
                      onChange={(e) => onUpdateGraphicsConfig({ sunIntensity: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">Velocidad de Rotación ({graphicsConfig.rotationSpeed}x)</label>
                    <input
                      type="range"
                      min="0"
                      max="3.0"
                      step="0.2"
                      value={graphicsConfig.rotationSpeed}
                      onChange={(e) => onUpdateGraphicsConfig({ rotationSpeed: parseFloat(e.target.value) })}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANALÍTICAS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-slate-300">Métricas Globales de Rendimiento</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-slate-400">Total Usuarios</p>
                  <p className="font-bold text-xl text-indigo-400">{usersList.length}</p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-slate-400">Pendientes</p>
                  <p className="font-bold text-xl text-amber-400">{pendingCount}</p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-slate-400">Aprobados</p>
                  <p className="font-bold text-xl text-emerald-400">{usersList.filter(u => u.isApproved).length}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FIREBASE */}
          {activeTab === 'firebase' && (
            <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <h4 className="font-bold text-xs text-white">Configuración Firebase SDK</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">API Key</label>
                  <input
                    type="text" value={customApiKey} onChange={(e) => setCustomApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Project ID</label>
                  <input
                    type="text" value={customProjectId} onChange={(e) => setCustomProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveFirebaseConfig}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-sm mt-2 cursor-pointer"
              >
                Guardar Configuración
              </button>
            </div>
          )}

          {/* TAB 5: IA & CUOTAS */}
          {activeTab === 'ai_voice' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="font-bold text-xs text-white">API Key Privada de IA</h4>
                      <p className="text-[10px] text-slate-400">Servidor de inferencia y proxy unificado</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-bold">
                    Proxy Activo
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    API Key del Administrador
                  </label>
                  <input
                    type="password"
                    value={customAiApiKey}
                    onChange={(e) => setCustomAiApiKey(e.target.value)}
                    placeholder="freellmapi-..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:border-indigo-500 outline-none transition-colors"
                  />
                  <p className="text-[10px] text-slate-500">
                    Esta clave se guarda de forma segura y se utiliza para todas las peticiones de inferencia de los alumnos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAdminAiApiKey(customAiApiKey);
                    showToast("API Key Privada de IA actualizada correctamente");
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Guardar API Key de IA
                </button>
              </div>

              {/* Matriz de Gestión de Cuotas por Alumno */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-xs text-white">Matriz de Cuotas por Estudiante</h4>
                      <p className="text-[10px] text-slate-400">Control de consumo diario de consultas y minutos de voz</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                    Límite: 50/día
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {usersList.map((u) => (
                    <div 
                      key={u.uid}
                      className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-white truncate">{u.displayName}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{u.email}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-emerald-400">42 / 50 Disponibles</p>
                          <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden mt-1">
                            <div className="w-[84%] h-full bg-emerald-500 rounded-full" />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => showToast(`Cuota de ${u.displayName} recargada (+10 consultas)`)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 font-bold text-[10px] transition-all cursor-pointer"
                        >
                          +10 Recargar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CURRICULUM MARKDOWN STUDIO */}
          {activeTab === 'curriculum' && (
            <div className="h-full">
              <CurriculumMarkdownStudio />
            </div>
          )}

          {/* TAB 7: OMNI-3D GENESIS IA STUDIO */}
          {activeTab === 'omni_3d' && (
            <div className="h-full flex-1 flex flex-col min-h-[560px] -m-4 sm:-m-5">
              <Omni3DStudioAdmin />
            </div>
          )}

        </div>

      </div>
  );

  if (isEmbedded) {
    return (
      <div className="w-full h-full flex-1 flex flex-col p-1 sm:p-2.5">
        {dashboardContent}
      </div>
    );
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-display cursor-pointer">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl h-[95vh] flex flex-col cursor-default">
        {dashboardContent}
      </div>
    </div>
  );
};
