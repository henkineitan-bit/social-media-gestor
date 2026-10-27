import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { FileText, CheckCircle2, DollarSign, BarChart3 } from 'lucide-react';
import { Quote } from '../../../core/models/quote.model';
import { QuotesService } from '../../../core/services/quotes.service';

interface DashboardStatsChartsProps {
  quotes: Quote[];
}

const STATUS_COLORS: Record<string, string> = {
  APPROVED: '#10B981',
  SENT: '#2563EB',
  DRAFT: '#94A3B8',
  REJECTED: '#F43F5E',
};

const tooltipStyle = {
  backgroundColor: '#0F172A',
  color: '#FFF',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
  border: 'none',
  padding: '8px 12px',
};

export const DashboardStatsChartsComponent: React.FC<DashboardStatsChartsProps> = ({ quotes }) => {
  const [activeView, setActiveView] = useState<'pipeline' | 'composition'>('pipeline');

  const totalQuotes = quotes.length;
  const sentQuotes = quotes.filter((q) => q.status === 'SENT').length;
  const approvedQuotes = quotes.filter((q) => q.status === 'APPROVED').length;
  const draftQuotes = quotes.filter((q) => q.status === 'DRAFT').length;
  const rejectedQuotes = quotes.filter((q) => q.status === 'REJECTED').length;
  const conversionRate = totalQuotes > 0 ? Math.round((approvedQuotes / totalQuotes) * 100) : 0;

  const monthlyPipeline = quotes
    .filter((q) => q.status === 'APPROVED' || q.status === 'SENT')
    .reduce((sum, q) => sum + (q.pricing?.finalMonthlyPrice || 0), 0);

  const totalContractPipeline = quotes
    .filter((q) => q.status === 'APPROVED' || q.status === 'SENT')
    .reduce((sum, q) => sum + ((q.pricing?.finalMonthlyPrice || 0) * (q.pricing?.discountDurationMonths || 6)), 0);

  const statusPieData = [
    { name: 'Aprobadas', value: approvedQuotes, color: STATUS_COLORS.APPROVED },
    { name: 'Enviadas', value: sentQuotes, color: STATUS_COLORS.SENT },
    { name: 'Borradores', value: draftQuotes, color: STATUS_COLORS.DRAFT },
    { name: 'Rechazadas', value: rejectedQuotes, color: STATUS_COLORS.REJECTED },
  ].filter((item) => item.value > 0);

  const barChartData = quotes.slice(0, 5).map((q) => ({
    name: q.clientName.length > 14 ? `${q.clientName.substring(0, 12)}...` : q.clientName,
    fullName: q.clientName,
    precioPromocional: q.pricing?.finalMonthlyPrice || 0,
    precioLista: q.pricing?.listPrice || 0,
  }));

  const sparklineData = [
    { month: 'Jul', valor: Math.round(monthlyPipeline * 0.45) },
    { month: 'Ago', valor: Math.round(monthlyPipeline * 0.65) },
    { month: 'Sep', valor: Math.round(monthlyPipeline * 0.82) },
    { month: 'Oct', valor: monthlyPipeline },
  ];

  return (
    <div className="space-y-4">
      {/* 3 Tarjetas de Métricas con Micro-Gráficos Recharts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Cotizaciones Emitidas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          whileHover={{ y: -4, transition: { duration: 0.18 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cotizaciones Emitidas</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 font-heading">{totalQuotes}</span>
              <span className="text-xs text-slate-500 font-medium">{totalQuotes === 1 ? 'propuesta' : 'propuestas'}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{sentQuotes} en negociación • {approvedQuotes} cerradas</p>
          </div>
          <div className="h-16 w-full mt-3 pt-2 border-t border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Aprob.', count: approvedQuotes, fill: STATUS_COLORS.APPROVED },
                  { name: 'Env.', count: sentQuotes, fill: STATUS_COLORS.SENT },
                  { name: 'Borr.', count: draftQuotes, fill: STATUS_COLORS.DRAFT },
                  { name: 'Rech.', count: rejectedQuotes, fill: STATUS_COLORS.REJECTED },
                ]}
                barSize={18}
                margin={{ top: 4, right: 6, left: 6, bottom: 0 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} formatter={(val: any) => [String(val), 'Cotizaciones']} contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <Cell fill={STATUS_COLORS.APPROVED} />
                  <Cell fill={STATUS_COLORS.SENT} />
                  <Cell fill={STATUS_COLORS.DRAFT} />
                  <Cell fill={STATUS_COLORS.REJECTED} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Card 2: Tasa de Conversión Actual con Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          whileHover={{ y: -4, transition: { duration: 0.18 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasa de Conversión</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600 font-heading">{conversionRate}%</span>
                <span className="text-xs text-slate-500">éxito</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{approvedQuotes} aprobadas de {totalQuotes}</p>
            </div>
            <div className="w-16 h-16 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData.length > 0 ? statusPieData : [{ name: 'Sin datos', value: 1, color: '#E2E8F0' }]}
                    dataKey="value" innerRadius={18} outerRadius={28} strokeWidth={0}
                  >
                    {statusPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Cierre</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /> Enviadas</span>
          </div>
        </motion.div>

        {/* Card 3: Valor Total Pipeline con Area Sparkline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.19 }}
          whileHover={{ y: -4, transition: { duration: 0.18 } }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor Total Pipeline</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {QuotesService.formatCurrency(monthlyPipeline)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/mes</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Contratos: <strong className="text-slate-700">{QuotesService.formatCurrency(totalContractPipeline)}</strong>
            </p>
          </div>
          <div className="h-16 w-full mt-3 pt-2 border-t border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="pipelineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip formatter={(val: any) => [QuotesService.formatCurrency(Number(val) || 0), 'Abono']} contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="valor" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#pipelineGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Panel Analítico Detallado */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Análisis Visual del Pipeline & Honorarios Mensuales
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparativa de Precio Promocional acordado vs. Precio de Lista estándar por propuesta.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('pipeline')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                activeView === 'pipeline' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pipeline por Cliente
            </button>
            <button
              onClick={() => setActiveView('composition')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                activeView === 'composition' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Distribución Estados
            </button>
          </div>
        </div>

        {activeView === 'pipeline' ? (
          <div className="space-y-3">
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 10, right: 15, left: 0, bottom: 20 }}
                  barSize={32}
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `$${Math.round(val / 1000)}k`} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      QuotesService.formatCurrency(Number(val) || 0),
                      name === 'precioPromocional' ? 'Total Mensual Promocional' : 'Precio de Lista Estándar',
                    ]}
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullName || ''}
                    contentStyle={tooltipStyle}
                  />
                  <Bar dataKey="precioPromocional" name="precioPromocional" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="precioLista" name="precioLista" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Leyenda descriptiva */}
            <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600" />
                <span className="font-medium">Precio Promocional (Abono Mensual)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-300" />
                <span className="font-medium">Precio de Lista Estándar</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  outerRadius={75} innerRadius={42} dataKey="value"
                >
                  {statusPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(val: any) => [String(val), 'Cotizaciones']} contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
