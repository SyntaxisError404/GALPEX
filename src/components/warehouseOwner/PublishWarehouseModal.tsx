import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { CargoCategory } from '../../types';
import { Building2, X, Check } from 'lucide-react';

export const PublishWarehouseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { publishWarehouse } = useNexo();

  const [name, setName] = useState('');
  const [city, setCity] = useState('Valencia');
  const [industrialZone, setIndustrialZone] = useState('Z.I. Castillito');
  const [address, setAddress] = useState('');
  const [totalM2, setTotalM2] = useState<number>(600);
  const [availableM2, setAvailableM2] = useState<number>(250);
  const [dailyRate, setDailyRate] = useState<number>(1.40);
  const [selectedCategories, setSelectedCategories] = useState<CargoCategory[]>(['carga_seca', 'repuestos_ferreteria']);

  const handleToggleCategory = (cat: CargoCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    publishWarehouse({
      name,
      subtitle: `${industrialZone} • Nave Disponible`,
      city,
      state: city === 'Maracay' ? 'Aragua' : city === 'Caracas' ? 'Distrito Capital' : 'Carabobo',
      industrialZone,
      address: address || `Av. Principal ${industrialZone}, Manzana 8`,
      totalM2,
      availableM2,
      idlePercentage: Math.round((availableM2 / totalM2) * 100),
      dailyRatePerPallet: dailyRate,
      categoriesAccepted: selectedCategories,
      features: ['Andén nivelador', 'CCTV HD 24/7', 'Control biométrico', 'Montacargas'],
      securityBadges: ['Seguridad 24/7 Verificada', 'Póliza Antisiniestro'],
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      verifiedOwner: {
        id: 'usr-manuel-galpon',
        name: 'Manuel Mendoza',
        company: 'Logística Castillito C.A.',
        rif: 'J-31098234-9',
        phone: '+58 414-4328901',
        rating: 4.9
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold">
              Publicar Nuevo Galpón / Espacio Ocioso
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nombre Comercial del Galpón / Nave</label>
            <input
              type="text"
              required
              placeholder="ej. Centro Logístico Carabobo Sur - Bahía 3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ciudad</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              >
                <option value="Valencia">Valencia (Carabobo)</option>
                <option value="San Diego">San Diego (Carabobo)</option>
                <option value="Los Guayos">Los Guayos (Carabobo)</option>
                <option value="Maracay">Maracay (Aragua)</option>
                <option value="Caracas">Caracas (Capital)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Zona Industrial</label>
              <input
                type="text"
                value={industrialZone}
                onChange={(e) => setIndustrialZone(e.target.value)}
                placeholder="ej. Z.I. Castillito, El Tigre, etc."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Dirección exacta (opcional)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ej. Av. Principal, Manzana 8, Galpón B-12"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">M² Totales</label>
              <input
                type="number"
                value={totalM2}
                onChange={(e) => setTotalM2(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">M² Ociosos Disp.</label>
              <input
                type="number"
                value={availableM2}
                onChange={(e) => setAvailableM2(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tarifa USD/paleta/día</label>
              <input
                type="number"
                step="0.05"
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Categorías de Mercancía Habilitadas (Evita Contaminación Cruzada)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'carga_seca', label: 'Carga Seca' },
                { id: 'alimentos_empacados', label: 'Alimentos Empacados' },
                { id: 'repuestos_ferreteria', label: 'Repuestos / Ferretería' },
                { id: 'refrigerado', label: 'Refrigerado' }
              ].map((c) => {
                const checked = selectedCategories.includes(c.id as CargoCategory);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => handleToggleCategory(c.id as CargoCategory)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition ${
                      checked
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{c.label}</span>
                    {checked && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition"
            >
              Publicar y Comenzar a Monetizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
