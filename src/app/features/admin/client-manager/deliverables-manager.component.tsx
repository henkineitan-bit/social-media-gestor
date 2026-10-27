import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  FileImage,
  Video,
  Save
} from 'lucide-react';
import { Client, DeliverableItem } from '../../../core/models/client.model';
import { ClientsService } from '../../../core/services/clients.service';
import { CustomDropdown, DropdownOption } from '../../../shared/components/custom-dropdown.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';

interface DeliverablesManagerProps {
  client: Client;
}

const STATUS_CONFIG: Record<
  DeliverableItem['status'],
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  WAITING_ASSETS: { label: 'Esperando Insumos', bg: 'bg-[#FFF3D6]', text: 'text-[#B45309]', border: 'border-[#FDE68A]', dot: 'bg-[#F59E0B]' },
  IN_PRODUCTION: { label: 'En Producción / Diseño', bg: 'bg-[#E8F0FF]', text: 'text-[#1760FF]', border: 'border-[#B8D2FF]', dot: 'bg-[#1760FF]' },
  PENDING_APPROVAL: { label: 'Listo para Aprobación', bg: 'bg-[#F1F5F9]', text: 'text-[#475569]', border: 'border-[#CBD5E1]', dot: 'bg-[#64748B]' },
  CHANGES_REQUESTED: { label: 'Ajustes Solicitados', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
  APPROVED: { label: 'Aprobado para Publicar', bg: 'bg-[#DDF8EC]', text: 'text-[#12B76A]', border: 'border-[#B6EED1]', dot: 'bg-[#12B76A]' },
};

const DELIVERABLE_STATUS_OPTIONS: DropdownOption<DeliverableItem['status']>[] = (
  Object.keys(STATUS_CONFIG) as DeliverableItem['status'][]
).map((key) => ({
  value: key,
  label: STATUS_CONFIG[key].label,
  dotColor: STATUS_CONFIG[key].dot,
  badgeClasses: {
    bg: STATUS_CONFIG[key].bg,
    text: STATUS_CONFIG[key].text,
    border: STATUS_CONFIG[key].border,
  },
}));

export const DeliverablesManagerComponent: React.FC<DeliverablesManagerProps> = ({ client }) => {
  const [weekName, setWeekName] = useState('Semana 2 - Noviembre');
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [deliverableIdToDelete, setDeliverableIdToDelete] = useState<string | null>(null);

  const handleGenerateWeek = () => {
    if (!weekName.trim()) return;
    ClientsService.generateWeeklyDeliverables(client.id, weekName.trim());
    setShowAddWeekModal(false);
  };

  const handleUpdate = (id: string, updates: Partial<DeliverableItem>) => {
    ClientsService.updateDeliverable(client.id, id, updates);
  };

  const handleDelete = (id: string) => {
    setDeliverableIdToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (deliverableIdToDelete) {
      ClientsService.deleteDeliverable(client.id, deliverableIdToDelete);
      setDeliverableIdToDelete(null);
    }
  };

  const deliverables = client.deliverables || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Calendario & Entregas Semanales ({deliverables.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Producción de las 2 piezas semanales contratadas (1 posteo estático + 1 video Reel).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddWeekModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generar Semana de Trabajo</span>
          </button>
        </div>
      </div>

      {/* Modal / Quick prompt to name week */}
      {showAddWeekModal && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex-1 w-full sm:w-auto">
            <label className="block text-xs font-semibold text-blue-900 mb-1">
              Nombre de la Semana a Generar (Crea 1 Posteo Gráfico + 1 Video Reel)
            </label>
            <input
              type="text"
              value={weekName}
              onChange={(e) => setWeekName(e.target.value)}
              placeholder="Ej. Semana 2 - Noviembre"
              className="w-full text-xs bg-white border border-blue-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-600"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setShowAddWeekModal(false)}
              className="text-xs text-slate-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerateWeek}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
            >
              Crear Entregables
            </button>
          </div>
        </div>
      )}

      {/* Deliverables List */}
      <div className="space-y-4">
        {deliverables.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 shadow-xs">
            <CalendarDays className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Sin entregables asignados</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Haz clic en &quot;Generar Semana de Trabajo&quot; para crear las piezas de la semana.
            </p>
          </div>
        ) : (
          deliverables.map((item) => {
            const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.WAITING_ASSETS;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
                {/* Header row: title, type, week badge, and status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      {item.type === 'GRAPHIC_POST' ? <FileImage className="w-4 h-4 text-blue-600" /> : <Video className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-heading">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.weekLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {item.type === 'GRAPHIC_POST' ? '1 pieza gráfica semanal' : '1 video Reel semanal'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <CustomDropdown<DeliverableItem['status']>
                      value={item.status}
                      onChange={(newStatus) => handleUpdate(item.id, { status: newStatus })}
                      options={DELIVERABLE_STATUS_OPTIONS}
                      variant="compact-pill"
                      align="right"
                      title="Actualizar estado de la entrega"
                    />

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Eliminar entrega"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Feedback alert if changes requested */}
                {item.status === 'CHANGES_REQUESTED' && item.clientFeedback && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-900 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Ajuste Solicitado por el Cliente:</span>
                      <p className="mt-0.5 leading-relaxed">{item.clientFeedback}</p>
                    </div>
                  </div>
                )}

                {/* Content grid: raw assets link, agency preview link, copy editor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Links */}
                  <div className="space-y-3">
                    {/* Raw Assets Link from client */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Insumos Crudos del Cliente (Drive / Fotos / Videos)
                      </label>
                      {item.rawAssetsLink ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={item.rawAssetsLink}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-600 truncate"
                          />
                          <a
                            href={item.rawAssetsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition shrink-0"
                            title="Abrir carpeta de insumos"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px] block bg-slate-50 p-2 rounded-lg border border-dashed border-slate-200">
                          El cliente aún no ha enviado el link de insumos para esta semana.
                        </span>
                      )}
                    </div>

                    {/* Agency Preview Link */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Link de la Pieza Terminada (Drive / Canva / Video editado)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/... o link de Canva"
                          value={item.agencyPreviewLink || ''}
                          onChange={(e) => handleUpdate(item.id, { agencyPreviewLink: e.target.value })}
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                        />
                        {item.agencyPreviewLink && (
                          <a
                            href={item.agencyPreviewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition shrink-0"
                            title="Probar link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Copywriting / Post text */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Copy / Texto Propuesto para Instagram
                    </label>
                    <textarea
                      rows={4}
                      value={item.copyText || ''}
                      onChange={(e) => handleUpdate(item.id, { copyText: e.target.value })}
                      placeholder="Redacta el texto de la publicación, hashtags y llamado a la acción..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:bg-white focus:border-blue-500 resize-y leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Modal de Confirmación para Eliminar Entrega */}
      <ConfirmModalComponent
        isOpen={deliverableIdToDelete !== null}
        onClose={() => setDeliverableIdToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar esta entrega del calendario?"
        description="Esta acción eliminará la pieza programada del portal del cliente. Se perderán las revisiones asociadas a esta entrega."
        confirmText="Sí, Eliminar Entrega"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
