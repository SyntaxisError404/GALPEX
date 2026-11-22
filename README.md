# NexoCarga — Red de Almacenamiento Bajo Demanda, Cross-Docking y Transporte Verificado

Proyecto Integral de Ingeniería Logística y Cadena de Suministro B2B.

## 🚀 Propuesta de Valor y Problema Resuelto
De acuerdo con **Conindustria**, más del **45% de la capacidad instalada y galpones** en las zonas industriales de Venezuela (Valencia, San Diego, Los Guayos, Maracay, Caracas) se encuentran ociosos. Paralelamente, miles de proveedores e importadores no pueden expandirse regionalmente debido a las barreras del alquiler tradicional (contratos de 6 a 12 meses forzosos, fianzas elevadas, costos fijos de vigilancia y muelles).

**NexoCarga** conecta galpones con capacidad ociosa fraccional con proveedores comerciales bajo esquema **Pay-as-you-go** (por paleta y por día), asegurando el despacho local en menos de 24 horas mediante transportistas verificados bajo **4 Candados de Seguridad** y pagos retenidos en **Smart Escrow**.

---

## 🔒 Los 4 Candados de Seguridad Patrimonial
1. **Candado 1 — Documentación Legal & Vehicular**: RIF vigente, Licencia de 5to Grado profesional, Título M-3 del vehículo y póliza RCV de carga activa.
2. **Candado 2 — Biometría Facial & SAIME**: Cotejo biométrico en tiempo real (99.8% de similitud) y referencias comerciales comprobadas de distribuidoras de la zona.
3. **Candado 3 — Custodia Financiera (Escrow)**: El transportista cobra el flete únicamente al confirmarse el segundo escaneo QR de entrega conforme en destino final.
4. **Candado 4 — Trazabilidad y Reputación**: Monitoreo satelital activo en el corredor vial (CanBus/GPS) y calificación pública auditada tras cada viaje.

---

## ⚖️ Blindaje Operativo & Legal (Cero Clavos Sueltos)
- **Doble Escaneo QR de Custodia Inmutable**: El QR #1 transfiere legalmente la custodia del galpón al chofer; el QR #2 libera al chofer y transfiere al receptor comercial con firma criptográfica SHA-256.
- **Cláusula Anti-Abandono**: Depósito de garantía de $30-$35 USD en custodia. Al día 15 de mora sin prórroga, se activa automáticamente una orden de retorno al origen. Al día 30, liquidación acordada avalada por el Código de Comercio.
- **Filtros Estrictos Anti-Contaminación Cruzada**: Bloqueo automático entre carga seca/químicos y alimentos empacados o refrigerados (normas SACS/SICA).
- **Indexación Oficial BCV**: Cotizaciones en USD y liquidación automática en Bolívares conforme a la tasa oficial del Banco Central de Venezuela vía Pago Móvil C2P o transferencia bancaria.

---

## 🛠️ Stack Tecnológico
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Canvas-Confetti.
- **Chatbot Copiloto**: Arquitectura híbrida (motor determinístico en TypeScript + integración opcional a Gemini API mediante `VITE_GEMINI_API_KEY`).
- **Base de Datos**: Esquema relacional SQL listo para Supabase (`supabase_schema.sql`).

## 💻 Ejecución del Proyecto
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```
