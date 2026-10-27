import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  X, 
  FileText, 
  Users, 
  Megaphone, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  Copy, 
  Eye, 
  Sliders, 
  Target, 
  CheckSquare, 
  BookOpen,
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { CustomCheckbox } from './custom-checkbox.component';

export interface AdminHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string, param?: string) => void;
  initialTab?: 'quotes' | 'deliverables' | 'banners' | 'ads' | 'checklist' | 'glossary';
}

type HelpTabKey = 'quotes' | 'deliverables' | 'banners' | 'ads' | 'checklist' | 'glossary';

export const AdminHelpModalComponent: React.FC<AdminHelpModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialTab = 'quotes',
}) => {
  const [activeTab, setActiveTab] = useState<HelpTabKey>(initialTab);

  // Checklist de seguimiento diario (persistida en localStorage)
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('admin_daily_checklist_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('admin_daily_checklist_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetChecklist = () => {
    setChecklist({});
    try {
      localStorage.removeItem('admin_daily_checklist_v1');
    } catch {
      // ignore
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (typeof document === 'undefined' || !isOpen) return null;

  const handleGoTo = (route: string, param?: string) => {
    if (onNavigate) {
      onNavigate(route, param);
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Main Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-6 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-lg sm:text-xl">
                  Centro de Ayuda & Guía Operativa
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  Documentación del Sistema
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Guías paso a paso para gestionar cotizaciones, entregables de clientes, publicidad y banners.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Cerrar Guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto shrink-0 gap-2 py-2">
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Cotizar & Vender</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deliverables')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'deliverables'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. CRM & Entregas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>3. Banners & Tienda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ads')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'ads'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>4. Meta Ads</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>5. Checklist de Foco</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('glossary')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>6. Glosario</span>
          </button>
        </div>

        {/* Tab Body Content (Scrollable) */}
        <div className="overflow-y-auto p-6 sm:p-7 space-y-6 flex-1 text-slate-800">
          {/* TAB 1: COTIZAR Y VENDER */}
          {activeTab === 'quotes' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-blue-900 text-sm">
                    ¿Cuál es el objetivo principal de esta sección?
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                    Armar en 2 minutos un presupuesto profesional en formato web imprimible para que tu cliente lo vea desde el celular o computadora y te diga que sí.
                  </p>
                </div>
              </div>

              <h4 className="font-heading font-black text-slate-900 text-base">
                El Flujo de 3 Pasos para Vender:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">Crear Cotización</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hacé clic en el botón azul <strong>"+ Nueva"</strong>. Poné el nombre de tu cliente y marcá los módulos de trabajo (Feed, Reels, Historias, etc.). El precio se calcula automáticamente.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    2
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">Copiar Link y Enviar</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    En la lista de cotizaciones, tocá el botón de <strong>Copiar Link</strong>. Andá a WhatsApp y pegáselo a tu cliente con un mensaje de cortesía.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    3
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">Confirmación</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cuando el cliente apruebe, cambiá el estado en el menú desplegable a <strong>"Aprobada"</strong>. ¡Listo! Ya podés coordinar el inicio del mes.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-600">
                  ¿Querés probar crear una cotización ahora mismo?
                </span>
                <button
                  type="button"
                  onClick={() => handleGoTo('builder')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Ir a Nueva Cotización</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CRM Y ENTREGAS */}
          {activeTab === 'deliverables' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-900 text-sm">
                    ¿Para qué sirve el CRM y el Calendario de Entregas?
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    Es el lugar donde organizás el contenido semanal de cada cliente (fotos, reels, carruseles y textos) para que el cliente lo revise y lo apruebe antes de publicar.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                    A
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Insumos del Cliente (Drive & Logos)</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      El cliente te pega su link de Google Drive o Dropbox en su portal. Vos lo ves en la pestaña <strong>"Insumos de Marca"</strong> de su ficha para descargar los materiales.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                    B
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Carga de Piezas y Textos (Copy)</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      En <strong>"Entregas Semanales"</strong> cargás el texto del posteo y el enlace al arte final. Marcás el estado como <strong>"Listo para Aprobación"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                    C
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">El Cliente da el OK</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      El cliente entra a su portal, lee el texto, mira el diseño y presiona <strong>"Aprobar Publicación"</strong> o te deja un comentario de ajuste. Cero mensajes desordenados por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-600">
                  Ver clientes activos y sus calendarios de trabajo:
                </span>
                <button
                  type="button"
                  onClick={() => handleGoTo('crm-list')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Ir al CRM de Clientes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BANNERS Y TIENDA */}
          {activeTab === 'banners' && (
            <div className="space-y-5">
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-start gap-3">
                <Megaphone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-indigo-900 text-sm">
                    ¿Cómo promocionás tus servicios en la tienda pública?
                  </h4>
                  <p className="text-xs sm:text-sm text-indigo-800 leading-relaxed">
                    Tu tienda oficial (<code className="font-bold bg-white px-1.5 py-0.5 rounded text-[11px]">?view=tienda</code>) es tu vidriera. Podés sumar banners de ofertas, descuentos de bienvenida o combos personalizados.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded uppercase">
                    Opción 1: En Vivo en la Tienda
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">Añadir desde la Tienda</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cuando abrís la tienda estando logueado como Martín, tenés arriba una barra negra de administrador con el botón <strong>"+ Añadir Banner a la Tienda"</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded uppercase">
                    Opción 2: Panel Admin
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm">Pestaña Banners & Promos</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Desde el menú superior tocás <strong>"Banners & Promos"</strong>. Podés editar textos, colores, activar/desactivar banners y cambiar el mensaje de WhatsApp.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-600">
                  Explorar la tienda o editar los banners vigentes:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGoTo('store')}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Ver Tienda</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGoTo('catalog', 'promotions')}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Gestionar Banners</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: META ADS */}
          {activeTab === 'ads' && (
            <div className="space-y-5">
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl flex items-start gap-3">
                <Target className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-purple-900 text-sm">
                    Módulo de Publicidad Paga (Instagram & Facebook Ads)
                  </h4>
                  <p className="text-xs sm:text-sm text-purple-800 leading-relaxed">
                    Permite que el cliente te solicite presupuesto publicitario para que sus publicaciones tengan miles de vistas y consultas de ventas.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">1. Solicitud del Cliente:</span>
                  <p className="text-slate-600 text-xs">
                    El cliente en su portal entra a <em>"Publicidad & Meta Ads"</em>, elige cuánto dinero quiere invertir (ej. $60.000) y qué objetivo busca (WhatsApp, Seguidores o Ventas).
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">2. Aprobación del Admin (Martín):</span>
                  <p className="text-slate-600 text-xs">
                    En el CRM de ese cliente ves la solicitud en estado <em>"Pendiente de Aprobación"</em>. Coordinás el cobro y la pasás a <em>"Activa"</em>.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">3. Carga de Métricas:</span>
                  <p className="text-slate-600 text-xs">
                    Podés cargarle cuántas personas vieron el anuncio (Alcance) y cuántas escribieron por WhatsApp para que el cliente vea el valor de tu trabajo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHECKLIST DE SEGUIMIENTO OPERATIVO */}
          {activeTab === 'checklist' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-amber-950 text-sm">
                      Checklist de Control Operativo Diario
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Marcá las tareas que vas completando en tu jornada de trabajo para llevar un registro ordenado.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetChecklist}
                  className="text-xs text-amber-800 hover:text-amber-950 underline font-semibold shrink-0 cursor-pointer"
                >
                  Reiniciar Lista
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'task-1', label: 'Revisar si hay cotizaciones pendientes de respuesta' },
                  { id: 'task-2', label: 'Enviar propuesta a clientes nuevos por WhatsApp' },
                  { id: 'task-3', label: 'Mirar si los clientes subieron fotos/logos en "Insumos"' },
                  { id: 'task-4', label: 'Cargar el copy y diseño de las publicaciones de la semana' },
                  { id: 'task-5', label: 'Pasar entregables a "Listo para Aprobación"' },
                  { id: 'task-6', label: 'Verificar si algún cliente pidió pauta en Meta Ads' },
                  { id: 'task-7', label: 'Comprobar que el banner de la tienda tenga la promo vigente' },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                      checklist[item.id]
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 line-through opacity-75'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300'
                    }`}
                  >
                    <CustomCheckbox
                      checked={Boolean(checklist[item.id])}
                      onChange={() => toggleChecklistItem(item.id)}
                      variant="emerald"
                      size="md"
                    />
                    <span className="text-xs sm:text-sm font-semibold select-none cursor-pointer" onClick={() => toggleChecklistItem(item.id)}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GLOSARIO SIMPLE */}
          {activeTab === 'glossary' && (
            <div className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  Diccionario Simple: Palabras técnicas traducidas a español claro
                </h4>
                <p className="text-xs text-slate-600">
                  Si alguna palabra te genera duda, acá tenés la explicación directa:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block text-xs uppercase tracking-wider">
                    Slug / Enlace Web
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Es la dirección corta que va al final del link (ej: <code>familia-cardoso</code>). Sirve para que el cliente pueda abrir su propuesta sin contraseñas difíciles.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block text-xs uppercase tracking-wider">
                    Abono Mensual Recurrente
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Es la cuota fija que tu cliente te paga cada mes por llevarle las redes sociales y crearle el contenido.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block text-xs uppercase tracking-wider">
                    Entregable / Pieza
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Es cada posteo individual: una foto para el feed, un carrusel educativo, un reel en video o una historia.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block text-xs uppercase tracking-wider">
                    Copy / Copywriting
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    El texto de la publicación de Instagram (los párrafos que acompañan la foto, los llamados a la acción y los hashtags).
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block text-xs uppercase tracking-wider">
                    CRM
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    La lista ordenada donde tenés guardada la información de cada cliente: cuánto paga, qué plan tiene y sus fechas de entrega.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block text-xs uppercase tracking-wider">
                    Meta Ads
                  </span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    La plataforma oficial de anuncios pagos de Instagram y Facebook para llegar a personas que todavía no siguen la cuenta.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Diseñado pensando en tu concentración y productividad diaria.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            Entendido, ¡gracias!
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
