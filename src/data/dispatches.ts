import type { Dispatch } from '../types';

export const INITIAL_DISPATCH: Dispatch = {
  id: 'disp-nx-8492',
  dispatchNumber: '#NX-8492',
  inventoryLotId: 'lot-8841',
  originWarehouse: {
    name: 'Almacén Castillito Norte (Bahía 04)',
    zone: 'Valencia (Z.I. Castillito)',
    bay: 'Bahía 04',
    address: 'Av. Este-Oeste 3, Galpón B-12, Z.I. Castillito, Valencia'
  },
  destination: {
    name: 'Ferretería El Tornillo C.A.',
    address: 'Av. Universidad, C.C. Naguanagua Plaza, Local 14, Naguanagua',
    city: 'Naguanagua, Edo. Carabobo',
    contactPhone: '+58 414-4281900'
  },
  cargoSummary: '4 Paletas Repuestos Automotrices',
  palletsCount: 4,
  boxesCount: 48,
  weightKg: 1840,
  manifestNumber: '#VE-2025-089',
  sadaGuide: 'Aprobada #89410',
  assignedCarrier: {
    id: 'usr-carrier-pedro',
    name: 'Pedro Alvarado',
    company: 'Trans-Carabobo Express S.R.L.',
    rif: 'J-40192837-1',
    vehicleModel: 'Camión NPR 4.5 Ton • Blanco Chasis',
    capacity: '4.5 Toneladas',
    licensePlate: 'A82BK1V',
    phone: '+58 412-5558912',
    rating: 5.0,
    completedTrips: 142,
    avatarUrl: '',
    fourLocks: {
      rifAndLicenseGrade5: true,
      facialBiometricsMatch: 99.8,
      cargoInsuranceCoverageUsd: 25000,
      cleanReputation: true
    }
  },
  status: 'espera_retiro',
  escrowStatus: 'fondos_retenidos',
  financials: {
    warehouseFee: 12.00,        // 4 paletas x 6 días x $0.45/día + manipuleo
    carrierFreightFee: 35.00,   // Flete local metropolitano en Valencia (NPR 4.5 Ton)
    platformCommission: 4.70,   // 10% de comisión operativa
    totalEscrow: 51.70,         // Total custodiado creíble y pagable
    antiAbandonmentRefund: 25.00
  },
  step1WarehouseCheckIn: {
    completed: true,
    timestamp: 'Hoy, 09:15 AM',
    biometricApproved: true,
    verifiedWeightKg: 1840,
    hashSignature: '0x9f4a...41bc',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80'
  },
  step2CarrierPickup: {
    completed: false,
    pickupQrHash: '8f4a2c27091e4bca12ef9038ba9812cc9120deba19e481bfd84920199182d91e'
  },
  step3ClientDelivery: {
    completed: false,
    deliveryQrHash: 'f4b18c092a194918e2bc99812aa319087bcdaef189421098efab4910287123bc'
  },
  routeNotes: 'Autopista del Este • Peaje Guacara | RED GALPEX ACTIVA'
};
