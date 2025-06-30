import React from 'react';
import { BadgeCheck, PiggyBank, TrendingDown, Eye, Pencil, Trash2 } from "lucide-react";

const ObjetivoCard = ({ objetivo, onEditar, onEliminar, onVer }) => {
  const {
    id,
    tipo,
    titulo,
    descripcion,
    monto_actual,
    monto_objetivo,
    fecha_inicio,
    fecha_fin
  } = objetivo;

  console.log('objetivo:')
  console.log(objetivo)

  // Calcular progreso
  let progreso = 0;
  if (monto_objetivo > 0) {
    progreso = (monto_actual / monto_objetivo) * 100;
    progreso = Math.min(progreso, 100);
  }

  // Config tipo
  const configTipo = {
    saldo_minimo: {
      icon: <BadgeCheck className="text-green-600" />,
      color: monto_actual >= monto_objetivo ? "text-green-700" : "text-red-600",
      label: "Saldo mínimo"
    },
    gasto_acumulado: {
      icon: <TrendingDown className="text-yellow-600" />,
      color: monto_actual > monto_objetivo ? "text-red-600" : "text-yellow-700",
      label: "Gasto acumulado"
    },
    ahorro: {
      icon: <PiggyBank className="text-blue-600" />,
      color: "text-blue-700",
      label: "Objetivo de ahorro"
    }
  };

  const { icon, color, label } = configTipo[tipo];

  return (
    <div className="p-4 shadow-md rounded-2xl space-y-2 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className={`text-lg font-semibold ${color}`}>{label}</h2>
        </div>
        <span className="text-xs text-gray-500">{fecha_inicio} → {fecha_fin}</span>
      </div>

      <h3 className="text-md font-bold">{titulo}</h3>
      <p className="text-sm text-gray-700">{descripcion}</p>

      <div className="text-sm">
        {tipo === "saldo_minimo" && (
          <>
            <p>Saldo actual: ${monto_actual}</p>
            <p>Saldo mínimo requerido: ${monto_objetivo}</p>
          </>
        )}
        {tipo === "gasto_acumulado" && (
          <>
            <p>Gasto acumulado: ${monto_actual}</p>
            <p>Límite de gasto: ${monto_objetivo}</p>
          </>
        )}
        {tipo === "ahorro" && (
          <>
            <p>Ahorro actual: ${monto_actual}</p>
            <p>Meta de ahorro: ${monto_objetivo}</p>
          </>
        )}
      </div>
      
      <p className="text-xs text-gray-500">Progreso: {Math.round(progreso)}%</p>

      <div className="flex justify-end gap-2 pt-2">
        <button
          variant="outline"
          size="icon"
          onClick={() => onVer(id)}
          title="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          variant="outline"
          size="icon"
          onClick={() => onEditar(id)}
          title="Editar"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          variant="destructive"
          size="icon"
          onClick={() => onEliminar(id)}
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ObjetivoCard;