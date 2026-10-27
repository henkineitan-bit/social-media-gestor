import React, { useState } from 'react';
import { FileCheck, Plus, X, RotateCcw } from 'lucide-react';
import { DEFAULT_TERMS } from '../../../core/services/quotes.service';

interface TermsEditorProps {
  terms: string[];
  onChange: (terms: string[]) => void;
}

export const TermsEditorComponent: React.FC<TermsEditorProps> = ({ terms, onChange }) => {
  const [newTermText, setNewTermText] = useState('');

  const handleAddTerm = () => {
    if (!newTermText.trim()) return;
    onChange([...terms, newTermText.trim()]);
    setNewTermText('');
  };

  const handleRemoveTerm = (index: number) => {
    onChange(terms.filter((_, i) => i !== index));
  };

  const handleUpdateTerm = (index: number, val: string) => {
    const updated = [...terms];
    updated[index] = val;
    onChange(updated);
  };

  const handleResetDefaults = () => {
    onChange([...DEFAULT_TERMS]);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            Términos & Condiciones Generales
          </h3>
          <p className="text-sm text-slate-600 mt-0.5">
            Aparecen al pie del documento A4 como cláusulas de contratación y entrega.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 p-2 hover:bg-slate-100 rounded-lg transition"
          title="Restablecer términos estándar"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Cláusulas Estándar</span>
        </button>
      </div>

      <div className="space-y-3">
        {terms.map((term, index) => (
          <div key={index} className="flex items-start gap-2.5 group">
            <span className="text-sm font-bold text-slate-500 mt-2 shrink-0 w-5">
              {index + 1}.
            </span>
            <textarea
              rows={2}
              value={term}
              onChange={(e) => handleUpdateTerm(index, e.target.value)}
              className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3 focus:outline-none focus:bg-white focus:border-blue-500 transition resize-y leading-relaxed"
            />
            <button
              type="button"
              onClick={() => handleRemoveTerm(index)}
              className="p-2 text-slate-400 hover:text-rose-500 transition mt-1.5 rounded-lg"
              title="Eliminar cláusula"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2.5 pt-2">
        <input
          type="text"
          placeholder="Añadir una nueva cláusula o condición..."
          value={newTermText}
          onChange={(e) => setNewTermText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTerm();
            }
          }}
          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAddTerm}
          className="shrink-0 text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>
    </div>
  );
};
