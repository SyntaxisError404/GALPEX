export type UserRole = 'proveedor' | 'dueno_galpon' | 'transportista';

// Cuenta de usuario de la app (demo: se guarda en el navegador vía localStorage).
export interface AppUser {
  id: string;
  name: string;
  company: string;
  email: string;
  password: string;
  role: UserRole;
}

export type CargoCategory = 
  | 'carga_seca' 
  | 'alimentos_empacados' 
  | 'repuestos_ferreteria' 
  | 'refrigerado';

export interface ProviderCargoProfile {
  productType: CargoCategory;
  productName: string;
  hasSadaOrSica: boolean;
  requiresSacs: boolean;
  requiresTemperatureControl: boolean;
  hasChemicalOrOdors: boolean;
  estimatedPallets: number;
  preferredZone: string;
  completedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  subtitle: string;
  city: string;
  state: string;
  industrialZone: string;
  address: string;
  totalM2: number;
  availableM2: number;
  idlePercentage: number;
  dailyRatePerPallet: number;
  categoriesAccepted: CargoCategory[];
  temperatureControl?: string;
  features: string[];
  securityBadges: string[];
  imageUrl: string;
  conditionDescription?: string;
  hasCctvCameraSecurity?: boolean;
  galleryImages?: string[];
  verifiedOwner: {
    id: string;
    name: string;
    company: string;
    rif: string;
    phone: string;
    rating: number;
  };
}

export interface StoredLot {
  id: string;
  sku: string;
  lotCode: string;
  providerName: string;
  providerRif: string;
  warehouseId: string;
  warehouseName: string;
  palletsCount: number;
  boxesCount: number;
  category: CargoCategory;
  depositDate: string;
  contractedDays: number;
  remainingDays: number;
  dailyRate: number;
  antiAbandonmentDeposit: number;
  status: 'almacenado' | 'en_despacho' | 'vence_pronto' | 'mora' | 'retorno_automatico' | 'liquidado';
  sadaGuide: string;
  photoUrl: string;
  cryptographicHash: string;
}

export interface Dispatch {
  id: string;
  dispatchNumber: string; // e.g. #NX-8492
  inventoryLotId: string;
  originWarehouse: {
    name: string;
    zone: string;
    bay: string;
    address: string;
  };
  destination: {
    name: string;
    address: string;
    city: string;
    contactPhone: string;
  };
  cargoSummary: string;
  palletsCount: number;
  boxesCount: number;
  weightKg: number;
  manifestNumber: string;
  sadaGuide: string;
  assignedCarrier: {
    id: string;
    name: string;
    company: string;
    rif: string;
    vehicleModel: string;
    capacity: string;
    licensePlate: string;
    phone: string;
    rating: number;
    completedTrips: number;
    avatarUrl: string;
    fourLocks: {
      rifAndLicenseGrade5: boolean;
      facialBiometricsMatch: number; // 99.8%
      cargoInsuranceCoverageUsd: number; // 25000
      cleanReputation: boolean;
    };
  };
  status: 'espera_retiro' | 'en_transito' | 'entregado';
  escrowStatus: 'fondos_retenidos' | 'liberado_a_partes';
  financials: {
    warehouseFee: number;
    carrierFreightFee: number;
    platformCommission: number; // 10%
    totalEscrow: number;
    antiAbandonmentRefund?: number;
  };
  step1WarehouseCheckIn: {
    completed: boolean;
    timestamp: string;
    biometricApproved: boolean;
    verifiedWeightKg: number;
    hashSignature: string;
    imageUrl: string;
  };
  step2CarrierPickup: {
    completed: boolean;
    timestamp?: string;
    pickupQrHash: string;
  };
  step3ClientDelivery: {
    completed: boolean;
    timestamp?: string;
    deliveryQrHash: string;
    recipientName?: string;
  };
  routeNotes: string;
}

export interface EscrowTransaction {
  id: string;
  timestamp: string;
  concept: string;
  referenceCode: string;
  amountUsd: number;
  amountVes: number;
  type: 'deposito' | 'liberacion_galpon' | 'liberacion_flete' | 'comision_nexo' | 'retorno_garantia';
  beneficiary: string;
  method: 'pago_movil_c2p' | 'transferencia_ves' | 'zelle_usd';
  status: 'retenido' | 'liquidado';
}
