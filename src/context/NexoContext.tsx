import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserRole, Warehouse, StoredLot, Dispatch, EscrowTransaction, CargoCategory } from '../types';

type TabId = 'explorar' | 'inventario' | 'despachos' | 'escrow';

// Pestañas permitidas y vista principal (home) de cada perfil.
// Mantiene la navegación coherente: al cambiar de rol se aterriza en su vista central.
const ROLE_TABS: Record<UserRole, { home: TabId; allowed: TabId[] }> = {
  proveedor: { home: 'explorar', allowed: ['explorar', 'despachos', 'escrow'] },
  dueno_galpon: { home: 'inventario', allowed: ['inventario', 'despachos', 'escrow'] },
  transportista: { home: 'explorar', allowed: ['explorar', 'despachos', 'escrow'] }
};
import { INITIAL_WAREHOUSES } from '../data/warehouses';
import { INITIAL_INVENTORY } from '../data/inventory';
import { INITIAL_DISPATCH } from '../data/dispatches';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface NexoContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: 'explorar' | 'inventario' | 'despachos' | 'escrow';
  setActiveTab: (tab: 'explorar' | 'inventario' | 'despachos' | 'escrow') => void;
  warehouses: Warehouse[];
  inventory: StoredLot[];
  dispatch: Dispatch;
  bcvRate: number;
  setBcvRate: (rate: number) => void;
  selectedWarehouseForReservation: Warehouse | null;
  setSelectedWarehouseForReservation: (wh: Warehouse | null) => void;
  escrowTransactions: EscrowTransaction[];
  activeReceptionReceipt: StoredLot | null;
  setActiveReceptionReceipt: (lot: StoredLot | null) => void;
  isCloudSynced: boolean;
  
  // Actions
  reserveWarehouse: (params: {
    warehouse: Warehouse;
    pallets: number;
    days: number;
    category: CargoCategory;
    sku: string;
    productName: string;
  }) => void;
  simulateStep2Pickup: () => void;
  simulateStep3Delivery: () => void;
  executeAutomaticReturn: (lotId: string) => void;
  publishWarehouse: (newWh: Omit<Warehouse, 'id'>) => void;
  resetDemoData: () => void;
  createNewDispatchFromLot: (lotId: string, destinationName: string, destinationAddress: string) => void;
  totalEscrowBalance: number;
}

const INITIAL_ESCROW_TXS: EscrowTransaction[] = [
  {
    id: 'tx-001',
    timestamp: '2026-11-20 10:14 AM',
    concept: 'Custodia Almacenaje SKU-8841 (TecnoParts C.A.)',
    referenceCode: 'ESC-VE-99214',
    amountUsd: 145.00,
    amountVes: 145.00 * 36.45,
    type: 'deposito',
    beneficiary: 'Fideicomiso NexoCarga',
    method: 'pago_movil_c2p',
    status: 'retenido'
  },
  {
    id: 'tx-002',
    timestamp: '2026-11-18 03:40 PM',
    concept: 'Garantía Anti-Abandono Lote SKU-9204',
    referenceCode: 'ESC-GA-30198',
    amountUsd: 30.00,
    amountVes: 30.00 * 36.45,
    type: 'deposito',
    beneficiary: 'Fideicomiso NexoCarga',
    method: 'transferencia_ves',
    status: 'retenido'
  },
  {
    id: 'tx-003',
    timestamp: '2026-11-15 11:20 AM',
    concept: 'Despacho #NX-8102 - Liquidación Galpón Castillito',
    referenceCode: 'LIQ-GAL-8102',
    amountUsd: 67.50,
    amountVes: 67.50 * 36.45,
    type: 'liberacion_galpon',
    beneficiary: 'Manuel Mendoza (Logística Castillito)',
    method: 'transferencia_ves',
    status: 'liquidado'
  },
  {
    id: 'tx-004',
    timestamp: '2026-11-15 11:20 AM',
    concept: 'Despacho #NX-8102 - Liquidación Chofer Verificado',
    referenceCode: 'LIQ-TR-8102',
    amountUsd: 76.50,
    amountVes: 76.50 * 36.45,
    type: 'liberacion_flete',
    beneficiary: 'Pedro Alvarado (Trans-Carabobo Express)',
    method: 'pago_movil_c2p',
    status: 'liquidado'
  }
];

const NexoContext = createContext<NexoContextType | undefined>(undefined);

export const NexoProvider: React.FC<{ children: React.ReactNode; initialRole?: UserRole }> = ({ children, initialRole = 'proveedor' }) => {
  const [role, setRoleState] = useState<UserRole>(initialRole);
  const [activeTab, setActiveTab] = useState<TabId>(ROLE_TABS[initialRole].home);

  // Cambiar de perfil lleva al usuario a la vista principal de ese rol
  // si la pestaña actual no aplica para el nuevo perfil (navegación intuitiva).
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setActiveTab(prev => (ROLE_TABS[newRole].allowed.includes(prev) ? prev : ROLE_TABS[newRole].home));
  };
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [inventory, setInventory] = useState<StoredLot[]>(INITIAL_INVENTORY);
  const [dispatch, setDispatch] = useState<Dispatch>(INITIAL_DISPATCH);
  const [bcvRate, setBcvRate] = useState<number>(36.45);
  const [selectedWarehouseForReservation, setSelectedWarehouseForReservation] = useState<Warehouse | null>(INITIAL_WAREHOUSES[0]);
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>(INITIAL_ESCROW_TXS);
  const [activeReceptionReceipt, setActiveReceptionReceipt] = useState<StoredLot | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(isSupabaseConfigured);

  // Load from Supabase on start if available
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.from('almacenes').select('*').then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          console.log('✅ Galpones cargados desde Supabase en la nube:', data.length);
          setIsCloudSynced(true);
        }
      });
    }
  }, []);

  // Total escrow balance calculation
  const totalEscrowBalance = 450.00 + (dispatch.status !== 'entregado' ? dispatch.financials.totalEscrow : 0);

  // Action: Reserve warehouse & emit digital reception receipt
  const reserveWarehouse = ({
    warehouse,
    pallets,
    days,
    category,
    sku,
    productName
  }: {
    warehouse: Warehouse;
    pallets: number;
    days: number;
    category: CargoCategory;
    sku: string;
    productName: string;
  }) => {
    const antiAbandonment = 30.00;
    const totalCost = (pallets * days * warehouse.dailyRatePerPallet) + antiAbandonment;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];

    const newLot: StoredLot = {
      id: `lot-${Date.now()}`,
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      lotCode: `Lote ${category.toUpperCase().slice(0, 4)}-${Math.floor(10 + Math.random() * 90)}`,
      providerName: 'TecnoParts C.A.',
      providerRif: 'J-40819231-1',
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      palletsCount: pallets,
      boxesCount: pallets * 10,
      category,
      depositDate: formattedDate,
      contractedDays: days,
      remainingDays: days,
      dailyRate: warehouse.dailyRatePerPallet,
      antiAbandonmentDeposit: antiAbandonment,
      status: 'almacenado',
      sadaGuide: `SADA-VE-${Math.floor(10000 + Math.random() * 90000)}`,
      photoUrl: warehouse.imageUrl,
      cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    };

    setInventory(prev => [newLot, ...prev]);

    // Async sync with Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('inventario_depositado').insert({
        sku_producto: newLot.sku,
        lote_codigo: newLot.lotCode,
        cantidad_paletas: newLot.palletsCount,
        cantidad_cajas: newLot.boxesCount,
        categoria: newLot.category,
        dias_contratados: newLot.contractedDays,
        dias_restantes: newLot.remainingDays,
        deposito_garantia_usd: newLot.antiAbandonmentDeposit,
        guia_sada: newLot.sadaGuide,
        estado: newLot.status
      }).then(({ error }) => {
        if (!error) console.log('✅ Reserva registrada en Supabase Cloud');
      });
    }

    // Record escrow transaction
    const newTx: EscrowTransaction = {
      id: `tx-${Date.now()}`,
      timestamp: 'Hoy, ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      concept: `Reserva ${pallets} paletas en ${warehouse.name} (${productName || sku})`,
      referenceCode: `ESC-${Math.floor(100000 + Math.random() * 900000)}`,
      amountUsd: totalCost,
      amountVes: totalCost * bcvRate,
      type: 'deposito',
      beneficiary: 'Fideicomiso NexoCarga',
      method: 'pago_movil_c2p',
      status: 'retenido'
    };
    setEscrowTransactions(prev => [newTx, ...prev]);

    // Show reception receipt modal
    setActiveReceptionReceipt(newLot);
  };

  // Action: Step 2 QR Pickup simulation
  const simulateStep2Pickup = () => {
    if (dispatch.status !== 'espera_retiro') return;
    const now = new Date();
    const timeStr = 'Hoy, ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDispatch(prev => ({
      ...prev,
      status: 'en_transito',
      step2CarrierPickup: {
        completed: true,
        timestamp: timeStr,
        pickupQrHash: prev.step2CarrierPickup.pickupQrHash
      }
    }));

    if (isSupabaseConfigured && supabase) {
      supabase.from('despachos')
        .update({ qr_retiro_escaneado: true, fecha_retiro_timestamp: timeStr })
        .eq('numero_despacho', dispatch.dispatchNumber)
        .then(() => console.log('✅ QR Retiro actualizado en Supabase'));
    }
  };

  // Action: Step 3 QR Final Delivery simulation
  const simulateStep3Delivery = () => {
    if (dispatch.status !== 'en_transito') return;
    const now = new Date();
    const timeStr = 'Hoy, ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDispatch(prev => ({
      ...prev,
      status: 'entregado',
      escrowStatus: 'liberado_a_partes',
      step3ClientDelivery: {
        completed: true,
        timestamp: timeStr,
        deliveryQrHash: prev.step3ClientDelivery.deliveryQrHash,
        recipientName: 'Carlos Zambrano (Gerente Operativo El Tornillo C.A.)'
      }
    }));

    if (isSupabaseConfigured && supabase) {
      supabase.from('despachos')
        .update({ qr_entrega_escaneado: true, fecha_entrega_timestamp: timeStr, estado_escrow: 'liberado_a_partes' })
        .eq('numero_despacho', dispatch.dispatchNumber)
        .then(() => console.log('✅ Escrow liberado y actualizado en Supabase'));
    }

    // Trigger celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Add dispersion transactions
    const txGalpon: EscrowTransaction = {
      id: `tx-disp-galpon-${Date.now()}`,
      timestamp: timeStr,
      concept: `Dispersión Almacenaje Despacho ${dispatch.dispatchNumber}`,
      referenceCode: `DISP-G-${Math.floor(10000 + Math.random() * 90000)}`,
      amountUsd: dispatch.financials.warehouseFee,
      amountVes: dispatch.financials.warehouseFee * bcvRate,
      type: 'liberacion_galpon',
      beneficiary: 'Manuel Mendoza (Logística Castillito)',
      method: 'transferencia_ves',
      status: 'liquidado'
    };

    const txCarrier: EscrowTransaction = {
      id: `tx-disp-carrier-${Date.now()}`,
      timestamp: timeStr,
      concept: `Dispersión Flete Despacho ${dispatch.dispatchNumber}`,
      referenceCode: `DISP-T-${Math.floor(10000 + Math.random() * 90000)}`,
      amountUsd: dispatch.financials.carrierFreightFee,
      amountVes: dispatch.financials.carrierFreightFee * bcvRate,
      type: 'liberacion_flete',
      beneficiary: dispatch.assignedCarrier.name,
      method: 'pago_movil_c2p',
      status: 'liquidado'
    };

    const txPlatform: EscrowTransaction = {
      id: `tx-disp-nexo-${Date.now()}`,
      timestamp: timeStr,
      concept: `Comisión NexoCarga (10%) Despacho ${dispatch.dispatchNumber}`,
      referenceCode: `COMM-NX-${Math.floor(10000 + Math.random() * 90000)}`,
      amountUsd: dispatch.financials.platformCommission,
      amountVes: dispatch.financials.platformCommission * bcvRate,
      type: 'comision_nexo',
      beneficiary: 'NexoCarga Operaciones C.A.',
      method: 'transferencia_ves',
      status: 'liquidado'
    };

    setEscrowTransactions(prev => [txPlatform, txCarrier, txGalpon, ...prev]);
  };

  // Action: Execute automatic return under anti-abandonment clause
  const executeAutomaticReturn = (lotId: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === lotId) {
        return {
          ...item,
          status: 'retorno_automatico'
        };
      }
      return item;
    }));
  };

  // Action: Publish new warehouse space
  const publishWarehouse = (newWh: Omit<Warehouse, 'id'>) => {
    const created: Warehouse = {
      ...newWh,
      id: `wh-${Date.now()}`
    };
    setWarehouses(prev => [created, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('almacenes').insert({
        nombre_galpon: created.name,
        ciudad: created.city,
        zona_industrial: created.industrialZone,
        direccion: created.address,
        m2_totales: created.totalM2,
        m2_disponibles: created.availableM2,
        porcentaje_ocioso: created.idlePercentage,
        tarifa_diaria_paleta: created.dailyRatePerPallet,
        categoria_aceptada: created.categoriesAccepted[0],
        imagen_url: created.imageUrl
      }).then(({ error }) => {
        if (!error) console.log('✅ Nuevo galpón publicado en Supabase Cloud');
      });
    }
  };

  // Action: Create dispatch from inventory
  const createNewDispatchFromLot = (lotId: string, destinationName: string, destinationAddress: string) => {
    const lot = inventory.find(i => i.id === lotId);
    if (!lot) return;

    const newDisp: Dispatch = {
      id: `disp-${Date.now()}`,
      dispatchNumber: `#NX-${Math.floor(8000 + Math.random() * 1999)}`,
      inventoryLotId: lot.id,
      originWarehouse: {
        name: lot.warehouseName,
        zone: 'Valencia (Z.I. Castillito)',
        bay: 'Bahía 02',
        address: 'Z.I. Castillito, Valencia, Carabobo'
      },
      destination: {
        name: destinationName || 'Comercializadora Los Álamos C.A.',
        address: destinationAddress || 'Av. Bolívar Norte, Sector San José, Valencia',
        city: 'Valencia, Edo. Carabobo',
        contactPhone: '+58 424-4129031'
      },
      cargoSummary: `${lot.palletsCount} Paletas ${lot.sku}`,
      palletsCount: lot.palletsCount,
      boxesCount: lot.boxesCount,
      weightKg: lot.palletsCount * 450,
      manifestNumber: `#VE-2025-${Math.floor(100 + Math.random() * 900)}`,
      sadaGuide: `Aprobada #${Math.floor(10000 + Math.random() * 90000)}`,
      assignedCarrier: INITIAL_DISPATCH.assignedCarrier,
      status: 'espera_retiro',
      escrowStatus: 'fondos_retenidos',
      financials: {
        warehouseFee: 40.00,
        carrierFreightFee: 75.00,
        platformCommission: 11.50,
        totalEscrow: 126.50,
        antiAbandonmentRefund: lot.antiAbandonmentDeposit
      },
      step1WarehouseCheckIn: {
        completed: true,
        timestamp: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        biometricApproved: true,
        verifiedWeightKg: lot.palletsCount * 450,
        hashSignature: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        imageUrl: lot.photoUrl
      },
      step2CarrierPickup: {
        completed: false,
        pickupQrHash: `8f4a2c2${Math.random().toString(16).substring(2, 20)}d91e`
      },
      step3ClientDelivery: {
        completed: false,
        deliveryQrHash: `f4b18c0${Math.random().toString(16).substring(2, 20)}23bc`
      },
      routeNotes: 'Ruta Directa Carabobo Central | Monitoreo Satelital NexoCarga'
    };

    setDispatch(newDisp);
    setActiveTab('despachos');
  };

  // Reset demo
  const resetDemoData = () => {
    setWarehouses(INITIAL_WAREHOUSES);
    setInventory(INITIAL_INVENTORY);
    setDispatch(INITIAL_DISPATCH);
    setSelectedWarehouseForReservation(INITIAL_WAREHOUSES[0]);
    setEscrowTransactions(INITIAL_ESCROW_TXS);
  };

  return (
    <NexoContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        warehouses,
        inventory,
        dispatch,
        bcvRate,
        setBcvRate,
        selectedWarehouseForReservation,
        setSelectedWarehouseForReservation,
        escrowTransactions,
        activeReceptionReceipt,
        setActiveReceptionReceipt,
        isCloudSynced,
        reserveWarehouse,
        simulateStep2Pickup,
        simulateStep3Delivery,
        executeAutomaticReturn,
        publishWarehouse,
        resetDemoData,
        createNewDispatchFromLot,
        totalEscrowBalance
      }}
    >
      {children}
    </NexoContext.Provider>
  );
};

export const useNexo = () => {
  const context = useContext(NexoContext);
  if (!context) {
    throw new Error('useNexo must be used within a NexoProvider');
  }
  return context;
};
