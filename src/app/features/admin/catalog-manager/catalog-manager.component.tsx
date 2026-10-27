import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Layers, 
  Plus, 
  Eye, 
  RotateCcw, 
  Sliders,
  Megaphone,
  Sparkles
} from 'lucide-react';
import { PredefinedPlan } from '../../../core/models/catalog.model';
import { ModuleTemplate } from '../../../core/models/quote.model';
import { CatalogService } from '../../../core/services/catalog.service';
import { CatalogPlansTabComponent } from './catalog-plans-tab.component';
import { CatalogModulesTabComponent } from './catalog-modules-tab.component';
import { PlanEditorModalComponent } from './plan-editor-modal.component';
import { ModuleEditorModalComponent } from './module-editor-modal.component';
import { PromotionsManagerComponent } from '../promotions-manager/promotions-manager.component';
import { BrandIcon } from '../../../shared/components/brand-icon.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';

interface CatalogManagerProps {
  onNavigate: (route: string, param?: string) => void;
  initialTab?: 'plans' | 'modules' | 'promotions';
}

export const CatalogManagerComponent: React.FC<CatalogManagerProps> = ({ onNavigate, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'modules' | 'promotions'>(initialTab || 'plans');
  const [plans, setPlans] = useState<PredefinedPlan[]>([]);
  const [templates, setTemplates] = useState<ModuleTemplate[]>([]);

  // Modals state
  const [editingPlan, setEditingPlan] = useState<PredefinedPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ModuleTemplate | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Custom Confirm Modals
  const [planIdToDelete, setPlanIdToDelete] = useState<string | null>(null);
  const [templateIdToDelete, setTemplateIdToDelete] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const reloadData = () => {
    setPlans(CatalogService.getPlans());
    setTemplates(CatalogService.getTemplates());
  };

  useEffect(() => {
    reloadData();
    const unsubscribe = CatalogService.subscribe(() => {
      reloadData();
    });
    return unsubscribe;
  }, []);

  const handleTogglePlanActive = (plan: PredefinedPlan) => {
    CatalogService.savePlan({ ...plan, active: plan.active === false ? true : false });
  };

  const handleToggleTemplateActive = (tpl: ModuleTemplate) => {
    CatalogService.saveTemplate({ ...tpl, active: tpl.active === false ? true : false });
  };

  const handleDeletePlan = (id: string) => {
    setPlanIdToDelete(id);
  };

  const handleConfirmDeletePlan = () => {
    if (planIdToDelete) {
      CatalogService.deletePlan(planIdToDelete);
      setPlanIdToDelete(null);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplateIdToDelete(id);
  };

  const handleConfirmDeleteTemplate = () => {
    if (templateIdToDelete) {
      CatalogService.deleteTemplate(templateIdToDelete);
      setTemplateIdToDelete(null);
    }
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    CatalogService.resetToDefaults();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Sliders className="w-4 h-4" />
            <span>CONFIGURACIÓN DEL ADMINISTRADOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Catálogo Comercial & Precios
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Administra los paquetes recomendados y los módulos a la carta visibles en la tienda y cotizador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('store')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Ver Tienda Pública</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
            title="Restablecer valores por defecto"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>

          {activeTab === 'plans' && (
            <button
              onClick={() => { setEditingPlan(null); setIsPlanModalOpen(true); }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Paquete</span>
            </button>
          )}

          {activeTab === 'modules' && (
            <button
              onClick={() => { setEditingTemplate(null); setIsTemplateModalOpen(true); }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Módulo</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'plans'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BrandIcon name="paquetes" className="w-4 h-4" />
          <span>Paquetes Recomendados</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
            {plans.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-3 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'modules'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BrandIcon name="modulos" className="w-4 h-4" />
          <span>Módulos a la Carta</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
            {templates.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('promotions')}
          className={`pb-3 text-sm sm:text-base font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'promotions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4 text-indigo-600" />
          <span>Banners & Promociones</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            Marketing
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'plans' && (
        <CatalogPlansTabComponent
          plans={plans}
          onToggleActive={handleTogglePlanActive}
          onEdit={(p) => { setEditingPlan(p); setIsPlanModalOpen(true); }}
          onDelete={handleDeletePlan}
        />
      )}

      {activeTab === 'modules' && (
        <CatalogModulesTabComponent
          templates={templates}
          onToggleActive={handleToggleTemplateActive}
          onEdit={(t) => { setEditingTemplate(t); setIsTemplateModalOpen(true); }}
          onDelete={handleDeleteTemplate}
        />
      )}

      {activeTab === 'promotions' && (
        <PromotionsManagerComponent />
      )}

      {/* Modals */}
      <PlanEditorModalComponent
        plan={editingPlan}
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSave={(saved) => {
          CatalogService.savePlan(saved);
          setIsPlanModalOpen(false);
        }}
      />

      <ModuleEditorModalComponent
        template={editingTemplate}
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={(saved) => {
          CatalogService.saveTemplate(saved);
          setIsTemplateModalOpen(false);
        }}
      />

      {/* Confirmar eliminación de Plan */}
      <ConfirmModalComponent
        isOpen={planIdToDelete !== null}
        onClose={() => setPlanIdToDelete(null)}
        onConfirm={handleConfirmDeletePlan}
        title="¿Eliminar este paquete del catálogo?"
        description="Esta acción eliminará el paquete predefinido. Las cotizaciones ya creadas con este paquete no se verán afectadas."
        confirmText="Sí, Eliminar Paquete"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Confirmar eliminación de Módulo */}
      <ConfirmModalComponent
        isOpen={templateIdToDelete !== null}
        onClose={() => setTemplateIdToDelete(null)}
        onConfirm={handleConfirmDeleteTemplate}
        title="¿Eliminar este módulo a la carta?"
        description="Esta acción eliminará el componente del catálogo para futuras cotizaciones."
        confirmText="Sí, Eliminar Módulo"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Confirmar Reset de Catálogo */}
      <ConfirmModalComponent
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="¿Restablecer paquetes y módulos sugeridos?"
        description="Se reiniciarán todos los paquetes y módulos a los valores originales predeterminados de la agencia."
        confirmText="Restablecer Catálogo"
        cancelText="Cancelar"
        variant="warning"
      />
    </div>
  );
};
