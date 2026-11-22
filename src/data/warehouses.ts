import type { Warehouse } from '../types';

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-castillito-norte',
    name: 'Galpón Modular Castillito Norte',
    subtitle: 'Castillito TechPark • Sector B',
    city: 'Valencia',
    state: 'Carabobo',
    industrialZone: 'Z.I. Castillito',
    address: 'Av. Este-Oeste 3, Galpón B-12, Z.I. Castillito, Valencia',
    totalM2: 800,
    availableM2: 320,
    idlePercentage: 40,
    dailyRatePerPallet: 0.45, // Tarifa realista: ~$13.50/mes por posición de paleta
    categoriesAccepted: ['carga_seca', 'repuestos_ferreteria'],
    features: ['Cross-docking listo', 'Andén nivelador', 'CCTV HD', 'Montacargas eléctrico'],
    securityBadges: ['Seguridad 24/7 Verificada', 'Póliza Contra Incendio'],
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    verifiedOwner: {
      id: 'usr-manuel-galpon',
      name: 'Manuel Mendoza',
      company: 'Logística Castillito C.A.',
      rif: 'J-31098234-9',
      phone: '+58 414-4328901',
      rating: 4.9
    }
  },
  {
    id: 'wh-big-low-san-diego',
    name: 'Centro Logístico Big Low Park',
    subtitle: 'Acceso Directo ARC • Km 158',
    city: 'San Diego',
    state: 'Carabobo',
    industrialZone: 'San Diego - ARC',
    address: 'Intercomunal San Diego, frente al Terminal Big Low, San Diego',
    totalM2: 1200,
    availableM2: 520,
    idlePercentage: 65,
    dailyRatePerPallet: 0.35, // Tarifa masiva: ~$10.50/mes por posición
    categoriesAccepted: ['carga_seca', 'alimentos_empacados', 'repuestos_ferreteria'],
    features: ['Almacenamiento masivo', '4 Andenes', 'Garita Armada', 'Planta 150kVA'],
    securityBadges: ['Seguridad 24/7 Verificada', 'Vigilancia Privada'],
    imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    verifiedOwner: {
      id: 'usr-carlos-sandiego',
      name: 'Carlos Benítez',
      company: 'Inversiones Big Low Logistic C.A.',
      rif: 'J-40192839-2',
      phone: '+58 412-9847123',
      rating: 4.8
    }
  },
  {
    id: 'wh-ensenada-refrig',
    name: 'Almacenes Frigoríficos La Ensenada',
    subtitle: 'Corredor Marítimo • Vía Puerto Cabello',
    city: 'Puerto Cabello',
    state: 'Carabobo',
    industrialZone: 'Puerto Cabello - Muelle',
    address: 'Carretera Nacional Puerto Cabello - Morón, Km 4',
    totalM2: 600,
    availableM2: 180,
    idlePercentage: 25,
    dailyRatePerPallet: 0.95, // Cadena de frío (2°C a 8°C): ~$28.50/mes por paleta fría
    temperatureControl: 'Frío 4°C (2°C a 8°C)',
    categoriesAccepted: ['refrigerado', 'alimentos_empacados'],
    features: ['Refrigeración activa', 'Certificación SACS', '2°C a 8°C', 'Telemetría IoT', 'Planta eléctrica 150 kVA'],
    securityBadges: ['Seguridad 24/7', 'Frío Continuo Respaldado'],
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    verifiedOwner: {
      id: 'usr-andres-frio',
      name: 'Ing. Elena Rivas',
      company: 'Frigoríficos del Centro C.A.',
      rif: 'J-29837192-0',
      phone: '+58 424-4190822',
      rating: 5.0
    }
  },
  {
    id: 'wh-los-guayos-ind',
    name: 'Depósito Industrial Los Guayos',
    subtitle: 'Parque Industrial El Tigre',
    city: 'Los Guayos',
    state: 'Carabobo',
    industrialZone: 'Los Guayos',
    address: 'Zona Industrial El Tigre, Manzana 4, Los Guayos',
    totalM2: 950,
    availableM2: 410,
    idlePercentage: 55,
    dailyRatePerPallet: 0.38, // Tarifa competitiva: ~$11.40/mes
    categoriesAccepted: ['carga_seca', 'repuestos_ferreteria'],
    features: ['Patios de maniobra amplios', 'Rampa para gandolas', 'Control de plagas al día'],
    securityBadges: ['Seguridad 24/7 Verificada'],
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80',
    verifiedOwner: {
      id: 'usr-losguayos',
      name: 'Roberto Valera',
      company: 'Almacenes El Tigre S.A.',
      rif: 'J-31892837-5',
      phone: '+58 414-4902198',
      rating: 4.7
    }
  },
  {
    id: 'wh-maracay-san-vicente',
    name: 'Hub Logístico San Vicente',
    subtitle: 'Corredor Industrial de Aragua',
    city: 'Maracay',
    state: 'Aragua',
    industrialZone: 'Z.I. San Vicente',
    address: 'Av. Anton Phillips, Z.I. San Vicente I, Maracay',
    totalM2: 1100,
    availableM2: 450,
    idlePercentage: 48,
    dailyRatePerPallet: 0.40, // ~$12.00/mes
    categoriesAccepted: ['carga_seca', 'alimentos_empacados', 'repuestos_ferreteria'],
    features: ['Racks para 350 paletas', '3 Muelles de carga', 'Circuito cerrado digital'],
    securityBadges: ['Seguridad 24/7 Verificada'],
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
    verifiedOwner: {
      id: 'usr-aragua-maracay',
      name: 'Marcos Gil',
      company: 'Logística San Vicente C.A.',
      rif: 'J-40291823-1',
      phone: '+58 412-4401823',
      rating: 4.8
    }
  },
  {
    id: 'wh-caracas-yaguara',
    name: 'MegaDepósito Metropolitano La Yaguara',
    subtitle: 'Eje Oeste Capital • Acceso Autopista',
    city: 'Caracas',
    state: 'Distrito Capital',
    industrialZone: 'La Yaguara',
    address: 'Av. Intercomunal de Antímano con Av. García González, La Yaguara',
    totalM2: 1500,
    availableM2: 480,
    idlePercentage: 35,
    dailyRatePerPallet: 0.55, // Zona capitalina: ~$16.50/mes
    categoriesAccepted: ['carga_seca', 'repuestos_ferreteria', 'alimentos_empacados'],
    features: ['Distribución exprés Caracas', 'Control de acceso biométrico', 'Seguridad perimetral armada'],
    securityBadges: ['Blindaje Patrimonial 24/7'],
    imageUrl: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2c?auto=format&fit=crop&w=800&q=80',
    verifiedOwner: {
      id: 'usr-caracas-yaguara',
      name: 'Alejandro Carrillo',
      company: 'Capital Warehousing Group',
      rif: 'J-30982314-8',
      phone: '+58 414-2391092',
      rating: 4.9
    }
  }
];
