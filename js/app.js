/* =================================================================
   SAADS v2 - PANEL ADMINISTRATIVO DE PRÁCTICAS PROFESIONALES (UPDS)
   Flujo Académico: Postulación -> Docente -> Galileo -> Seguimiento -> Acreditación
   Módulos Externos al Flujo: Convocatorias & Cupos | Parámetros de Cobro
   Totalmente Adaptativo: Desktop (>=768px) y Mobile (<768px)
   ================================================================= */

// Router y Estado Global
let currentPageView = 'home';
let currentWorkspaceTab = 'tab-postulaciones';

// Parámetros de Cobro Galileo (Editables desde la interfaz "Parámetros de Cobro")
let galileoConfig = {
  servicio: 'CUOTA',
  articulo: 'ACAD02',
  descripcion: 'CUOTA',
  precio: '640,00',
  cebe: '60010101',
  npago: '1',
  diasValidez: 30,
  observacionSufijo: '2026/2/3'
};

// Lista de Docentes Tutores de la Carrera
const DOCENTES_TUTORES = [
  { id: 'DOC-1', nombre: 'Ing. Fernando Ribera Morón', cargo: 'Docente Titular de Sistemas', email: 'fernando.ribera@upds.net.bo' },
  { id: 'DOC-2', nombre: 'Ing. Carlos Medina Zambrana', cargo: 'Coordinador de Proyectos TI', email: 'carlos.medina@upds.net.bo' },
  { id: 'DOC-3', nombre: 'Lic. Claudia Justiniano Pinto', cargo: 'Docente de Ingeniería de Software', email: 'claudia.justiniano@upds.net.bo' },
  { id: 'DOC-4', nombre: 'Ing. Marco Antonio Leaños', cargo: 'Especialista en Redes y Seguridad', email: 'marco.leanos@upds.net.bo' },
  { id: 'DOC-5', nombre: 'Ing. Roberto Gómez Landívar', cargo: 'Docente de Arquitectura de Software', email: 'roberto.gomez@upds.net.bo' }
];

// Directorio de Convocatorias Institucionales Vigentes (Convenios UPDS)
let convocatoriasList = [
  {
    id: 'CONV-1',
    institucion: 'Banco Unión S.A.',
    division: 'División de Innovación y Banca Digital',
    rubro: 'Banca y Finanzas',
    nit: '1020304050',
    repLegal: 'Lic. Fernando Gómez',
    contacto: 'pasantias.ti@bancounion.com.bo',
    telefono: '+591 3 3381000',
    descripcion: 'Desarrollo de microservicios, APIs bancarias seguras y mantenimiento de bases de datos relacionales.',
    plazasTotales: 5,
    plazasOcupadas: 3,
    semestreReq: '8vo Semestre en adelante',
    vigencia: 'Diciembre 2027',
    horario: 'Turno Mañana (08:00 - 12:00)'
  },
  {
    id: 'CONV-2',
    institucion: 'TechLabs Soluciones Digitales S.R.L.',
    division: 'Área de Ingeniería y Desarrollo Web',
    rubro: 'Tecnología e Información',
    nit: '3456789012',
    repLegal: 'Ing. Marcelo Justiniano',
    contacto: 'talento@techlabs.bo',
    telefono: '+591 78901234',
    descripcion: 'Construcción de interfaces modernas en React, Vue.js y consumo de servicios Cloud en AWS/Azure.',
    plazasTotales: 6,
    plazasOcupadas: 4,
    semestreReq: '8vo Semestre en adelante',
    vigencia: 'Noviembre 2026',
    horario: 'Turno Tarde (14:00 - 18:00)'
  },
  {
    id: 'CONV-3',
    institucion: 'Cervecería Boliviana Nacional (CBN)',
    division: 'Departamento de Automatización y Sistemas Industriales',
    rubro: 'Industrial y Manufactura',
    nit: '1015243029',
    repLegal: 'Ing. Patricia Villarroel',
    contacto: 'pasantias.cbn@ab-inbev.com',
    telefono: '+591 3 3462000',
    descripcion: 'Control de procesos mediante SCADA, soporte de infraestructura de redes OT y desarrollo de reportes analíticos.',
    plazasTotales: 4,
    plazasOcupadas: 2,
    semestreReq: '9no Semestre',
    vigencia: 'Octubre 2026',
    horario: 'Turno Mañana (08:00 - 12:30)'
  },
  {
    id: 'CONV-4',
    institucion: 'Telecel S.A. (Tigo Bolivia)',
    division: 'Centro de Operaciones de Red (NOC)',
    rubro: 'Tecnología e Información',
    nit: '1028475930',
    repLegal: 'Ing. David Salinas',
    contacto: 'rrhh.talentoti@tigo.net.bo',
    telefono: '+591 3 3156000',
    descripcion: 'Monitoreo de disponibilidad de telecomunicaciones, automatización de scripts en Python y gestión de incidentes.',
    plazasTotales: 4,
    plazasOcupadas: 3,
    semestreReq: '8vo Semestre en adelante',
    vigencia: 'Septiembre 2027',
    horario: 'Turno Tarde (14:00 - 18:00)'
  },
  {
    id: 'CONV-5',
    institucion: 'Farmacorp S.A.',
    division: 'Unidad de Transformación Digital y E-Commerce',
    rubro: 'Comercio y Retail',
    nit: '1029384751',
    repLegal: 'Lic. Rodrigo Terrazas',
    contacto: 'postulaciones@farmacorp.com',
    telefono: '+591 3 3450000',
    descripcion: 'Soporte y optimización de plataformas de comercio electrónico, integración de medios de pago y logística digital.',
    plazasTotales: 3,
    plazasOcupadas: 1,
    semestreReq: '8vo Semestre',
    vigencia: 'Agosto 2026',
    horario: 'Turno Mañana (08:30 - 12:30)'
  }
];

// Base de Datos Mock de Estudiantes y Expedientes
let studentApplications = [
  {
    id: 'SOL-8092',
    studentName: 'Carlos Daniel Cuellar',
    ru: '104077',
    email: 'sc.carlos.cuellar.g@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '8vo Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'Banco Unión S.A. - División de Innovación',
    nit: '1020304050',
    rubro: 'Banca y Finanzas',
    type: 'CONVOCATORIA_CONVENIO',
    date: '14/09/2026',
    statusKey: 'EN_REVISION',
    docStatus: 'Formulario_Apertura_Firmado.pdf',
    horas: 360,
    horasRealizadas: 0,
    horario: 'Turno Mañana (08:00 - 12:00)',
    repLegal: 'Lic. Fernando Gómez',
    repEmail: 'fgomez@bancounion.com.bo',
    cargo: 'Desarrollador Junior / Integraciones',
    tutorDocente: 'Ing. Fernando Ribera Morón',
    fechaInicio: '01/10/2026',
    fechaFinEstimada: '15/12/2026',
    observacionMotivo: null,
    evaluaciones: null,
    notaFinal: null,
    actaNro: null,
    informeFinalDoc: null
  },
  {
    id: 'SOL-8095',
    studentName: 'María René Justiniano',
    ru: '105230',
    email: 'sc.maria.justiniano@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '8vo Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'TechLabs Soluciones Digitales S.R.L.',
    nit: '3456789012',
    rubro: 'Tecnología e Información',
    type: 'CONVOCATORIA_CONVENIO',
    date: '15/09/2026',
    statusKey: 'EN_REVISION',
    docStatus: 'Formulario_Apertura_Firmado.pdf',
    horas: 360,
    horasRealizadas: 0,
    horario: 'Turno Tarde (14:00 - 18:00)',
    repLegal: 'Ing. Marcelo Justiniano',
    repEmail: 'talento@techlabs.bo',
    cargo: 'Auxiliar Frontend React',
    tutorDocente: 'Ing. Carlos Medina Zambrana',
    fechaInicio: '01/10/2026',
    fechaFinEstimada: '15/12/2026',
    observacionMotivo: null,
    evaluaciones: null,
    notaFinal: null,
    actaNro: null,
    informeFinalDoc: null
  },
  {
    id: 'SOL-8089',
    studentName: 'Luis Fernando Morales',
    ru: '104889',
    email: 'sc.luis.morales@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '8vo Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'Agencia Digital Creativa Pixel S.R.L.',
    nit: '4567890123',
    rubro: 'Servicios de Software',
    type: 'EMPRESA_SUGERIDA',
    date: '12/09/2026',
    statusKey: 'OBSERVADA',
    docStatus: 'Formulario_Apertura_Observado.pdf',
    horas: 360,
    horasRealizadas: 0,
    horario: 'Turno Tarde (14:00 - 18:00)',
    repLegal: 'Lic. Kevin Montero',
    repEmail: 'kmontero@pixel.bo',
    cargo: 'Pasante de Maquetación Web',
    tutorDocente: 'Lic. Claudia Justiniano Pinto',
    fechaInicio: '05/10/2026',
    fechaFinEstimada: '20/12/2026',
    observacionMotivo: 'Falta sello oficial de la empresa receptora y el NIT no cuenta con actividad económica informática.',
    evaluaciones: null,
    notaFinal: null,
    actaNro: null,
    informeFinalDoc: null
  },
  {
    id: 'SOL-8091',
    studentName: 'Andrea Paola Salvatierra',
    ru: '106112',
    email: 'sc.andrea.salvatierra@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '8vo Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'Crecer IFD - Sucursal Central',
    nit: '1029485760',
    rubro: 'Banca y Finanzas',
    type: 'EMPRESA_SUGERIDA',
    date: '13/09/2026',
    statusKey: 'EN_REVISION',
    docStatus: 'Formulario_Apertura_Firmado.pdf',
    horas: 360,
    horasRealizadas: 0,
    horario: 'Turno Mañana (08:30 - 12:30)',
    repLegal: 'Lic. Claudia Menacho',
    repEmail: 'cmenacho@crecer.org.bo',
    cargo: 'Asistente de Soporte y Redes',
    tutorDocente: 'Ing. Fernando Ribera Morón',
    fechaInicio: '01/10/2026',
    fechaFinEstimada: '15/12/2026',
    observacionMotivo: null,
    evaluaciones: null,
    notaFinal: null,
    actaNro: null,
    informeFinalDoc: null
  },
  {
    id: 'SOL-8088',
    studentName: 'Alejandro Vaca Diez',
    ru: '103112',
    email: 'sc.alejandro.vaca@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '9no Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'Cervecería Boliviana Nacional (CBN)',
    nit: '1015243029',
    rubro: 'Industrial y Manufactura',
    type: 'CONVOCATORIA_CONVENIO',
    date: '10/09/2026',
    statusKey: 'EN_CURSO',
    docStatus: 'Ficha_Seguimiento_Mes1.pdf',
    horas: 360,
    horasRealizadas: 80,
    horario: 'Turno Mañana (08:00 - 12:30)',
    repLegal: 'Ing. Patricia Villarroel',
    repEmail: 'pasantias.cbn@ab-inbev.com',
    cargo: 'Pasante de Sistemas Industriales',
    tutorDocente: 'Ing. Fernando Ribera Morón',
    fechaInicio: '20/09/2026',
    fechaFinEstimada: '05/12/2026',
    observacionMotivo: null,
    evaluaciones: null,
    notaFinal: null,
    actaNro: null,
    informeFinalDoc: null
  },
  {
    id: 'SOL-8071',
    studentName: 'Sofia Loren Soria',
    ru: '102890',
    email: 'sc.sofia.soria@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '8vo Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'Telecel S.A. (Tigo Bolivia)',
    nit: '1028475930',
    rubro: 'Tecnología e Información',
    type: 'CONVOCATORIA_CONVENIO',
    date: '01/09/2026',
    statusKey: 'EN_CURSO',
    docStatus: 'Ficha_Seguimiento_Mes2.pdf',
    horas: 360,
    horasRealizadas: 240,
    horario: 'Turno Tarde (14:00 - 18:00)',
    repLegal: 'Ing. David Salinas',
    repEmail: 'rrhh.talentoti@tigo.net.bo',
    cargo: 'Auxiliar de Automatización NOC',
    tutorDocente: 'Ing. Carlos Medina Zambrana',
    fechaInicio: '05/08/2026',
    fechaFinEstimada: '30/10/2026',
    observacionMotivo: null,
    evaluaciones: null,
    notaFinal: null,
    actaNro: null,
    informeFinalDoc: null
  },
  {
    id: 'SOL-8065',
    studentName: 'Roberto Carlos Menacho',
    ru: '103445',
    email: 'sc.roberto.menacho@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '9no Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'Ingenio Azucarero Guabirá S.A.',
    nit: '1018273645',
    rubro: 'Industrial y Agropecuaria',
    type: 'EMPRESA_SUGERIDA',
    date: '25/08/2026',
    statusKey: 'EN_CURSO',
    docStatus: 'Ficha_Seguimiento_Mes1.pdf',
    horas: 360,
    horasRealizadas: 120,
    horario: 'Turno Mañana (08:00 - 12:00)',
    repLegal: 'Ing. Mario Aguilera',
    repEmail: 'maguilera@guabira.com.bo',
    cargo: 'Soporte Técnico e Infraestructura',
    tutorDocente: 'Ing. Fernando Ribera Morón',
    fechaInicio: '15/08/2026',
    fechaFinEstimada: '10/11/2026',
    observacionMotivo: null,
    evaluaciones: null,
    notaFinal: null,
    actaNro: null,
    informeFinalDoc: null
  },
  {
    id: 'SOL-8040',
    studentName: 'Mateo Fernando Aguilera',
    ru: '101550',
    email: 'sc.mateo.aguilera@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '9no Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'Sofía S.A. - Planta de Procesamiento',
    nit: '1020495837',
    rubro: 'Industrial y Manufactura',
    type: 'EMPRESA_SUGERIDA',
    date: '15/08/2026',
    statusKey: 'CONCLUIDA',
    docStatus: 'Informe_Final_360h_Firmado.pdf',
    horas: 360,
    horasRealizadas: 360,
    horario: 'Turno Mañana (08:00 - 12:00)',
    repLegal: 'Ing. Ernesto Barba',
    repEmail: 'ebarba@sofia.com.bo',
    cargo: 'Desarrollador de Módulos Logísticos',
    tutorDocente: 'Lic. Claudia Justiniano Pinto',
    fechaInicio: '10/06/2026',
    fechaFinEstimada: '01/09/2026',
    observacionMotivo: null,
    evaluaciones: null,
    notaFinal: null,
    actaNro: null,
    informeFinalDoc: 'Informe_Final_360h_Firmado.pdf'
  },
  {
    id: 'SOL-8022',
    studentName: 'Valeria Paz Hurtado',
    ru: '100980',
    email: 'sc.valeria.paz@upds.net.bo',
    career: 'Ingeniería de Sistemas',
    semestre: '9no Semestre',
    sede: 'Sede Santa Cruz',
    institution: 'Finansol S.A. - Servicios Financieros',
    nit: '1092837465',
    rubro: 'Banca y Finanzas',
    type: 'CONVOCATORIA_CONVENIO',
    date: '01/07/2026',
    statusKey: 'ACREDITADA',
    docStatus: 'Acta_Acreditacion_Firmada.pdf',
    horas: 360,
    horasRealizadas: 360,
    horario: 'Turno Tarde (14:00 - 18:00)',
    repLegal: 'Lic. Silvia Justiniano',
    repEmail: 'sjustiniano@finansol.bo',
    cargo: 'Analista de Sistemas Financieros',
    tutorDocente: 'Ing. Marco Antonio Leaños',
    fechaInicio: '15/05/2026',
    fechaFinEstimada: '10/08/2026',
    observacionMotivo: null,
    evaluaciones: {
      desempeno: 30,
      informe: 38,
      defensa: 30,
      observaciones: 'Destacada labor en la modernización de reportes contables. Cumplió con creces los objetivos fijados.'
    },
    notaFinal: 98,
    actaNro: 'PPR-ACTA-2026-0038',
    informeFinalDoc: 'Informe_Final_360h_Firmado.pdf'
  }
];

let selectedStudentForModal = null;
let selectedConvocatoriaForModal = null;

/* =================================================================
   RUTEO Y NAVEGACIÓN (SAADS v2)
   ================================================================= */
function navigateTo(viewName, targetTab = 'tab-postulaciones') {
  currentPageView = viewName;

  document.getElementById('view-home')?.classList.add('hidden');
  document.getElementById('view-module-ppr')?.classList.add('hidden');
  document.getElementById('view-workspace')?.classList.add('hidden');
  document.getElementById('view-convocatorias')?.classList.add('hidden');
  document.getElementById('view-parametros')?.classList.add('hidden');

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.remove('hidden');

  const titleEl = document.getElementById('navbar-page-title');
  if (titleEl) {
    if (viewName === 'home') titleEl.innerText = 'Inicio';
    else titleEl.innerText = 'Prácticas Profesionales';
  }

  if (viewName === 'workspace') {
    if (targetTab === 'tab-convocatorias') {
      navigateTo('convocatorias');
      return;
    }
    if (targetTab === 'tab-parametros') {
      navigateTo('parametros');
      return;
    }
    switchWorkspaceTab(targetTab);
  } else if (viewName === 'convocatorias') {
    renderConvocatorias();
  } else if (viewName === 'parametros') {
    renderParametrosCobro();
  }

  lucide.createIcons();
}

function switchWorkspaceTab(tabId) {
  if (tabId === 'tab-convocatorias') {
    navigateTo('convocatorias');
    return;
  }
  if (tabId === 'tab-parametros') {
    navigateTo('parametros');
    return;
  }

  currentWorkspaceTab = tabId;

  document.querySelectorAll('#view-workspace .workspace-tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('#view-workspace .workspace-tab-btn').forEach(btn => {
    btn.classList.remove('border-[#003876]', 'text-[#003876]', 'font-bold');
    btn.classList.add('border-transparent', 'text-slate-500', 'font-medium');
  });

  const activeContent = document.getElementById(tabId);
  if (activeContent) activeContent.classList.remove('hidden');

  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('border-transparent', 'text-slate-500', 'font-medium');
    activeBtn.classList.add('border-[#003876]', 'text-[#003876]', 'font-bold');
  }

  updateMetrics();

  if (tabId === 'tab-postulaciones') renderApplications();
  else if (tabId === 'tab-seguimiento') renderSeguimiento();
  else if (tabId === 'tab-acreditaciones') renderAcreditaciones();

  lucide.createIcons();
}

function updateMetrics() {
  const pendientes = studentApplications.filter(a => a.statusKey === 'EN_REVISION' || a.statusKey === 'OBSERVADA').length;
  const enCurso = studentApplications.filter(a => a.statusKey === 'EN_CURSO').length;
  const acreditadas = studentApplications.filter(a => a.statusKey === 'ACREDITADA').length;

  // Desktop Elements
  const mPend = document.getElementById('metric-pendientes');
  const mCur = document.getElementById('metric-encurso');
  const mAcr = document.getElementById('metric-acreditadas');

  if (mPend) mPend.innerText = pendientes;
  if (mCur) mCur.innerText = enCurso;
  if (mAcr) mAcr.innerText = acreditadas;

  // Mobile Elements (Bloque exclusivo para pantallas pequeñas)
  const mPendMob = document.getElementById('metric-pendientes-mobile');
  const mCurMob = document.getElementById('metric-encurso-mobile');
  const mAcrMob = document.getElementById('metric-acreditadas-mobile');

  if (mPendMob) mPendMob.innerText = pendientes;
  if (mCurMob) mCurMob.innerText = enCurso;
  if (mAcrMob) mAcrMob.innerText = acreditadas;
}

function syncMobileSearch(val) {
  const desktopInput = document.getElementById('input-search-admin');
  if (desktopInput) desktopInput.value = val;
  renderApplications();
}

/* =================================================================
   TAB 1: REVISIÓN DE POSTULACIONES (PASO 1 DEL FLUJO)
   (Renderiza tanto la tabla Desktop como las tarjetas Mobile)
   ================================================================= */
function renderApplications() {
  const tbody = document.getElementById('table-applications-body');
  const mobileContainer = document.getElementById('container-applications-mobile');

  const statusFilter = document.getElementById('select-status-filter')?.value || 'ALL';
  const typeFilter = document.getElementById('select-type-filter')?.value || 'ALL';
  const searchInput = (document.getElementById('input-search-admin')?.value || document.getElementById('input-search-admin-mobile')?.value || '').toLowerCase().trim();

  const filtered = studentApplications.filter(app => {
    const matchStatus = (statusFilter === 'ALL') || (app.statusKey === statusFilter);
    const matchType = (typeFilter === 'ALL') || (app.type === typeFilter);
    const matchSearch = !searchInput || 
      app.studentName.toLowerCase().includes(searchInput) ||
      app.ru.toLowerCase().includes(searchInput) ||
      app.institution.toLowerCase().includes(searchInput) ||
      app.career.toLowerCase().includes(searchInput);
    return matchStatus && matchType && matchSearch;
  });

  // 1. Render para Desktop (Tabla Tradicional)
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-xs text-slate-400">No se encontraron solicitudes con los filtros aplicados.</td></tr>`;
    } else {
      tbody.innerHTML = filtered.map(app => {
        let statusBadge = getStatusBadge(app);
        const typeBadge = app.type === 'CONVOCATORIA_CONVENIO' 
          ? `<span class="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">Convenio UPDS</span>` 
          : `<span class="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Propuesta Estudiante</span>`;

        return `
          <tr class="hover:bg-slate-50/80 transition text-xs border-b border-slate-100">
            <td class="py-3 px-4">
              <div class="font-bold text-slate-900">${app.studentName}</div>
              <div class="text-[11px] text-slate-400">RU: <strong>${app.ru}</strong> • ${app.career}</div>
            </td>
            <td class="py-3 px-4">
              <div class="font-semibold text-slate-800 truncate max-w-[220px]">${app.institution}</div>
              <div class="mt-0.5">${typeBadge}</div>
            </td>
            <td class="py-3 px-4 text-slate-500 font-medium">
              ${app.date}
            </td>
            <td class="py-3 px-4">
              ${statusBadge}
            </td>
            <td class="py-3 px-4">
              <button onclick="showToast('Abriendo ${app.docStatus}', 'info')" class="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#003876] font-medium text-[11px] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition">
                <i data-lucide="file-text" class="w-3.5 h-3.5 text-[#003876]"></i>
                <span class="truncate max-w-[130px]">${app.docStatus}</span>
              </button>
            </td>
            <td class="py-3 px-4 text-right">
              <button onclick="openExpedienteModal('${app.id}')" class="px-3.5 py-1.5 bg-[#003876] hover:bg-[#002855] text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1 shadow-xs">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                <span>Gestionar</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // 2. Render para Mobile (Tarjetas Adaptativas)
  if (mobileContainer) {
    if (filtered.length === 0) {
      mobileContainer.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">No se encontraron solicitudes.</div>`;
    } else {
      mobileContainer.innerHTML = filtered.map(app => {
        let statusBadge = getStatusBadge(app);
        const typeBadge = app.type === 'CONVOCATORIA_CONVENIO' 
          ? `<span class="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">Convenio</span>` 
          : `<span class="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Propuesta</span>`;

        return `
          <div class="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h5 class="font-bold text-slate-900 text-sm truncate">${app.studentName}</h5>
                <p class="text-[11px] text-slate-400">RU: <strong>${app.ru}</strong> • ${app.career}</p>
              </div>
              <div class="shrink-0">${statusBadge}</div>
            </div>

            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
              <div class="font-semibold text-slate-800 truncate">${app.institution}</div>
              <div class="flex items-center justify-between text-[10px] text-slate-500">
                <span>${typeBadge}</span>
                <span>Postulado: ${app.date}</span>
              </div>
            </div>

            <div class="pt-1 flex items-center justify-between gap-2">
              <button onclick="showToast('Abriendo ${app.docStatus}', 'info')" class="flex-1 inline-flex items-center justify-center gap-1.5 text-slate-600 hover:text-[#003876] font-medium text-[11px] bg-slate-100 hover:bg-slate-200 py-1.5 px-2 rounded-xl transition truncate">
                <i data-lucide="file-text" class="w-3.5 h-3.5 text-[#003876] shrink-0"></i>
                <span class="truncate">${app.docStatus}</span>
              </button>
              <button onclick="openExpedienteModal('${app.id}')" class="px-4 py-1.5 bg-[#003876] hover:bg-[#002855] text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1 shadow-xs shrink-0">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                <span>Gestionar</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  lucide.createIcons();
}

function getStatusBadge(app) {
  if (app.statusKey === 'EN_REVISION') {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>En Revisión</span>`;
  } else if (app.statusKey === 'OBSERVADA') {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>Observada</span>`;
  } else if (app.statusKey === 'EN_CURSO') {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#003876] border border-blue-200"><span class="w-1.5 h-1.5 rounded-full bg-[#003876]"></span>En Curso (${app.horasRealizadas}h)</span>`;
  } else if (app.statusKey === 'CONCLUIDA') {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Informe Final</span>`;
  } else if (app.statusKey === 'ACREDITADA') {
    return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Acreditada (${app.notaFinal}/100)</span>`;
  }
  return '';
}

function openExpedienteModal(studentId) {
  selectedStudentForModal = studentApplications.find(a => a.id === studentId);
  if (!selectedStudentForModal) return;

  const app = selectedStudentForModal;
  document.getElementById('modal-student-name').innerText = app.studentName;
  document.getElementById('modal-student-ru').innerText = app.ru;
  document.getElementById('modal-student-career').innerText = app.career;
  document.getElementById('modal-student-semestre').innerText = app.semestre;
  document.getElementById('modal-institution').innerText = app.institution;
  document.getElementById('modal-horario').innerText = `${app.horario} • 360 Horas Académicas`;
  document.getElementById('modal-empresa-nit').innerText = app.nit;
  document.getElementById('modal-empresa-cargo').innerText = app.cargo;
  document.getElementById('modal-empresa-rep').innerText = app.repLegal;
  document.getElementById('modal-doc-name').innerText = app.docStatus;

  // Llenar Autocomplete Select de Docentes
  const selectDocente = document.getElementById('modal-select-docente');
  if (selectDocente) {
    selectDocente.innerHTML = `
      <option value="" disabled selected>-- Selecciona un Docente Tutor de la Carrera --</option>
      ${DOCENTES_TUTORES.map(d => `
        <option value="${d.nombre}" ${app.tutorDocente === d.nombre ? 'selected' : ''}>
          ${d.nombre} (${d.cargo})
        </option>
      `).join('')}
    `;
  }

  // Observación previa
  const obsDisplay = document.getElementById('modal-obs-display');
  const obsText = document.getElementById('modal-obs-text');
  if (app.observacionMotivo) {
    obsDisplay.classList.remove('hidden');
    obsText.innerText = app.observacionMotivo;
  } else {
    obsDisplay.classList.add('hidden');
  }

  const modal = document.getElementById('modal-expediente');
  if (modal) modal.classList.remove('hidden');

  lucide.createIcons();
}

function closeExpedienteModal() {
  const modal = document.getElementById('modal-expediente');
  if (modal) modal.classList.add('hidden');
}

// AL APROBAR: Valida docente tutor y abre MODAL GALILEO DEMOSTRATIVO
function aprobarPostulacionConGalileo() {
  if (!selectedStudentForModal) return;

  const selectDocente = document.getElementById('modal-select-docente');
  const docenteAsignado = selectDocente ? selectDocente.value : '';

  if (!docenteAsignado) {
    showToast('Debes seleccionar un Docente Tutor asignado para continuar con la aprobación.', 'warning');
    return;
  }

  selectedStudentForModal.tutorDocente = docenteAsignado;
  closeExpedienteModal();

  // Abrir Modal Demostrativo Galileo con los datos del estudiante
  openGalileoModal(selectedStudentForModal);
}

/* =================================================================
   MODAL GALILEO DEMOSTRATIVO (BLOQUEADO)
   ================================================================= */
function openGalileoModal(student) {
  const modal = document.getElementById('modal-galileo');
  if (!modal) return;

  // Cargar datos dinámicos del estudiante y la configuración de aranceles
  document.getElementById('galileo-persona').value = student.studentName;
  document.getElementById('galileo-carrera').value = `${student.career} (PPR-360)`;
  document.getElementById('galileo-observacion').value = `${student.career}: ${galileoConfig.observacionSufijo}`;
  
  // Fecha validez calculada
  const validez = new Date();
  validez.setDate(validez.getDate() + (galileoConfig.diasValidez || 30));
  document.getElementById('galileo-fecha-validez').value = validez.toLocaleDateString('es-BO');

  // Parámetros de cobro desde galileoConfig
  document.getElementById('galileo-servicio').value = galileoConfig.servicio;
  document.getElementById('galileo-articulo').value = galileoConfig.articulo;
  document.getElementById('galileo-descripcion').value = galileoConfig.descripcion;
  document.getElementById('galileo-precio').value = galileoConfig.precio;
  document.getElementById('galileo-cebe').value = galileoConfig.cebe;
  document.getElementById('galileo-npago').value = galileoConfig.npago;

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeGalileoModal() {
  const modal = document.getElementById('modal-galileo');
  if (modal) modal.classList.add('hidden');
}

// AL DAR ACEPTAR EN EL MODAL GALILEO:
// La postulación entra en curso y se muestra en "2. Seguimiento en Curso"
function confirmarAprobacionGalileo() {
  if (!selectedStudentForModal) return;

  selectedStudentForModal.statusKey = 'EN_CURSO';
  selectedStudentForModal.fechaInicio = new Date().toLocaleDateString('es-BO');
  
  closeGalileoModal();
  showToast(`¡Postulación de ${selectedStudentForModal.studentName} aprobada con éxito! La práctica ha iniciado formalmente y se encuentra en Paso 2: Seguimiento en Curso.`, 'success');
  
  updateMetrics();
  renderApplications();

  // Redirigir de inmediato al Paso 2: Seguimiento en Curso
  setTimeout(() => {
    switchWorkspaceTab('tab-seguimiento');
  }, 500);
}

/* =================================================================
   OBSERVACIÓN DE SOLICITUD
   ================================================================= */
function openObservarModal() {
  if (!selectedStudentForModal) return;

  document.getElementById('obs-student-name').innerText = selectedStudentForModal.studentName;
  document.getElementById('obs-motivo-input').value = selectedStudentForModal.observacionMotivo || '';

  const modal = document.getElementById('modal-observar');
  if (modal) modal.classList.remove('hidden');

  lucide.createIcons();
}

function closeObservarModal() {
  const modal = document.getElementById('modal-observar');
  if (modal) modal.classList.add('hidden');
}

function submitObservacion() {
  if (!selectedStudentForModal) return;

  const motivo = document.getElementById('obs-motivo-input').value.trim();
  if (!motivo) {
    showToast('Por favor describe la razón u observación académica.', 'warning');
    return;
  }

  selectedStudentForModal.statusKey = 'OBSERVADA';
  selectedStudentForModal.observacionMotivo = motivo;

  closeObservarModal();
  closeExpedienteModal();
  showToast(`Postulación de ${selectedStudentForModal.studentName} observada. El estudiante recibirá la notificación en su portal.`, 'info');
  updateMetrics();
  renderApplications();
}

/* =================================================================
   TAB 2: SEGUIMIENTO EN CURSO 360h (PASO 2 DEL FLUJO)
   ================================================================= */
function renderSeguimiento() {
  const container = document.getElementById('container-seguimiento-cards');
  if (!container) return;

  const searchInput = document.getElementById('input-search-seguimiento');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const list = studentApplications.filter(a => a.statusKey === 'EN_CURSO');
  const filtered = list.filter(app => 
    !searchTerm ||
    app.studentName.toLowerCase().includes(searchTerm) ||
    app.ru.toLowerCase().includes(searchTerm) ||
    app.institution.toLowerCase().includes(searchTerm) ||
    (app.tutorDocente && app.tutorDocente.toLowerCase().includes(searchTerm))
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400 text-xs">
        <i class="bi bi-clock-history text-3xl mb-2 block text-slate-300"></i>
        No hay estudiantes con práctica activa en este momento o no coinciden con la búsqueda.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(app => {
    const pct = Math.round((app.horasRealizadas / app.horas) * 100);

    return `
      <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="min-w-0">
              <h4 class="font-bold text-slate-900 text-sm truncate">${app.studentName}</h4>
              <p class="text-[11px] text-slate-400">RU: <strong>${app.ru}</strong> • ${app.career}</p>
            </div>
            <span class="text-xs font-black text-[#003876] bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100 shrink-0">
              ${app.horasRealizadas} / ${app.horas} hrs
            </span>
          </div>

          <!-- Barra de Progreso de Horas -->
          <div class="space-y-1">
            <div class="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Avance de Práctica</span>
              <span>${pct}% (Meta: 360h)</span>
            </div>
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-[#003876] h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
            </div>
          </div>

          <!-- Datos de la Empresa y Tutor Docente -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Institución</span>
              <span class="font-bold text-slate-900 truncate block">${app.institution}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Tutor Empresarial</span>
              <span class="font-semibold text-slate-800 truncate block">${app.repLegal}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Horario</span>
              <span class="font-semibold text-slate-800 truncate block">${app.horario}</span>
            </div>
            <div class="col-span-1 sm:col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Docente Tutor UPDS</span>
                <span class="font-bold text-[#003876] text-xs">${app.tutorDocente || 'Asignado en Aprobación'}</span>
              </div>
              <button onclick="openDocenteModal('${app.id}')" class="text-[11px] font-bold text-slate-600 hover:text-[#003876] underline">
                Cambiar Tutor
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de Acción (Conexión al siguiente paso del flujo) -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button onclick="openAvanceModal('${app.id}')" class="flex-1 py-2 px-2.5 sm:px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-1.5">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5 text-[#003876]"></i>
            <span>Reportar Horas</span>
          </button>
          <button onclick="finalizarPractica('${app.id}')" class="flex-1 py-2 px-2.5 sm:px-3 bg-[#003876] hover:bg-[#002855] text-white font-bold text-xs rounded-xl transition inline-flex items-center justify-center gap-1.5 shadow-xs">
            <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
            <span>Concluir (360h)</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function openAvanceModal(studentId) {
  selectedStudentForModal = studentApplications.find(a => a.id === studentId);
  if (!selectedStudentForModal) return;

  const app = selectedStudentForModal;
  document.getElementById('avance-student-name').innerText = app.studentName;
  document.getElementById('avance-student-ru').innerText = app.ru;
  document.getElementById('avance-current-hours').innerText = `${app.horasRealizadas} / ${app.horas} Horas`;
  document.getElementById('avance-hours-add').value = 40;

  const modal = document.getElementById('modal-avance-horas');
  if (modal) modal.classList.remove('hidden');

  lucide.createIcons();
}

function closeAvanceModal() {
  const modal = document.getElementById('modal-avance-horas');
  if (modal) modal.classList.add('hidden');
}

function submitAvanceHoras() {
  if (!selectedStudentForModal) return;

  const add = parseInt(document.getElementById('avance-hours-add').value) || 0;
  selectedStudentForModal.horasRealizadas = Math.min(selectedStudentForModal.horas, selectedStudentForModal.horasRealizadas + add);

  closeAvanceModal();
  showToast(`Se agregaron ${add} horas de práctica para ${selectedStudentForModal.studentName}. Total acumulado: ${selectedStudentForModal.horasRealizadas} hrs.`, 'success');
  updateMetrics();
  renderSeguimiento();
}

function openDocenteModal(studentId) {
  selectedStudentForModal = studentApplications.find(a => a.id === studentId);
  if (!selectedStudentForModal) return;

  const select = document.getElementById('select-docente-tutor');
  if (select) {
    select.innerHTML = DOCENTES_TUTORES.map(d => `
      <option value="${d.nombre}" ${selectedStudentForModal.tutorDocente === d.nombre ? 'selected' : ''}>
        ${d.nombre} — ${d.cargo}
      </option>
    `).join('');
  }

  document.getElementById('docente-student-name').innerText = selectedStudentForModal.studentName;

  const modal = document.getElementById('modal-asignar-docente');
  if (modal) modal.classList.remove('hidden');

  lucide.createIcons();
}

function closeDocenteModal() {
  const modal = document.getElementById('modal-asignar-docente');
  if (modal) modal.classList.add('hidden');
}

function submitAsignarDocente() {
  if (!selectedStudentForModal) return;

  const select = document.getElementById('select-docente-tutor');
  if (select) {
    selectedStudentForModal.tutorDocente = select.value;
  }

  closeDocenteModal();
  showToast(`Docente Tutor (${selectedStudentForModal.tutorDocente}) actualizado con éxito para ${selectedStudentForModal.studentName}.`, 'success');
  renderSeguimiento();
}

function finalizarPractica(studentId) {
  const app = studentApplications.find(a => a.id === studentId);
  if (!app) return;

  app.horasRealizadas = 360;
  app.statusKey = 'CONCLUIDA';
  app.informeFinalDoc = 'Informe_Final_360h_Firmado.pdf';

  showToast(`¡Práctica de 360 horas concluida para ${app.studentName}! Pasando al Paso 3: Acreditación Final & Notas...`, 'success');
  updateMetrics();
  renderSeguimiento();

  // Conexión directa hacia la interfaz de Acreditación (Paso 3 del flujo)
  setTimeout(() => {
    switchWorkspaceTab('tab-acreditaciones');
    openCalificacionModal(studentId);
  }, 600);
}

/* =================================================================
   TAB 3: ACREDITACIÓN FINAL & NOTAS (PASO 3 DEL FLUJO)
   (Renderiza tanto la tabla Desktop como las tarjetas Mobile)
   ================================================================= */
function renderAcreditaciones() {
  const tbody = document.getElementById('table-acreditaciones-body');
  const mobileContainer = document.getElementById('container-acreditaciones-mobile');

  const searchInput = document.getElementById('input-search-acreditaciones');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const list = studentApplications.filter(a => a.statusKey === 'CONCLUIDA' || a.statusKey === 'ACREDITADA');
  const filtered = list.filter(app =>
    !searchTerm ||
    app.studentName.toLowerCase().includes(searchTerm) ||
    app.ru.toLowerCase().includes(searchTerm) ||
    app.institution.toLowerCase().includes(searchTerm)
  );

  // 1. Render para Desktop (Tabla Tradicional)
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-xs text-slate-400">No hay estudiantes en etapa final de informe o acreditación.</td></tr>`;
    } else {
      tbody.innerHTML = filtered.map(app => {
        const isAcreditado = app.statusKey === 'ACREDITADA';

        return `
          <tr class="hover:bg-slate-50/80 transition text-xs border-b border-slate-100">
            <td class="py-3.5 px-4">
              <div class="font-bold text-slate-900">${app.studentName}</div>
              <div class="text-[11px] text-slate-400">RU: <strong>${app.ru}</strong> • ${app.career}</div>
            </td>
            <td class="py-3.5 px-4">
              <div class="font-semibold text-slate-800 truncate max-w-[200px]">${app.institution}</div>
              <div class="text-[11px] text-[#003876]">Tutor: ${app.tutorDocente || 'Dirección de Carrera'}</div>
            </td>
            <td class="py-3.5 px-4">
              <span class="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <i class="bi bi-file-earmark-check"></i> ${app.informeFinalDoc || 'Informe_360h.pdf'}
              </span>
            </td>
            <td class="py-3.5 px-4">
              ${app.notaFinal ? `
                <div class="flex items-center gap-1.5">
                  <span class="font-black text-slate-900 text-sm">${app.notaFinal}</span>
                  <span class="text-[11px] text-slate-400">/ 100</span>
                  <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Aprobado</span>
                </div>
              ` : `
                <span class="text-[11px] text-amber-600 font-semibold italic flex items-center gap-1">
                  <i class="bi bi-clock"></i> Pendiente de Calificar
                </span>
              `}
            </td>
            <td class="py-3.5 px-4">
              ${app.actaNro ? `
                <span class="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 block truncate max-w-[140px]">
                  ${app.actaNro}
                </span>
              ` : `
                <span class="text-slate-400 text-[11px] italic">Sin Acta</span>
              `}
            </td>
            <td class="py-3.5 px-4 text-right space-x-1.5">
              ${!isAcreditado ? `
                <button onclick="openCalificacionModal('${app.id}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1.5 shadow-xs">
                  <i data-lucide="award" class="w-3.5 h-3.5"></i>
                  <span>Calificar y Acreditar</span>
                </button>
              ` : `
                <button onclick="verActaOficial('${app.id}')" class="px-3.5 py-1.5 bg-[#003876] hover:bg-[#002855] text-white font-bold text-[11px] rounded-lg transition inline-flex items-center gap-1 shadow-xs">
                  <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                  <span>Ver Acta Oficial</span>
                </button>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // 2. Render para Mobile (Tarjetas Adaptativas)
  if (mobileContainer) {
    if (filtered.length === 0) {
      mobileContainer.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">No hay estudiantes en etapa final.</div>`;
    } else {
      mobileContainer.innerHTML = filtered.map(app => {
        const isAcreditado = app.statusKey === 'ACREDITADA';

        return `
          <div class="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <h5 class="font-bold text-slate-900 text-sm truncate">${app.studentName}</h5>
                <p class="text-[11px] text-slate-400">RU: <strong>${app.ru}</strong> • ${app.career}</p>
              </div>
              <div class="shrink-0">
                ${app.notaFinal ? `
                  <span class="font-black text-slate-900 text-xs sm:text-sm bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-800">${app.notaFinal}/100</span>
                ` : `
                  <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">Pendiente</span>
                `}
              </div>
            </div>

            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
              <div class="font-semibold text-slate-800 truncate">${app.institution}</div>
              <div class="text-[11px] text-[#003876]">Tutor: ${app.tutorDocente || 'Dirección de Carrera'}</div>
              ${app.actaNro ? `<div class="text-[10px] font-mono font-bold text-indigo-700 truncate">Acta: ${app.actaNro}</div>` : ''}
            </div>

            <div class="pt-1 flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 truncate flex-1">
                <i class="bi bi-file-earmark-check shrink-0"></i> <span class="truncate">${app.informeFinalDoc || 'Informe_360h.pdf'}</span>
              </span>
              ${!isAcreditado ? `
                <button onclick="openCalificacionModal('${app.id}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1 shadow-xs shrink-0">
                  <i data-lucide="award" class="w-3.5 h-3.5"></i>
                  <span>Calificar</span>
                </button>
              ` : `
                <button onclick="verActaOficial('${app.id}')" class="px-3.5 py-1.5 bg-[#003876] hover:bg-[#002855] text-white font-bold text-xs rounded-xl transition inline-flex items-center gap-1 shadow-xs shrink-0">
                  <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                  <span>Ver Acta</span>
                </button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  lucide.createIcons();
}

function openCalificacionModal(studentId) {
  selectedStudentForModal = studentApplications.find(a => a.id === studentId);
  if (!selectedStudentForModal) return;

  const app = selectedStudentForModal;
  document.getElementById('calif-student-name').innerText = app.studentName;
  document.getElementById('calif-student-ru').innerText = app.ru;
  document.getElementById('calif-institution').innerText = app.institution;
  document.getElementById('calif-tutor').innerText = app.tutorDocente || 'Ing. Fernando Ribera Morón';

  document.getElementById('score-empresa').value = 28;
  document.getElementById('score-informe').value = 38;
  document.getElementById('score-defensa').value = 29;
  document.getElementById('calif-obs').value = 'Excelente desempeño técnico y cumplimiento cabal del plan de trabajo de 360 horas.';

  calculateTotalNota();

  const modal = document.getElementById('modal-calificacion');
  if (modal) modal.classList.remove('hidden');

  lucide.createIcons();
}

function closeCalificacionModal() {
  const modal = document.getElementById('modal-calificacion');
  if (modal) modal.classList.add('hidden');
}

function calculateTotalNota() {
  const s1 = parseInt(document.getElementById('score-empresa')?.value) || 0;
  const s2 = parseInt(document.getElementById('score-informe')?.value) || 0;
  const s3 = parseInt(document.getElementById('score-defensa')?.value) || 0;

  const total = Math.min(100, s1 + s2 + s3);
  const totalEl = document.getElementById('calif-total-score');
  if (totalEl) totalEl.innerText = total;

  const badgeEl = document.getElementById('calif-criterio-badge');
  if (badgeEl) {
    if (total >= 90) badgeEl.innerText = 'Excelente / Con Distinción';
    else if (total >= 70) badgeEl.innerText = 'Aprobado Satisfactoriamente';
    else badgeEl.innerText = 'Insuficiente';
  }
}

function submitCalificacion() {
  if (!selectedStudentForModal) return;

  const s1 = parseInt(document.getElementById('score-empresa').value) || 0;
  const s2 = parseInt(document.getElementById('score-informe').value) || 0;
  const s3 = parseInt(document.getElementById('score-defensa').value) || 0;
  const obs = document.getElementById('calif-obs').value.trim();

  const total = s1 + s2 + s3;
  const actaCode = `PPR-ACTA-2026-00${Math.floor(40 + Math.random() * 59)}`;

  selectedStudentForModal.evaluaciones = {
    desempeno: s1,
    informe: s2,
    defensa: s3,
    observaciones: obs
  };
  selectedStudentForModal.notaFinal = total;
  selectedStudentForModal.actaNro = actaCode;
  selectedStudentForModal.statusKey = 'ACREDITADA';

  closeCalificacionModal();
  showToast(`¡Acreditación firmada! Nota final (${total}/100) y Acta (${actaCode}) registradas en el sistema SAADS para ${selectedStudentForModal.studentName}.`, 'success');
  updateMetrics();
  renderAcreditaciones();
}

function verActaOficial(studentId) {
  const app = studentApplications.find(a => a.id === studentId);
  if (!app) return;

  selectedStudentForModal = app;
  document.getElementById('acta-modal-num').innerText = app.actaNro || 'PPR-ACTA-2026-0042';
  document.getElementById('acta-student-name').innerText = app.studentName;
  document.getElementById('acta-student-ru').innerText = app.ru;
  document.getElementById('acta-career').innerText = app.career;
  document.getElementById('acta-institution').innerText = app.institution;
  document.getElementById('acta-score').innerText = `${app.notaFinal} / 100`;
  document.getElementById('acta-docente').innerText = app.tutorDocente || 'Ing. Fernando Ribera Morón';
  document.getElementById('acta-date').innerText = new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' });

  const modal = document.getElementById('modal-acta-preview');
  if (modal) modal.classList.remove('hidden');

  lucide.createIcons();
}

function closeActaModal() {
  const modal = document.getElementById('modal-acta-preview');
  if (modal) modal.classList.add('hidden');
}

/* =================================================================
   MÓDULO INDEPENDIENTE: DIRECTORIO DE CONVOCATORIAS & CUPOS
   (Fuera del flujo secuencial de postulaciones)
   ================================================================= */
function renderConvocatorias() {
  const container = document.getElementById('container-convocatorias-grid');
  if (!container) return;

  container.innerHTML = convocatoriasList.map(c => {
    const libres = c.plazasTotales - c.plazasOcupadas;
    const pctOcupacion = Math.round((c.plazasOcupadas / c.plazasTotales) * 100);

    return `
      <div class="p-4 sm:p-5 border border-slate-200 rounded-2xl bg-white shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="font-bold uppercase text-[10px] text-slate-400">${c.rubro}</span>
            <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
              ${c.plazasOcupadas} de ${c.plazasTotales} Plazas (${libres} Libres)
            </span>
          </div>
          <h4 class="text-sm sm:text-base font-bold text-slate-900">${c.institucion}</h4>
          <p class="text-xs text-slate-500 font-medium">${c.division}</p>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">${c.descripcion}</p>

          <!-- Barra de Cupos -->
          <div class="mt-3 space-y-1">
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div class="bg-[#003876] h-full rounded-full transition-all" style="width: ${pctOcupacion}%"></div>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-400">
              <span>NIT: ${c.nit}</span>
              <span>Requisito: ${c.semestreReq}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-slate-500 font-medium text-[11px] sm:text-xs">Convenio: <strong>${c.vigencia}</strong></span>
          <button onclick="openEditarPlazasModal('${c.id}')" class="px-3 py-1 bg-slate-100 hover:bg-[#003876] hover:text-white text-slate-700 font-bold rounded-lg transition text-xs">
            Editar Plazas
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function openNuevaConvocatoriaModal() {
  const modal = document.getElementById('modal-nueva-convocatoria');
  if (modal) modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeNuevaConvocatoriaModal() {
  const modal = document.getElementById('modal-nueva-convocatoria');
  if (modal) modal.classList.add('hidden');
}

function submitNuevaConvocatoria(e) {
  if (e) e.preventDefault();

  const institucion = document.getElementById('new-conv-empresa')?.value.trim();
  const rubro = document.getElementById('new-conv-rubro')?.value;
  const nit = document.getElementById('new-conv-nit')?.value.trim();
  const plazas = parseInt(document.getElementById('new-conv-plazas')?.value) || 3;
  const horario = document.getElementById('new-conv-horario')?.value.trim();
  const desc = document.getElementById('new-conv-desc')?.value.trim();

  if (!institucion || !nit) {
    showToast('Por favor completa todos los campos requeridos.', 'warning');
    return;
  }

  convocatoriasList.unshift({
    id: `CONV-${Date.now()}`,
    institucion,
    division: 'Área de Tecnología y Operaciones',
    rubro,
    nit,
    repLegal: 'Gerencia de Recursos Humanos',
    contacto: 'rrhh@empresa.com.bo',
    telefono: '+591 3 3120000',
    descripcion: desc || 'Pasantía y práctica curricular en áreas operativas y tecnológicas de la empresa.',
    plazasTotales: plazas,
    plazasOcupadas: 0,
    semestreReq: '8vo Semestre en adelante',
    vigencia: 'Diciembre 2027',
    horario: horario || 'Turno Mañana'
  });

  closeNuevaConvocatoriaModal();
  showToast(`Nueva Convocatoria (${institucion}) publicada con éxito para los estudiantes.`, 'success');
  renderConvocatorias();
}

function openEditarPlazasModal(convId) {
  selectedConvocatoriaForModal = convocatoriasList.find(c => c.id === convId);
  if (!selectedConvocatoriaForModal) return;

  const c = selectedConvocatoriaForModal;
  document.getElementById('edit-plazas-empresa').innerText = c.institucion;
  document.getElementById('edit-plazas-ocupadas').innerText = `${c.plazasOcupadas} ocupadas actualmente`;
  document.getElementById('edit-plazas-input').value = c.plazasTotales;

  const modal = document.getElementById('modal-editar-plazas');
  if (modal) modal.classList.remove('hidden');

  lucide.createIcons();
}

function closeEditarPlazasModal() {
  const modal = document.getElementById('modal-editar-plazas');
  if (modal) modal.classList.add('hidden');
}

function submitEditarPlazas() {
  if (!selectedConvocatoriaForModal) return;

  const newTotal = parseInt(document.getElementById('edit-plazas-input')?.value) || selectedConvocatoriaForModal.plazasTotales;
  if (newTotal < selectedConvocatoriaForModal.plazasOcupadas) {
    showToast('El total de plazas no puede ser menor a los estudiantes que ya están ocupando un cupo.', 'warning');
    return;
  }

  selectedConvocatoriaForModal.plazasTotales = newTotal;

  closeEditarPlazasModal();
  showToast(`Plazas actualizadas para ${selectedConvocatoriaForModal.institucion} (${newTotal} plazas totales).`, 'success');
  renderConvocatorias();
}

/* =================================================================
   NUEVA INTERFAZ: PARÁMETROS DE COBRO (GALILEO)
   (Configuración de aranceles y códigos contables)
   ================================================================= */
function renderParametrosCobro() {
  const inputServicio = document.getElementById('param-servicio');
  const inputArticulo = document.getElementById('param-articulo');
  const inputDesc = document.getElementById('param-descripcion');
  const inputPrecio = document.getElementById('param-precio');
  const inputCebe = document.getElementById('param-cebe');
  const inputNpago = document.getElementById('param-npago');
  const inputDias = document.getElementById('param-dias-validez');
  const inputObs = document.getElementById('param-obs-sufijo');

  if (inputServicio) inputServicio.value = galileoConfig.servicio;
  if (inputArticulo) inputArticulo.value = galileoConfig.articulo;
  if (inputDesc) inputDesc.value = galileoConfig.descripcion;
  if (inputPrecio) inputPrecio.value = galileoConfig.precio;
  if (inputCebe) inputCebe.value = galileoConfig.cebe;
  if (inputNpago) inputNpago.value = galileoConfig.npago;
  if (inputDias) inputDias.value = galileoConfig.diasValidez;
  if (inputObs) inputObs.value = galileoConfig.observacionSufijo;

  updateParametrosPreview();
}

function updateParametrosPreview() {
  const servicio = document.getElementById('param-servicio')?.value || galileoConfig.servicio;
  const articulo = document.getElementById('param-articulo')?.value || galileoConfig.articulo;
  const desc = document.getElementById('param-descripcion')?.value || galileoConfig.descripcion;
  const precio = document.getElementById('param-precio')?.value || galileoConfig.precio;
  const cebe = document.getElementById('param-cebe')?.value || galileoConfig.cebe;
  const npago = document.getElementById('param-npago')?.value || galileoConfig.npago;

  // Actualizar tarjeta de previsualización en vivo
  const prevServicio = document.getElementById('prev-galileo-servicio');
  const prevArticulo = document.getElementById('prev-galileo-articulo');
  const prevDesc = document.getElementById('prev-galileo-desc');
  const prevPrecio = document.getElementById('prev-galileo-precio');
  const prevCebe = document.getElementById('prev-galileo-cebe');
  const prevNpago = document.getElementById('prev-galileo-npago');

  if (prevServicio) prevServicio.innerText = servicio;
  if (prevArticulo) prevArticulo.innerText = articulo;
  if (prevDesc) prevDesc.innerText = desc;
  if (prevPrecio) prevPrecio.innerText = `Bs. ${precio}`;
  if (prevCebe) prevCebe.innerText = cebe;
  if (prevNpago) prevNpago.innerText = npago;
}

function saveParametrosCobro(e) {
  if (e) e.preventDefault();

  const servicio = document.getElementById('param-servicio')?.value.trim();
  const articulo = document.getElementById('param-articulo')?.value.trim();
  const desc = document.getElementById('param-descripcion')?.value.trim();
  const precio = document.getElementById('param-precio')?.value.trim();
  const cebe = document.getElementById('param-cebe')?.value.trim();
  const npago = document.getElementById('param-npago')?.value.trim();
  const dias = parseInt(document.getElementById('param-dias-validez')?.value) || 30;
  const obs = document.getElementById('param-obs-sufijo')?.value.trim();

  if (!servicio || !articulo || !precio || !cebe) {
    showToast('Por favor completa todos los campos requeridos de configuración.', 'warning');
    return;
  }

  galileoConfig.servicio = servicio;
  galileoConfig.articulo = articulo;
  galileoConfig.descripcion = desc || 'CUOTA';
  galileoConfig.precio = precio;
  galileoConfig.cebe = cebe;
  galileoConfig.npago = npago || '1';
  galileoConfig.diasValidez = dias;
  galileoConfig.observacionSufijo = obs || '2026/2/3';

  showToast('¡Parámetros de Cobro Galileo guardados con éxito! Los nuevos valores se aplicarán al aprobar solicitudes.', 'success');
  updateParametrosPreview();
}

/* =================================================================
   TOASTS Y PERFIL SAADS v2
   ================================================================= */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'warning' ? 'bg-amber-600' : type === 'info' ? 'bg-[#003876]' : 'bg-slate-800';

  toast.className = `${bgClass} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-in fade-in duration-300 z-50`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'info'}" class="w-4 h-4 shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function toggleProfileDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('dropdown-profile');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

function setAppTheme(mode) {
  const btnLight = document.getElementById('theme-btn-light');
  const btnDark = document.getElementById('theme-btn-dark');
  const btnAuto = document.getElementById('theme-btn-auto');

  const defaultClasses = 'flex items-center justify-center py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition text-xs font-semibold';
  const activeClasses = 'flex items-center justify-center py-1.5 rounded-lg text-slate-900 bg-white shadow-2xs font-bold text-xs text-[#003876]';

  if (btnLight) btnLight.className = defaultClasses;
  if (btnDark) btnDark.className = defaultClasses;
  if (btnAuto) btnAuto.className = defaultClasses;

  if (mode === 'light') {
    document.documentElement.classList.remove('dark');
    if (btnLight) btnLight.className = activeClasses;
    showToast('Tema claro activado', 'info');
  } else if (mode === 'dark') {
    document.documentElement.classList.add('dark');
    if (btnDark) btnDark.className = activeClasses;
    showToast('Tema oscuro activado (Modo Simulación)', 'info');
  } else {
    document.documentElement.classList.remove('dark');
    if (btnAuto) btnAuto.className = activeClasses;
    showToast('Tema automático del sistema sincronizado', 'info');
  }
}

document.addEventListener('click', function(event) {
  const wrapper = document.getElementById('profile-popover-wrapper');
  const dropdown = document.getElementById('dropdown-profile');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    if (wrapper && !wrapper.contains(event.target)) {
      dropdown.classList.add('hidden');
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  navigateTo('home');
  updateMetrics();
});
