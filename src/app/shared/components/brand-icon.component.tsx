import React from 'react';

export type BrandIconName =
  | 'dashboard'
  | 'cotizaciones'
  | 'nueva'
  | 'crm-clientes'
  | 'catalogo-precios'
  | 'ver-tienda'
  | 'paquetes'
  | 'modulos'
  | 'entregables'
  | 'calendario'
  | 'analitica'
  | 'configuracion'
  | 'editar'
  | 'eliminar'
  | 'ver'
  | 'check'
  | 'descargar'
  | 'buscar'
  | 'notificaciones'
  | 'salir'
  | 'ayuda';

export interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  name: BrandIconName;
  className?: string;
  size?: number | string;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  ...props
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <use href={`#${name}`} />
    </svg>
  );
};
