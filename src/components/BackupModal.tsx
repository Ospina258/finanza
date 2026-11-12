import React, { useState } from 'react';
import { X, Download, Upload, RefreshCw, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { FinzenData } from '../types/financial';
import { hoy } from '../utils/calculations';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FinzenData;
  onRestoreData: (restoredData: FinzenData) => void;
  onResetAll: () => void;
  onLoadDemo: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  data,
  onRestoreData,
  onResetAll,
  onLoadDemo,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `finzen_backup_${hoy()}.json`);
    dlAnchorElem.click();
    setSuccess('Copia de seguridad descargada exitosamente');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!parsed || !Array.isArray(parsed.transacciones)) {
          throw new Error('El archivo no contiene un formato válido de Finzen');
        }
        onRestoreData(parsed);
        setSuccess('¡Datos restaurados correctamente!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err: any) {
        setError('Error al procesar el archivo: ' + (err.message || 'JSON inválido'));
      }
    };
    reader.readAsText(file);
  };

  const handleImportText = () => {
    try {
      if (!jsonText.trim()) {
        setError('Por favor pega el código JSON de tu respaldo');
        return;
      }
      const parsed = JSON.parse(jsonText);
      if (!parsed || !Array.isArray(parsed.transacciones)) {
        throw new Error('Estructura de respaldo no válida. Debe contener transacciones');
      }
      onRestoreData(parsed);
      setSuccess('¡Datos restaurados correctamente!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError('Formato JSON no válido. Verifica el texto copiado.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f172a] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]/70">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Respaldo y Datos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-sm">
          {success && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Export */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Exportar Respaldo</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Descarga un archivo JSON con todos tus movimientos, metas y préstamos.
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Descargar Archivo JSON ({data.transacciones?.length || 0} movimientos)</span>
            </button>

            <a
              href="./finzen-app.zip"
              download="finzen-app.zip"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 font-semibold text-xs flex items-center justify-center gap-2 border border-indigo-500/30 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Descargar Repositorio Completo (.ZIP listo para GitHub)</span>
            </a>
          </div>

          {/* Section 2: Import */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-3">
            <div>
              <h4 className="font-bold text-white text-sm">Restaurar Respaldo</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Carga un archivo JSON previo o pega el texto directamente.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block w-full py-2.5 px-4 rounded-xl bg-indigo-950/40 border border-dashed border-indigo-500/40 hover:border-indigo-400 text-indigo-300 font-medium text-xs text-center cursor-pointer transition-colors">
                <Upload className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                <span>Seleccionar archivo .json desde tu dispositivo</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-semibold">o pegar texto JSON</div>

              <textarea
                rows={3}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setError('');
                }}
                placeholder='Pega aquí el contenido JSON {"transacciones": [...] }'
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
              />

              {jsonText && (
                <button
                  onClick={handleImportText}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Procesar e Importar
                </button>
              )}
            </div>
          </div>

          {/* Section 3: Reset / Demo Data */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">Opciones Avanzadas</h4>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onLoadDemo();
                  setSuccess('Datos de demostración cargados');
                  setTimeout(() => onClose(), 1000);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Cargar Datos Demo</span>
              </button>
            </div>

            {confirmReset ? (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 space-y-2">
                <p className="text-xs text-rose-200 font-medium">
                  ¿Estás completamente seguro? Esto borrará tus datos permanentemente de este navegador.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onResetAll();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Sí, Borrar Todo
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                Restablecer y Borrar todos los datos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
