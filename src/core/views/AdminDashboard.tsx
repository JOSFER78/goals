import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { defaultFirebaseConfig, getStoredFirebaseConfig, db, collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from '../config/firebase';
import { X, Shield, Sliders, Users, BarChart3, Key, CheckCircle2, AlertTriangle, Check, UserX, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { UserData } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
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
  createdAt?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  graphicsConfig,
  onUpdateGraphicsConfig
}) => {
  const { user, isAdmin } = useAuth();
  const { userData, showToast } = useProgress();

  const [activeTab, setActiveTab] = useState<'users' | 'apps' | 'analytics' | 'firebase'>('users');
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

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
        const name = data.displayName || (uid === user?.uid ? user?.displayName : 'Estudiante registrado');
        const isAdminUser = userEmail === 'josferestudio@gmail.com';

        records.push({
          uid,
          email: userEmail || 'estudiante@email.com',
          displayName: name || 'Estudiante',
          isApproved: isAdminUser || data.isApproved === true,
          xp: data.xp || 0,
          streak: data.streak || 1
        });
      });

      if (records.length === 0 && user) {
        records.push({
          uid: user.uid,
          email: user.email || 'josferestudio@gmail.com',
          displayName: user.displayName || 'Super Admin',
          isApproved: true,
          xp: userData.xp,
          streak: userData.streak
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
      showToast(`🟢 ¡Aprobados los ${pendingUsers.length} usuarios pendientes!`);
    } catch (e) {
      showToast("Error al aprobar usuarios");
    }
  };

  const handleRefreshUsers = () => {
    setLoadingUsers(true);
    showToast("🔄 Sincronizando usuarios en tiempo real...");
    setTimeout(() => setLoadingUsers(false), 600);
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer">
        <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 text-center max-w-sm space-y-3 font-display cursor-default">
          <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="font-bold text-base text-white">Acceso Restringido</h3>
          <p className="text-xs text-slate-400">Este panel de administración es exclusivo para el Super Admin (josferestudio@gmail.com).</p>
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
      showToast(nextApproved ? "🟢 Usuario APROBADO correctamente" : "🔴 Autorización revocada");
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
      showToast("🗑️ Registro de usuario eliminado de la base de datos");
    } catch (e) {
      showToast("Error al eliminar el registro en Firestore");
    }
  };

  const handlePurgeAllTestUsers = async () => {
    if (!window.confirm("⚠️ ATENCIÓN: ¿Seguro que deseas BORRAR TODOS los registros de prueba de la base de datos Firestore excepto el Super Admin?")) return;
    try {
      if (db) {
        const toDelete = usersList.filter(u => u.email !== 'josferestudio@gmail.com');
        for (const u of toDelete) {
          await deleteDoc(doc(db, 'users', u.uid));
        }
      }
      setUsersList((prev) => prev.filter(u => u.email === 'josferestudio@gmail.com'));
      showToast("🧹 Base de datos purgada. Se han eliminado todos los usuarios de prueba.");
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

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans cursor-pointer">
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-950/95 border border-amber-500/30 rounded-3xl w-full max-w-2xl h-[85vh] max-h-[680px] overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col relative cursor-default animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header del Admin Dashboard */}
        <div className="p-4 px-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <span>Panel de Autorización & Super Admin</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono">
                  josferestudio@gmail.com
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Gestión de accesos, aprobación de cuentas registradas y analíticas</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Alerta de Solicitudes Pendientes */}
        {pendingCount > 0 && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 p-3 px-5 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>🔔 Hay <b>{pendingCount}</b> {pendingCount === 1 ? 'solicitud de usuario esperando' : 'solicitudes de usuarios esperando'} autorización.</span>
            </div>
            <button
              onClick={handleApproveAllPending}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1 shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aprobar a Todos ({pendingCount})</span>
            </button>
          </div>
        )}

        {/* Pestañas de Administración */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'users' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Autorización de Usuarios</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`flex-1 py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'apps' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Apps & Ajustes 3D</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'analytics' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analíticas</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`flex-1 py-3 border-b-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'firebase' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Firebase</span>
          </button>
        </div>

        {/* Contenido del Panel Admin */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: AUTORIZACIÓN DE USUARIOS Y GESTIÓN */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white">Solicitudes de Registro & Control de Acceso</h3>
                  <p className="text-[10px] text-slate-400">Los usuarios registrados deben ser autorizados por ti para poder entrar.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePurgeAllTestUsers}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
                    title="Borrar todos los usuarios de prueba excepto el Admin"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Limpiar BD Pruebas</span>
                  </button>
                  <button
                    onClick={handleRefreshUsers}
                    disabled={loadingUsers}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                    <span>Refrescar</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/80 shadow-inner">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase text-slate-400 font-extrabold">
                    <tr>
                      <th className="p-3">Usuario / Email</th>
                      <th className="p-3">Estado de Acceso</th>
                      <th className="p-3">Progreso</th>
                      <th className="p-3 text-right">Acción de Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {usersList.map((u) => {
                      const isSuperAdmin = u.email === 'josferestudio@gmail.com';
                      return (
                        <tr key={u.uid} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-white text-xs">{u.displayName}</div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </td>
                          <td className="p-3">
                            {isSuperAdmin ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                👑 Super Admin
                              </span>
                            ) : u.isApproved ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Aprobado
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 w-fit animate-pulse">
                                <Clock className="w-3 h-3 text-amber-400" /> ⏳ Pendiente
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-[11px]">
                            <div className="text-amber-400 font-bold">{u.xp} XP</div>
                            <div className="text-rose-400 text-[10px]">{u.streak} Días racha</div>
                          </td>
                          <td className="p-3 text-right">
                            {isSuperAdmin ? (
                              <span className="text-[10px] text-slate-500 italic">Autorizado siempre</span>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleToggleUserApproval(u.uid, u.isApproved)}
                                  className={`px-2.5 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95 ${
                                    u.isApproved
                                      ? 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300'
                                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30 font-black'
                                  }`}
                                >
                                  {u.isApproved ? (
                                    <>
                                      <UserX className="w-3.5 h-3.5" />
                                      <span>Revocar</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Aprobar</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDeleteUserDoc(u.uid, u.email)}
                                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-all active:scale-95"
                                  title="Eliminar registro de usuario de Firestore"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition-all ${
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
                      className="w-full"
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
                      className="w-full"
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
                  <p className="text-[10px] text-slate-400">Pendientes de Autorización</p>
                  <p className="font-bold text-xl text-amber-400">{pendingCount}</p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-slate-400">Usuarios Aprobados</p>
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
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md mt-2"
              >
                Guardar Configuración
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
