import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Quote } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';
import { BrandLogo } from '../../../shared/components/brand-logo.component';

interface ProposalSheetProps {
  quote: Quote;
  isApproved: boolean;
}

export const ProposalSheetComponent: React.FC<ProposalSheetProps> = ({
  quote,
  isApproved,
}) => {
  const formattedDate = new Date(quote.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="print-page max-w-4xl mx-auto bg-white shadow-md border border-slate-200/90 rounded-none md:rounded-2xl p-8 md:p-14 print:p-0 print:border-none print:shadow-none print:max-w-none text-slate-900 mt-14 sm:mt-16 print:mt-0 space-y-8 print:space-y-6">
      {/* Sello de Aprobación */}
      {isApproved && (
        <div className="bg-[#DDF8EC] border border-[#B6EED1] rounded-xl p-4 flex items-center justify-between text-sm text-[#0c7041] print:border-[#B6EED1] print-avoid-break break-inside-avoid">
          <div className="flex items-center gap-2.5 font-semibold">
            <ShieldCheck className="w-5 h-5 text-[#12B76A]" />
            <span>Documento Oficial Aceptado por el Cliente - Estado: APROBADO</span>
          </div>
          <span className="font-mono text-xs font-bold text-[#0c7041] bg-[#c3f2dc] px-2.5 py-1 rounded">Ref: #{quote.id}</span>
        </div>
      )}

      {/* 1. Cabecera Institucional con Logo Oficial */}
      <div className="border-b-2 border-[#081B3A] pb-6 print:pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 print-avoid-break break-inside-avoid">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BrandLogo variant="horizontal" className="h-10 sm:h-12 w-auto" alt="Gestión Digital & Social Media" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1760FF] tracking-wider uppercase font-heading">
              Propuesta Comercial Ejecutiva • Servicios & Entregables
            </span>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
              Estrategia mensual, Producción Audiovisual, Identidad Visual y Optimización Continua de Presencia Digital en Instagram.
            </p>
          </div>
        </div>

        <div className="text-left md:text-right text-xs sm:text-sm text-[#64748B] shrink-0 bg-[#F7FAFF] p-3 rounded-xl border border-[#DCE6F4]">
          <p><span className="font-bold text-[#081B3A]">Fecha de Emisión:</span> {formattedDate}</p>
          <p className="mt-1"><span className="font-bold text-[#081B3A]">Validez:</span> 15 días corridos</p>
          <p className="mt-1 font-mono text-[11px] text-[#1760FF] font-semibold">ID: #{quote.id}</p>
        </div>
      </div>

      {/* 2. Bloque de Destinatario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/90 p-5 print:p-4 rounded-xl border border-slate-200 text-sm print-avoid-break break-inside-avoid">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Preparado Para
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-bold text-slate-900 font-heading">
              {quote.clientName}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md border border-blue-200">
              {quote.clientCategory}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 md:text-right">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Detalle de Propuesta
          </span>
          <p className="text-base font-bold text-slate-900 font-heading">
            {quote.serviceTitle}
          </p>
          <p className="text-slate-600 text-xs sm:text-sm">{quote.serviceSubtitle}</p>
        </div>
      </div>

      {/* 3. Tabla Estilizada: Detalle del Servicio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-heading flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            Detalle del Servicio
          </h2>
          <span className="text-xs font-semibold text-slate-500">{quote.modules.length} Módulos Integrados</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200 text-xs">
                <th className="py-3.5 px-5 w-2/5">Módulo de Trabajo</th>
                <th className="py-3.5 px-5 w-3/5">Entregables Incluidos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {quote.modules.map((mod, idx) => (
                <tr key={mod.id || idx} className="align-top hover:bg-slate-50/50 transition print-avoid-break break-inside-avoid">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 text-sm sm:text-base font-heading">
                      {idx + 1}. {mod.title}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {mod.subtitle}
                    </p>
                    {mod.price > 0 && (
                      <span className="inline-block mt-2.5 font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        Valor ref: {QuotesService.formatCurrency(mod.price)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <ul className="space-y-2">
                      {mod.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2.5 text-slate-800 text-xs sm:text-sm leading-normal">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Caja Destacada: Bonificación Especial & Desglose Financiero */}
      <div className="space-y-3.5 pt-2 print-avoid-break break-inside-avoid">
        {quote.pricing?.applyDiscount && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 sm:p-6 text-sm text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-blue-950 font-heading text-base sm:text-lg block">
                  {quote.pricing.discountTitle || 'Bonificación Especial de Bienvenida'}
                </span>
                <p className="text-blue-900 text-sm mt-1 leading-relaxed">
                  Se aplica un <strong className="font-bold">{quote.pricing.discountPercentage}% de descuento directo</strong> sobre la cuota mensual
                  durante los primeros <strong className="font-bold">{quote.pricing.discountDurationMonths} meses</strong> de contratación del servicio.
                </p>
              </div>
            </div>
            <div className="bg-white border border-blue-200 px-4 py-2.5 rounded-xl text-right shrink-0 shadow-2xs">
              <span className="text-xs text-blue-700 uppercase font-bold tracking-wider block">Ahorro Mensual</span>
              <span className="font-black text-blue-700 font-heading text-base sm:text-lg">
                - {QuotesService.formatCurrency(quote.pricing.discountAmount)}
              </span>
            </div>
          </div>
        )}

        {/* Tabla de Desglose Numérico */}
        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 bg-white shadow-xs text-sm">
          <div className="p-4 px-6 flex items-center justify-between bg-slate-50">
            <span className="text-slate-700 font-medium">Precio de Lista Mensual:</span>
            <span className="font-bold text-slate-900 font-heading text-base">
              {QuotesService.formatCurrency(quote.pricing?.listPrice || 0)}
            </span>
          </div>

          {quote.pricing?.applyDiscount && (
            <div className="p-4 px-6 flex items-center justify-between bg-blue-50/50 text-blue-950 font-medium">
              <span>
                Descuento (Primeros {quote.pricing.discountDurationMonths} meses - {quote.pricing.discountPercentage}%):
              </span>
              <span className="font-bold text-blue-700 font-heading text-base">
                - {QuotesService.formatCurrency(quote.pricing.discountAmount)}
              </span>
            </div>
          )}

          <div className="p-5 px-6 flex items-center justify-between bg-slate-900 text-white">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-300 block font-heading">
                Total Mensual Promocional
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                {quote.pricing?.applyDiscount
                  ? `Abono congelado por los primeros ${quote.pricing.discountDurationMonths} meses`
                  : 'Abono mensual estándar vigente'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-white font-heading">
                {QuotesService.formatCurrency(quote.pricing?.finalMonthlyPrice || 0)}
              </span>
              <span className="text-sm text-slate-300 font-normal ml-1.5">/mes</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Pie de Página: Términos y Condiciones Generales */}
      <div className="pt-5 border-t border-slate-200 space-y-2.5 print-avoid-break break-inside-avoid">
        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs sm:text-sm font-heading">
          Términos y Condiciones Generales
        </h3>
        <ol className="list-decimal list-outside pl-4 space-y-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {quote.terms?.map((term, tIdx) => (
            <li key={tIdx}>{term}</li>
          ))}
        </ol>
      </div>

      {/* Firmas al pie */}
      <div className="pt-8 print:pt-6 grid grid-cols-2 gap-8 text-center text-sm text-slate-500 border-t border-slate-200 print-avoid-break break-inside-avoid">
        <div>
          <div className="border-b border-slate-300 w-3/4 mx-auto mb-2.5 pb-6 print:pb-4" />
          <span className="font-bold text-slate-800 block text-sm">Gestión Digital & Social Media</span>
          <span className="text-xs text-slate-500">Área de Estrategia & Cuentas</span>
        </div>
        <div>
          <div className="border-b border-slate-300 w-3/4 mx-auto mb-2.5 pb-6 print:pb-4" />
          <span className="font-bold text-slate-800 block text-sm">{quote.clientName}</span>
          <span className="text-xs text-slate-500">Conformidad de Contratación</span>
        </div>
      </div>
    </div>
  );
};
