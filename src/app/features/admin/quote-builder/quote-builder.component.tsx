import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Sparkles, 
  Link as LinkIcon, 
  Check, 
  User, 
  Tag, 
  FileText
} from 'lucide-react';
import { Quote, ServiceModule, QuotePricing } from '../../../core/models/quote.model';
import { QuotesService, SEED_TEMPLATES, DEFAULT_TERMS } from '../../../core/services/quotes.service';
import { ModuleSelectorComponent } from './module-selector.component';
import { PricingSummaryComponent } from './pricing-summary.component';
import { TermsEditorComponent } from './terms-editor.component';
import { CustomDropdown, DropdownOption } from '../../../shared/components/custom-dropdown.component';
import { CollapsibleHelpCardComponent } from '../../../shared/components/collapsible-help-card.component';

const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: 'Cliente Preferencial', label: 'Cliente Preferencial', description: 'Tarifa y condiciones preferenciales' },
  { value: 'Empresa', label: 'Empresa', description: 'PyME o empresa consolidada' },
  { value: 'Emprendedor', label: 'Emprendedor', description: 'Profesional independiente o startup' },
  { value: 'Corporativo', label: 'Corporativo', description: 'Grandes cuentas corporativas' },
];

interface QuoteBuilderProps {
  editQuoteId?: string | null;
  onNavigate: (route: string, param?: string) => void;
}

export const QuoteBuilderComponent: React.FC<QuoteBuilderProps> = ({
  editQuoteId,
  onNavigate,
}) => {
  const existingQuote = editQuoteId ? QuotesService.getQuoteById(editQuoteId) : null;

  const [clientName, setClientName] = useState(existingQuote?.clientName || '');
  const [clientCategory, setClientCategory] = useState(existingQuote?.clientCategory || 'Cliente Preferencial');
  const [serviceTitle, setServiceTitle] = useState(existingQuote?.serviceTitle || 'Gestión de Instagram');
  const [serviceSubtitle, setServiceSubtitle] = useState(existingQuote?.serviceSubtitle || 'Servicio Mensual Inicial');
  const [slug, setSlug] = useState(existingQuote?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(existingQuote?.slug));

  const [modules, setModules] = useState<ServiceModule[]>(() => 
    existingQuote?.modules || [
      { id: `mod-${Date.now()}-1`, title: SEED_TEMPLATES[0].title, subtitle: SEED_TEMPLATES[0].subtitle, price: SEED_TEMPLATES[0].suggestedPrice, deliverables: [...SEED_TEMPLATES[0].deliverables] },
      { id: `mod-${Date.now()}-2`, title: SEED_TEMPLATES[1].title, subtitle: SEED_TEMPLATES[1].subtitle, price: SEED_TEMPLATES[1].suggestedPrice, deliverables: [...SEED_TEMPLATES[1].deliverables] }
    ]
  );

  const [pricing, setPricing] = useState<QuotePricing>(() => 
    existingQuote?.pricing || QuotesService.calculatePricing(modules, true, 50, 6, 'Bonificación Especial de Bienvenida')
  );

  const [terms, setTerms] = useState<string[]>(() => existingQuote?.terms || [...DEFAULT_TERMS.slice(0, 2)]);
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    if (!isSlugManual && clientName) setSlug(QuotesService.slugify(clientName));
  }, [clientName, isSlugManual]);

  // Recalcular pricing al alterar los módulos
  const handleModulesChange = (newModules: ServiceModule[]) => {
    setModules(newModules);
    const updatedPricing = QuotesService.calculatePricing(
      newModules,
      pricing.applyDiscount,
      pricing.discountPercentage,
      pricing.discountDurationMonths,
      pricing.discountTitle
    );
    setPricing(updatedPricing);
  };

  const constructQuote = (statusOverride?: Quote['status']): Quote => {
    const finalSlug = slug.trim() || QuotesService.slugify(clientName || 'propuesta');
    return {
      id: existingQuote?.id || `quote-${Date.now()}`,
      slug: finalSlug,
      clientName: clientName.trim() || 'Cliente Sin Nombre',
      clientCategory,
      serviceTitle: serviceTitle.trim() || 'Servicio Integral',
      serviceSubtitle: serviceSubtitle.trim() || 'Propuesta Mensual',
      createdAt: existingQuote?.createdAt || Date.now(),
      status: statusOverride || existingQuote?.status || 'SENT',
      modules,
      pricing,
      terms,
    };
  };

  const handleSaveAndPreview = () => {
    const quote = constructQuote();
    QuotesService.saveQuote(quote);
    onNavigate('proposal', quote.slug);
  };

  const handleSaveDraft = () => {
    const quote = constructQuote('DRAFT');
    QuotesService.saveQuote(quote);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      onNavigate('dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition"
            title="Volver al panel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              {existingQuote ? 'Editar Cotización' : 'Constructor de Propuesta Comercial'}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Personaliza módulos, honorarios mensuales y bonificaciones para el documento A4.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Borrador</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndPreview}
            className="px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Guardar y Ver Propuesta A4</span>
          </button>
        </div>
      </div>

      {/* Guía Rápida de Propuestas */}
      <CollapsibleHelpCardComponent
        storageKey="builder_guide"
        title="¿Cómo armar esta propuesta en 3 pasos rápidos?"
        subtitle="Completá estos campos sencillos y tendrás la cotización lista para compartir por WhatsApp."
        steps={[
          {
            title: '1. Nombre del Cliente',
            description: 'Escribí el nombre de la marca o negocio. El enlace web se generará automáticamente.',
            badge: 'Datos',
          },
          {
            title: '2. Módulos & Servicios',
            description: 'Abajo marcá qué servicios vas a brindarle (Feed, Reels, Historias, etc.) o ajustá sus precios sugeridos.',
            badge: 'Servicios',
          },
          {
            title: '3. Guardar y Enviar',
            description: 'Hacé clic en el botón azul "Guardar y Ver Propuesta A4". Te abrirá la página para copiar el link y pasárselo.',
            badge: 'Listo',
          },
        ]}
        tip="Si querés aplicar un descuento de bienvenida (ej. 50% los primeros 6 meses), lo podés ajustar en la caja de 'Resumen de Inversión' más abajo."
        defaultOpen={false}
      />

      {isSavedToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Cotización guardada exitosamente.</span>
        </div>
      )}

      {/* 1. Cabecera del Prospecto */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" /> Datos del Prospecto & Propuesta
          </h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">Paso 1 de 4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nombre del Cliente / Empresa *
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej. Marca de Ropa, Clínica Dental, Estudio, etc."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Categoría de Cliente
            </label>
            <CustomDropdown
              value={clientCategory}
              onChange={(newVal) => setClientCategory(newVal)}
              options={CATEGORY_OPTIONS}
              variant="select"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Título del Servicio Comercial *
            </label>
            <input
              type="text"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              placeholder="Ej. Gestión de Instagram"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Subtítulo / Modalidad de Contratación
            </label>
            <input
              type="text"
              value={serviceSubtitle}
              onChange={(e) => setServiceSubtitle(e.target.value)}
              placeholder="Ej. Servicio Mensual Inicial"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>

        {/* Slug preview con ayuda contextual */}
        <div className="space-y-1.5 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <LinkIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-500 font-medium">Enlace público para el cliente:</span>
              <span className="font-mono text-slate-700">/propuesta/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setSlug(QuotesService.slugify(e.target.value));
                }}
                placeholder="nombre-del-cliente"
                className="font-mono text-sm text-blue-700 font-semibold bg-white border border-slate-300 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-[11px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
              💡 Este es el link que se abre desde WhatsApp
            </span>
          </div>
        </div>
      </div>

      {/* 2. Selector de Módulos */}
      <ModuleSelectorComponent modules={modules} onChange={handleModulesChange} />

      {/* 3. Resumen Financiero */}
      <PricingSummaryComponent
        pricing={pricing}
        modules={modules}
        onPricingChange={(newPricing) => setPricing(newPricing)}
      />

      {/* 4. Editor de Términos */}
      <TermsEditorComponent terms={terms} onChange={(newTerms) => setTerms(newTerms)} />

      {/* Bottom floating save bar */}
      <div className="sticky bottom-4 z-30 bg-slate-900/90 backdrop-blur text-white p-4 rounded-xl shadow-lg border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block">Total Mensual Acordado</span>
          <span className="text-lg font-bold font-heading text-white">
            {QuotesService.formatCurrency(pricing.finalMonthlyPrice)}
            <span className="text-xs font-normal text-slate-400">/mes</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            Guardar Borrador
          </button>
          <button
            type="button"
            onClick={handleSaveAndPreview}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Previsualizar Propuesta A4</span>
          </button>
        </div>
      </div>
    </div>
  );
};
