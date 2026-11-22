export interface KnowledgeAnswer {
  keywords: string[];
  title: string;
  response: string;
  suggestedFollowUps?: string[];
}

export const BOT_KNOWLEDGE_BASE: KnowledgeAnswer[] = [
  {
    keywords: ['escrow', 'custodia', 'dinero', 'pago', 'fondos', 'seguridad financiera'],
    title: 'Mecanismo de Custodia Escrow',
    response: `En NexoCarga, los fondos permanecen blindados en una cuenta de custodia protegida (Escrow) durante toda la operación:\n\n1. **Retención inicial**: El proveedor deposita el costo de almacenaje + flete + depósito de garantía.\n2. **Doble candado criptográfico**: Ni el galpón ni el transportista cobran por adelantado.\n3. **Dispersión automática**: Solo al registrarse el **segundo escaneo QR de entrega conforme** por parte del destinatario final, el smart contract dispersa instantáneamente:\n   • 90% del flete al transportista verificado\n   • 90% del almacenaje devengado al dueño del galpón\n   • 10% de comisión operativa a la plataforma\n   • Reembolso automático del depósito de garantía al proveedor.\n\nTodo con liquidación en dólares o en Bolívares indexados a la tasa oficial BCV del día.`,
    suggestedFollowUps: ['¿Cómo funciona la cláusula anti-abandono?', '¿Qué son los 4 candados de transportistas?']
  },
  {
    keywords: ['abandono', 'clausula', 'mora', '15 dias', '30 dias', 'garantia', 'deuda'],
    title: 'Cláusula Anti-Abandono y Blindaje Patrimonial',
    response: `Para evitar que los galpones se conviertan en "cementerios de chatarra" o mercancía abandonada, el sistema aplica la **Cláusula de Protección Activa**:\n\n• **Depósito de Garantía**: Al ingresar cada lote, el proveedor abona $30-$35 USD en custodia, equivalentes a 1 flete de retorno.\n• **Día 15 de mora (sin prórroga pagada)**: Se activa automáticamente una orden de **Retorno al Origen**, despachando la mercancía de vuelta a la sede del proveedor debitando el depósito de garantía.\n• **Día 30 de mora**: Si el proveedor rehúsa la recepción o es inubicable, el sistema habilita la liquidación acordada avalada por el Código de Comercio de Venezuela para saldar la deuda con el galpón.\n\n¡Cero clavos sueltos para el dueño del galpón!`,
    suggestedFollowUps: ['¿Cómo cobrar en Bolívares o USD?', '¿Cómo publicar un nuevo galpón?']
  },
  {
    keywords: ['candados', 'chofer', 'transportista', 'verificacion', 'seguridad', 'camion', 'robo'],
    title: 'Protocolo de 4 Candados para Transportistas',
    response: `Cada transportista en la red NexoCarga es auditado bajo un estricto protocolo de 4 candados antes de poder aceptar cualquier flete:\n\n1. 🔒 **Candado 1 — Legal & Vehicular**: Verificación de RIF vigente, cédula, licencia de 5to grado profesional, título M-3 del vehículo y RCV de carga al día.\n2. 🔒 **Candado 2 — Biometría Facial & SAIME**: Cotejo biométrico en tiempo real contra base de datos oficial (99.8% similitud) y referencias de distribuidoras locales.\n3. 🔒 **Candado 3 — Custodia Financiera (Escrow)**: El chofer no recibe el pago hasta que el cliente final confirme la recepción por QR.\n4. 🔒 **Candado 4 — Trazabilidad y Reputación**: Monitoreo satelital activo en el corredor vial (ej. ARC / Corredor Carabobo) y rating auditado tras cada viaje.`,
    suggestedFollowUps: ['¿Cómo simular el escaneo QR?', 'Reglas de compatibilidad de carga']
  },
  {
    keywords: ['compatibilidad', 'cruzada', 'contaminacion', 'quimicos', 'alimentos', 'temperatura'],
    title: 'Filtros Estrictos de Compatibilidad de Carga',
    response: `Para resguardar la inocuidad alimentaria y normativas sanitarias venezolanas (SACS/SICA):\n\n• **Carga Seca / Repuestos**: Prohibido compartir nave abierta con alimentos frescos o sustancias volátiles.\n• **Alimentos Empacados**: Requieren certificación sanitaria de galpón y control de roedores/humedad al día.\n• **Refrigerados**: Operan exclusivamente en galpones con telemetría continua de temperatura (2°C a 8°C o congelación) y planta eléctrica de respaldo 150kVA.\n\nEl sistema bloquea matemáticamente cualquier reserva que intente cruzar rubros incompatibles.`,
    suggestedFollowUps: ['¿Cómo calcular el ahorro frente a un alquiler tradicional?']
  },
  {
    keywords: ['ahorro', 'alquiler', 'tradicional', 'costo', 'tarifa', 'm2', 'calculo'],
    title: 'Ahorro NexoCarga vs. Alquiler Tradicional',
    response: `**Comparativa Económica en Venezuela:**\n\n• **Alquiler Tradicional de Galpón**:\n  - Contrato mínimo forzoso: 6 a 12 meses\n  - Costo fijo: $800 a $2,500/mes (ocupes o no el espacio)\n  - Meses de depósito por adelantado (3 a 6 meses de canon)\n  - Gastos propios de vigilancia privada, andenes y montacargas.\n\n• **Modelo NexoCarga (Pay-as-you-go)**:\n  - Paga únicamente por paleta real y días de resguardo (ej. 10 paletas × 5 días = $75.00)\n  - Sin permanencia ni contratos rígidos\n  - Aprovechas vigilancia 24/7 y andenes ya instalados\n  - **Ahorro operativo neto superior al 70%** para PyMEs e importadores.`,
    suggestedFollowUps: ['¿Qué zonas industriales están activas en el demo?']
  },
  {
    keywords: ['bcv', 'tasa', 'bolivares', 'dolares', 'ves', 'pago movil'],
    title: 'Indexación Oficial BCV y Medios de Pago',
    response: `Todas las cotizaciones en NexoCarga están fijadas en USD como moneda de cuenta de referencia y se liquidan conforme a la ley venezolana:\n\n• **Tasa Oficial BCV**: Se indexa automáticamente al valor del Banco Central de Venezuela vigente al momento exacto de la confirmación y liberación.\n• **Medios de Pago Soportados**:\n  - Pago Móvil interbancario C2P para desembolso instantáneo.\n  - Transferencias bancarias nacionales (Banesco, Mercantil, Venezuela).\n  - Cuentas custodia en divisas / Zelle para operaciones corporativas.`,
    suggestedFollowUps: ['¿Cómo funciona el Escrow?', 'Protocolo de 4 Candados']
  }
];

export function queryLocalKnowledgeBase(userPrompt: string): string {
  const cleanPrompt = userPrompt.toLowerCase().trim();
  
  // Specific checks
  for (const item of BOT_KNOWLEDGE_BASE) {
    const matches = item.keywords.some(k => cleanPrompt.includes(k));
    if (matches) {
      return item.response;
    }
  }

  // Fallback response with helpful orientation
  return `Como tu Copiloto Logístico de NexoCarga, puedo asesorarte sobre:\n\n• **Mecanismo de Escrow y doble QR**: Cómo se protegen los fondos hasta la entrega en portón.\n• **Cláusula Anti-Abandono**: Retorno automático a los 15 días con depósito de garantía de $30-$35.\n• **Protocolo de 4 Candados**: Seguridad patrimonial en transportistas verificados.\n• **Reglas sanitarias y de compatibilidad**: Carga seca vs. alimentos vs. refrigerados.\n• **Tarifas y Ahorro**: Desglose Pay-as-you-go indexado a la tasa oficial BCV.`;
}
