const STORAGE_KEY = "cronista-project-v1";
const STORAGE_DB_NAME = "cronista-library";
const STORAGE_DB_VERSION = 1;
const STORAGE_PROJECT_STORE = "projects";
const STORAGE_META_STORE = "meta";

let storageDb = null;
let storageMode = "starting";
let storageState = "starting";
let storageError = "";
let lastSavedAt = null;
let storageReady = Promise.resolve();
let saveQueue = Promise.resolve();

const starterProject = {
  project: {
    id: "primer-proyecto",
    title: "Mi primer proyecto",
    subtitle: "Mesa de trabajo nueva",
    description: "Un espacio para reunir material, ordenar ideas y convertirlas en un texto con dirección.",
    premise: "Definir qué quiero comprender o construir antes de empezar a llenar páginas.",
    targetWords: 10000,
    updatedAt: "2026-08-30T10:00:00.000Z"
  },
  sources: [],
  evidence: [],
  chapters: []
};

const amaliaDemoProject = {
  project: {
    id: "amalia-demo",
    title: "Amalia · novela histórica",
    subtitle: "Proyecto demostrativo",
    description: "Un laboratorio de lectura para estudiar cómo una novela histórica convierte un conflicto político en personajes, escenas y memoria.",
    premise: "Observar cómo la ficción puede narrar una época sin confundirse con una fuente histórica.",
    targetWords: 10000,
    updatedAt: "2026-08-30T10:00:00.000Z"
  },
  sources: [
    {
      id: "amalia-source",
      title: "Amalia (edición de 1909)",
      kind: "Novela histórica · fuente pública",
      author: "José Mármol",
      location: "https://es.wikisource.org/wiki/Amalia",
      pages: "Edición digital",
      note: "Referencia al texto original en español. El demo conserva la procedencia y notas propias; no incorpora la novela completa para no confundir la obra original con los derechos de una transcripción o edición digital.",
      excerpt: "Novela histórica ambientada en Buenos Aires durante el rosismo, donde el conflicto político atraviesa vínculos, decisiones y espacios privados.",
      content: "",
      wordCount: 0,
      imported: false
    },
    {
      id: "amalia-reading-card",
      title: "Ficha de lectura del demo",
      kind: "Nota de trabajo",
      author: "Cronista",
      location: "Incluida en el proyecto demostrativo",
      pages: "Sin paginar",
      note: "Paráfrasis y criterios de trabajo para mostrar cómo se separan historia, ficción e interpretación.",
      excerpt: "La novela puede servir como objeto literario, como representación de una época y como problema de lectura, pero no como crónica neutral.",
      content: "",
      wordCount: 0,
      imported: false
    }
  ],
  evidence: [
    {
      id: "amalia-evidence-1",
      statement: "La novela usa un conflicto político real como presión sobre vínculos privados.",
      type: "Inferencia",
      sourceId: "amalia-source",
      location: "lectura general",
      status: "En discusión",
      note: "Es una interpretación de trabajo; conviene volver a escenas concretas antes de convertirla en tesis.",
      supportingText: "Paráfrasis de lectura: el contexto político altera decisiones íntimas y organiza el peligro narrativo."
    },
    {
      id: "amalia-evidence-2",
      statement: "Amalia debe analizarse como ficción situada, no como una crónica neutral de la historia argentina.",
      type: "Criterio editorial",
      sourceId: "amalia-reading-card",
      location: "marco de lectura",
      status: "Adoptado",
      note: "Este criterio evita usar una novela como prueba directa de hechos sin contrastarla con fuentes históricas.",
      supportingText: "Nota de trabajo: la novela construye una versión narrativa de la época mediante voces, escenas y personajes."
    },
    {
      id: "amalia-evidence-3",
      statement: "La selección de capítulos puede mostrar cómo el espacio privado queda atravesado por la persecución política.",
      type: "Hipótesis",
      sourceId: "amalia-source",
      location: "Primera parte · capítulos iniciales",
      status: "Por revisar",
      note: "Hay que sostener esta hipótesis con escenas, personajes y cambios de tensión observables en el texto.",
      supportingText: ""
    }
  ],
  chapters: [
    {
      id: "amalia-chapter-1",
      title: "Una ciudad bajo presión",
      purpose: "Presentar el contexto político sin convertir la novela en un manual de historia.",
      pages: "1–20",
      status: "En proceso",
      sources: ["amalia-source", "amalia-reading-card"],
      draft: "El proyecto no debería empezar explicando todo el rosismo. Conviene empezar por la presión: una ciudad donde las decisiones privadas ya no parecen completamente privadas. La novela histórica entra en ese espacio incómodo, entre el acontecimiento y la experiencia de quienes lo padecen."
    },
    {
      id: "amalia-chapter-2",
      title: "El amor como zona de riesgo",
      purpose: "Observar cómo el romance organiza la vulnerabilidad y vuelve visible el conflicto político.",
      pages: "21–45",
      status: "Borrador",
      sources: ["amalia-source"],
      draft: "La relación amorosa no funciona solamente como adorno sentimental. Puede ser el mecanismo que obliga a los personajes a elegir, ocultar, exponerse y pagar costos que no aparecen en una cronología política."
    },
    {
      id: "amalia-chapter-3",
      title: "Historia, ficción y testimonio",
      purpose: "Separar los hechos históricos del modo en que la novela los transforma en relato.",
      pages: "46–75",
      status: "Pendiente",
      sources: ["amalia-source", "amalia-reading-card"],
      draft: ""
    },
    {
      id: "amalia-chapter-4",
      title: "Leer una época a través de una novela",
      purpose: "Cerrar mostrando qué puede aportar la ficción y dónde deben intervenir otras fuentes.",
      pages: "76–100",
      status: "Pendiente",
      sources: ["amalia-reading-card"],
      draft: ""
    }
  ]
};

const ismaelDemoProject = {
  project: {
    id: "ismael-demo",
    title: "Ismael · novela histórica uruguaya",
    subtitle: "Proyecto demostrativo · Uruguay",
    description: "Un laboratorio de lectura para estudiar cómo una novela convierte la revolución oriental de 1811 en experiencia humana, conflicto y memoria nacional.",
    premise: "Leer la ficción histórica como una interpretación situada: valiosa para comprender una época, insuficiente como prueba aislada de los hechos.",
    targetWords: 10000,
    updatedAt: "2026-08-30T10:00:00.000Z"
  },
  sources: [
    {
      id: "ismael-source",
      title: "Ismael (edición de 1888)",
      kind: "Novela histórica · fuente pública",
      author: "Eduardo Acevedo Díaz",
      location: "https://es.wikisource.org/wiki/Ismael",
      pages: "56 capítulos · edición digital",
      note: "Referencia al texto de la novela. El demo conserva la procedencia y notas de lectura, sin duplicar el texto completo dentro del repositorio.",
      excerpt: "La novela sigue a un joven gaucho en el contexto de la revolución oriental y combina peripecia personal, paisaje, guerra y formación de una comunidad política.",
      content: "",
      wordCount: 0,
      imported: false
    },
    {
      id: "ismael-bnu-context",
      title: "Ismael y la batalla de Las Piedras",
      kind: "Contexto institucional",
      author: "Biblioteca Nacional de Uruguay",
      location: "https://www.bibna.gub.uy/blog-bnu/ismael-la-batalla-de-las-piedras-vista-desde-la-ficcion-heroica-de-acevedo-diaz/",
      pages: "Artículo web",
      note: "Contextualiza la novela, su protagonista y el vínculo entre ficción heroica y acontecimiento histórico.",
      excerpt: "La Biblioteca Nacional presenta la novela como una reconstrucción ficcional de la batalla de Las Piedras y de los comienzos de la revolución de 1811.",
      content: "",
      wordCount: 0,
      imported: false
    },
    {
      id: "ismael-reading-card",
      title: "Ficha de lectura del demo",
      kind: "Nota de trabajo",
      author: "Cronista",
      location: "Incluida en el proyecto demostrativo",
      pages: "Sin paginar",
      note: "Paráfrasis y criterios de trabajo para mostrar cómo se separan hechos, inferencias, hipótesis y decisiones editoriales.",
      excerpt: "La novela puede construir una memoria nacional y, al mismo tiempo, debe leerse junto con otras fuentes cuando se quiere afirmar qué ocurrió históricamente.",
      content: "",
      wordCount: 0,
      imported: false
    }
  ],
  evidence: [
    {
      id: "ismael-evidence-1",
      statement: "Ismael convierte la revolución oriental en una experiencia narrada desde la trayectoria de un personaje ficcional.",
      type: "Hecho",
      sourceId: "ismael-source",
      location: "presentación y capítulos iniciales",
      status: "Por revisar",
      note: "Volver a escenas concretas antes de formular la afirmación con mayor precisión.",
      supportingText: "Paráfrasis de lectura: la novela acompaña a Ismael Velarde en un contexto de levantamiento, desplazamientos y enfrentamientos.",
    },
    {
      id: "ismael-evidence-2",
      statement: "El protagonista permite acercar la historia política a decisiones, vínculos y riesgos vividos por personas concretas.",
      type: "Inferencia",
      sourceId: "ismael-source",
      location: "lectura general",
      status: "En discusión",
      note: "Es una interpretación del efecto narrativo; no equivale a afirmar que el personaje existió históricamente.",
      supportingText: "Nota de lectura: la peripecia individual funciona como una puerta de entrada a un proceso colectivo.",
    },
    {
      id: "ismael-evidence-3",
      statement: "La novela histórica debe contrastarse con fuentes documentales cuando se usa para sostener una afirmación sobre 1811.",
      type: "Criterio editorial",
      sourceId: "ismael-reading-card",
      location: "marco de lectura",
      status: "Adoptado",
      note: "Protege la diferencia entre una representación literaria del pasado y una evidencia histórica independiente.",
      supportingText: "Criterio del demo: la ficción es objeto de análisis y no reemplaza el contraste documental.",
    },
    {
      id: "ismael-evidence-4",
      statement: "El paisaje y la vida rural pueden funcionar como algo más que ambientación: también organizan pertenencias y conflictos.",
      type: "Hipótesis",
      sourceId: "ismael-source",
      location: "capítulos de la campaña",
      status: "Por revisar",
      note: "Hay que sostenerla con pasajes específicos y compararla con el tratamiento de la ciudad y los espacios de poder.",
      supportingText: "",
    }
  ],
  chapters: [
    {
      id: "ismael-chapter-1",
      title: "Un hombre dentro de la revolución",
      purpose: "Presentar a Ismael como personaje de ficción y ubicarlo dentro del proceso revolucionario sin convertirlo en héroe documental.",
      pages: "1–18",
      status: "En proceso",
      sources: ["ismael-source", "ismael-reading-card"],
      draft: "La novela no empieza con una cronología desnuda. Empieza con un mundo social y con un hombre que todavía no conoce el tamaño histórico de aquello que está por ocurrir. Esa elección importa: la revolución aparece primero como una presión sobre vidas concretas, antes de convertirse en capítulo de una historia nacional.\n\nIsmael no debe confundirse con un testigo real de 1811. Su valor está en otra parte: permite que el lector siga desplazamientos, lealtades, temores y decisiones que una lista de fechas no podría mostrar. La ficción vuelve visible una experiencia posible del acontecimiento, y justamente por eso exige una lectura doble: atender a su potencia narrativa y mantener abierta la pregunta por sus límites históricos."
    },
    {
      id: "ismael-chapter-2",
      title: "La campaña y la plaza fuerte",
      purpose: "Observar cómo el paisaje, la vida rural y Montevideo organizan posiciones, trayectorias y formas de autoridad.",
      pages: "19–45",
      status: "Borrador",
      sources: ["ismael-source", "ismael-bnu-context"],
      draft: "La campaña no funciona solamente como fondo pintoresco. En la novela, los caminos, las estancias y los espacios de combate distribuyen información, peligro y pertenencia. La ciudad amurallada concentra otra forma de poder, ligada al orden colonial y a la resistencia frente al cambio."
    },
    {
      id: "ismael-chapter-3",
      title: "Ficción heroica y memoria nacional",
      purpose: "Analizar cómo la novela transforma acontecimientos de la independencia en una narración con héroes, antagonismos y sentido colectivo.",
      pages: "46–75",
      status: "Pendiente",
      sources: ["ismael-source", "ismael-bnu-context"],
      draft: ""
    },
    {
      id: "ismael-chapter-4",
      title: "Qué puede probar una novela",
      purpose: "Cerrar distinguiendo el valor de la representación literaria de la evidencia necesaria para reconstruir históricamente el período.",
      pages: "76–100",
      status: "Pendiente",
      sources: ["ismael-source", "ismael-reading-card"],
      draft: ""
    }
  ]
};

let workspace = loadWorkspace();
let state = workspace.projects.find((item) => item.project.id === workspace.activeProjectId) || workspace.projects[0] || cloneStarter();
let activeView = "overview";
let sourceFilter = "";
let evidenceFilter = "";
let evidenceDraft = { sourceId: "", supportingText: "", location: "" };
let selectedSourceSelection = { sourceId: "", text: "" };
let selectedChapterId = state.chapters[0]?.id || null;
let saveTimer = null;
let toastTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function cloneStarter() {
  return JSON.parse(JSON.stringify(starterProject));
}

function cloneAmaliaDemo() {
  return JSON.parse(JSON.stringify(amaliaDemoProject));
}

function cloneIsmaelDemo() {
  return JSON.parse(JSON.stringify(ismaelDemoProject));
}

function cloneInitialProject(project) {
  const projectId = project?.project?.id;
  const replacement = projectId === ismaelDemoProject.project.id ? cloneIsmaelDemo() : projectId === amaliaDemoProject.project.id ? cloneAmaliaDemo() : cloneStarter();
  replacement.project.id = projectId || replacement.project.id;
  return replacement;
}

function newId(prefix) {
  const suffix = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${suffix}`;
}

function createEmptyProject({ title, type, description, premise, targetWords }) {
  const normalizedTarget = Number(targetWords);
  return {
    project: {
      id: newId("project"),
      title: String(title || "").trim(),
      subtitle: String(type || "Proyecto editorial").trim(),
      description: String(description || "").trim(),
      premise: String(premise || "Definí una pregunta rectora para que el texto tenga dirección.").trim(),
      targetWords: Number.isFinite(normalizedTarget) && normalizedTarget >= 100 ? Math.round(normalizedTarget) : 12000,
      updatedAt: new Date().toISOString()
    },
    sources: [],
    evidence: [],
    chapters: []
  };
}

function normalizeProject(project) {
  const hadEvidenceField = Array.isArray(project?.evidence);
  const normalized = project && typeof project === "object" ? project : cloneStarter();
  normalized.project = normalized.project && typeof normalized.project === "object" && !Array.isArray(normalized.project) ? normalized.project : {};
  normalized.project.id = String(normalized.project.id || newId("project")).trim();
  normalized.project.title = String(normalized.project.title || "Proyecto editorial").trim();
  normalized.project.subtitle = String(normalized.project.subtitle || "Proyecto editorial").trim();
  normalized.project.description = String(normalized.project.description || "Un proyecto de escritura en proceso.").trim();
  normalized.project.premise = String(normalized.project.premise || "Definí una pregunta rectora para orientar el trabajo.").trim();
  const targetWords = Number(normalized.project.targetWords);
  normalized.project.targetWords = Number.isFinite(targetWords) && targetWords >= 100 ? Math.round(targetWords) : 12000;
  normalized.project.updatedAt = normalized.project.updatedAt || new Date().toISOString();
  normalized.project.archived = Boolean(normalized.project.archived);
  normalized.sources = Array.isArray(normalized.sources) ? normalized.sources : [];
  normalized.sources = normalized.sources.map((source, index) => {
    const item = source && typeof source === "object" ? source : {};
    const content = String(item.content || "");
    const storedWordCount = Number(item.wordCount);
    return { ...item, id: String(item.id || newId(`source-${index + 1}`)).trim(), title: String(item.title || "Fuente sin título").trim(), kind: String(item.kind || "Fuente").trim(), author: String(item.author || "Procedencia no indicada").trim(), location: String(item.location || "").trim(), url: String(item.url || "").trim(), edition: String(item.edition || "").trim(), publisher: String(item.publisher || "").trim(), year: String(item.year || "").trim(), accessedAt: String(item.accessedAt || "").trim(), pages: String(item.pages || "Sin paginar").trim(), note: String(item.note || "").trim(), excerpt: String(item.excerpt || "").trim(), content, wordCount: Number.isFinite(storedWordCount) && storedWordCount >= 0 ? Math.round(storedWordCount) : wordCount(content), imported: Boolean(item.imported), archived: Boolean(item.archived) };
  });
  normalized.evidence = Array.isArray(normalized.evidence) ? normalized.evidence.map((evidence, index) => {
    const item = evidence && typeof evidence === "object" ? evidence : {};
    return { ...item, id: String(item.id || newId(`evidence-${index + 1}`)).trim(), statement: String(item.statement || "").trim(), type: String(item.type || "Hipótesis").trim(), sourceId: String(item.sourceId || "").trim(), location: String(item.location || "").trim(), status: String(item.status || "Por revisar").trim(), note: String(item.note || "").trim(), supportingText: String(item.supportingText || "").trim(), archived: Boolean(item.archived) };
  }) : [];
  const isStarterProject = normalized.project.id === starterProject.project.id || normalized.project.title === starterProject.project.title;
  if (isStarterProject && (!hadEvidenceField || normalized.evidence.length === 0)) normalized.evidence = JSON.parse(JSON.stringify(starterProject.evidence));
  normalized.chapters = Array.isArray(normalized.chapters) ? normalized.chapters.map((chapter, index) => {
    const item = chapter && typeof chapter === "object" ? chapter : {};
    return { ...item, id: String(item.id || newId(`chapter-${index + 1}`)).trim(), title: String(item.title || "Capítulo sin título").trim(), purpose: String(item.purpose || "").trim(), pages: String(item.pages || "Por definir").trim(), status: String(item.status || "Pendiente").trim(), sources: Array.isArray(item.sources) ? item.sources.map((sourceId) => String(sourceId).trim()) : [], draft: String(item.draft || "") };
  }) : [];
  return normalized;
}

function loadWorkspace() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.projects)) {
        const projects = parsed.projects.map(normalizeProject);
        return withPublicDemos({ activeProjectId: parsed.activeProjectId || projects[0]?.project.id, projects });
      }
      if (parsed.project) {
        const migrated = normalizeProject(parsed);
        return withPublicDemos({ activeProjectId: migrated.project.id, projects: [migrated] });
      }
    }
  } catch (error) {
    console.warn("No se pudo cargar la biblioteca local", error);
  }
  const ismael = cloneIsmaelDemo();
  return withPublicDemos({ activeProjectId: ismael.project.id, projects: [ismael] });
}

function withPublicDemos(workspace) {
  if (!workspace.projects.some((project) => project.project.id === amaliaDemoProject.project.id)) workspace.projects.push(cloneAmaliaDemo());
  if (!workspace.projects.some((project) => project.project.id === ismaelDemoProject.project.id)) workspace.projects.push(cloneIsmaelDemo());
  return workspace;
}

function idbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("No se pudo acceder al almacenamiento local."));
  });
}

function openStorageDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("Este navegador no ofrece IndexedDB."));
      return;
    }
    const request = window.indexedDB.open(STORAGE_DB_NAME, STORAGE_DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORAGE_PROJECT_STORE)) database.createObjectStore(STORAGE_PROJECT_STORE, { keyPath: "id" });
      if (!database.objectStoreNames.contains(STORAGE_META_STORE)) database.createObjectStore(STORAGE_META_STORE, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("No se pudo abrir el almacenamiento local."));
  });
}

async function readIndexedDbWorkspace(database) {
  const projects = await idbRequest(database.transaction(STORAGE_PROJECT_STORE, "readonly").objectStore(STORAGE_PROJECT_STORE).getAll());
  const active = await idbRequest(database.transaction(STORAGE_META_STORE, "readonly").objectStore(STORAGE_META_STORE).get("activeProjectId"));
  return { activeProjectId: active?.value || projects[0]?.id || "", projects: projects.map((record) => normalizeProject(record?.data || record)) };
}

async function writeAllProjectsToIndexedDb(nextWorkspace) {
  const transaction = storageDb.transaction([STORAGE_PROJECT_STORE, STORAGE_META_STORE], "readwrite");
  const projectsStore = transaction.objectStore(STORAGE_PROJECT_STORE);
  const metaStore = transaction.objectStore(STORAGE_META_STORE);
  projectsStore.clear();
  nextWorkspace.projects.map(normalizeProject).forEach((project) => projectsStore.put({ id: project.project.id, data: project }));
  metaStore.put({ key: "activeProjectId", value: nextWorkspace.activeProjectId });
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error("No se pudo migrar la biblioteca."));
    transaction.onabort = () => reject(transaction.error || new Error("La migración de la biblioteca fue interrumpida."));
  });
}

async function writeProjectToIndexedDb(project, activeProjectId) {
  const transaction = storageDb.transaction([STORAGE_PROJECT_STORE, STORAGE_META_STORE], "readwrite");
  const normalized = normalizeProject(project);
  transaction.objectStore(STORAGE_PROJECT_STORE).put({ id: normalized.project.id, data: normalized });
  transaction.objectStore(STORAGE_META_STORE).put({ key: "activeProjectId", value: activeProjectId });
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error || new Error("No se pudo guardar el proyecto."));
    transaction.onabort = () => reject(transaction.error || new Error("El guardado fue interrumpido."));
  });
}

function writeLegacyWorkspace() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
}

function updateStorageStatusUi() {
  const status = $("#storage-status");
  if (!status) return;
  let message = "Preparando guardado local…";
  let className = "storage-status pending";
  if (storageState === "saving") { message = "Guardando cambios…"; className = "storage-status saving"; }
  if (storageState === "saved") { message = "Guardado local"; className = "storage-status saved"; }
  if (storageMode === "localstorage" && storageState !== "error") { message = "Guardado local de compatibilidad"; className = "storage-status warning"; }
  if (storageState === "error") { message = "⚠ No se pudo guardar · exportá una copia"; className = "storage-status error"; }
  status.textContent = message;
  status.className = className;
  status.title = storageError || (storageMode === "indexeddb" ? "Tus proyectos se guardan por separado en el almacenamiento local del navegador." : "El navegador está usando el almacenamiento local de compatibilidad.");
}

function adoptWorkspace(nextWorkspace) {
  workspace = withPublicDemos({ activeProjectId: nextWorkspace.activeProjectId, projects: nextWorkspace.projects.map(normalizeProject) });
  state = workspace.projects.find((item) => item.project.id === workspace.activeProjectId) || workspace.projects[0] || cloneStarter();
  workspace.activeProjectId = state.project.id;
  selectedChapterId = state.chapters[0]?.id || null;
}

async function initializeStorage() {
  try {
    storageDb = await openStorageDatabase();
    const storedWorkspace = await readIndexedDbWorkspace(storageDb);
    if (storedWorkspace.projects.length) {
      adoptWorkspace(storedWorkspace);
    } else {
      await writeAllProjectsToIndexedDb(workspace);
    }
    storageMode = "indexeddb";
    storageState = "saved";
    storageError = "";
    lastSavedAt = new Date();
    render();
  } catch (error) {
    storageMode = "localstorage";
    storageState = "saved";
    storageError = error?.message || "No se pudo preparar el guardado avanzado.";
    updateStorageStatusUi();
    console.warn("IndexedDB no está disponible; se usará compatibilidad local", error);
  }
}

function persist({ deleteProjectId = "" } = {}) {
  state.project.updatedAt = new Date().toISOString();
  workspace.activeProjectId = state.project.id;
  workspace.projects = workspace.projects.map((project) => project.project.id === state.project.id ? state : project);
  const projectSnapshot = normalizeProject(JSON.parse(JSON.stringify(state)));
  const activeProjectId = workspace.activeProjectId;
  storageState = "saving";
  storageError = "";
  updateStorageStatusUi();
  const write = saveQueue.then(async () => {
    await storageReady;
    if (storageMode === "indexeddb" && storageDb) {
      if (deleteProjectId) {
        const transaction = storageDb.transaction(STORAGE_PROJECT_STORE, "readwrite");
        transaction.objectStore(STORAGE_PROJECT_STORE).delete(deleteProjectId);
        await new Promise((resolve, reject) => {
          transaction.oncomplete = resolve;
          transaction.onerror = () => reject(transaction.error || new Error("No se pudo retirar el proyecto."));
          transaction.onabort = () => reject(transaction.error || new Error("La eliminación fue interrumpida."));
        });
      }
      await writeProjectToIndexedDb(projectSnapshot, activeProjectId);
    } else writeLegacyWorkspace();
  });
  saveQueue = write.catch(() => undefined);
  return write.then(() => {
    storageState = "saved";
    storageError = "";
    lastSavedAt = new Date();
    updateStorageStatusUi();
    return { ok: true };
  }).catch((error) => {
    storageState = "error";
    storageError = error?.message || "No se pudo guardar la biblioteca.";
    updateStorageStatusUi();
    console.warn("No se pudo guardar la biblioteca local", error);
    return { ok: false, error };
  });
}

function persistAndNotify(successMessage, failureMessage = "No se pudo guardar. Exportá una copia.") {
  return persist().then((result) => {
    showToast(result.ok ? successMessage : failureMessage);
    return result;
  });
}

function renameProject() {
  const nextTitle = window.prompt("Nuevo nombre del proyecto", state.project.title);
  if (nextTitle === null) return;
  const title = nextTitle.trim();
  if (!title) { showToast("El nombre no puede quedar vacío"); return; }
  state.project.title = title;
  render();
  persistAndNotify("Proyecto renombrado");
}

function archiveProject() {
  const nextArchived = !state.project.archived;
  const action = nextArchived ? "archivar" : "recuperar";
  if (!window.confirm(`¿Querés ${action} “${state.project.title}”?`)) return;
  state.project.archived = nextArchived;
  render();
  persistAndNotify(nextArchived ? "Proyecto archivado" : "Proyecto recuperado");
}

function deleteProject() {
  if (workspace.projects.length <= 1) { showToast("No podés eliminar el único proyecto de la biblioteca"); return; }
  if (!window.confirm(`Esto elimina “${state.project.title}” de esta biblioteca. Si no tenés una copia JSON, no vas a poder recuperarlo. ¿Continuar?`)) return;
  const deletedProjectId = state.project.id;
  const nextProject = workspace.projects.find((project) => project.project.id !== deletedProjectId);
  workspace.projects = workspace.projects.filter((project) => project.project.id !== deletedProjectId);
  state = nextProject || cloneStarter();
  workspace.activeProjectId = state.project.id;
  selectedChapterId = state.chapters[0]?.id || null;
  sourceFilter = "";
  evidenceFilter = "";
  activeView = "overview";
  render();
  persist({ deleteProjectId: deletedProjectId }).then((result) => showToast(result.ok ? "Proyecto eliminado" : "No se pudo completar la eliminación; exportá una copia"));
}

function deleteSource(sourceId) {
  const source = sourceById(sourceId);
  if (!source || !window.confirm(`¿Eliminar la fuente “${source.title}”? Las evidencias y capítulos vinculados quedarán sin esa fuente, pero no se borrará su texto del manuscrito.`)) return;
  state.sources = state.sources.filter((item) => item.id !== sourceId);
  state.evidence = state.evidence.map((item) => item.sourceId === sourceId ? { ...item, sourceId: "" } : item);
  state.chapters = state.chapters.map((chapter) => ({ ...chapter, sources: chapter.sources.filter((id) => id !== sourceId) }));
  persistAndNotify("Fuente eliminada");
  render();
}

function deleteEvidence(evidenceId) {
  const item = state.evidence.find((evidence) => evidence.id === evidenceId);
  if (!item || !window.confirm("¿Eliminar esta evidencia? Esta acción no se puede deshacer salvo que tengas una copia JSON.")) return;
  state.evidence = state.evidence.filter((evidence) => evidence.id !== evidenceId);
  persistAndNotify("Evidencia eliminada");
  render();
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
}

function wordCount(value = "") {
  const words = String(value).trim().match(/\S+/g);
  return words ? words.length : 0;
}

function sourceWordCount(source) { return Number(source.wordCount) || wordCount(source.content || ""); }

function totalWords() {
  return state.chapters.reduce((sum, chapter) => sum + wordCount(chapter.draft), 0);
}

function chapterById(id) { return state.chapters.find((chapter) => chapter.id === id); }
function sourceById(id) { return state.sources.find((source) => source.id === id); }
function evidenceById(id) { return state.evidence.find((evidence) => evidence.id === id); }

function sourceLocationMarkup(location) {
  if (/^https?:\/\//i.test(location)) return `<a class="source-location-link" href="${escapeHtml(location)}" target="_blank" rel="noreferrer">↗ Abrir referencia web</a>`;
  return `<div class="muted" style="margin-top:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(location)}">⌁ ${escapeHtml(location)}</div>`;
}

function sourceCitation(source) {
  const parts = [source.author, source.year, source.title, source.edition, source.publisher].filter((part) => String(part || "").trim());
  return parts.length ? parts.join(". ") : "Referencia bibliográfica todavía incompleta.";
}

function sourceReferenceMarkdown(source) {
  const details = [sourceCitation(source), source.pages && source.pages !== "Sin paginar" ? `páginas: ${source.pages}` : "", source.location ? `ubicación: ${source.location}` : "", source.url ? `URL: ${source.url}` : "", source.accessedAt ? `consulta: ${source.accessedAt}` : ""].filter(Boolean);
  return `- ${details.join(" · ")}`;
}

function formatDate(iso) {
  try { return new Intl.DateTimeFormat("es-UY", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)); }
  catch { return "hoy"; }
}

function statusClass(status) { return String(status).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "pendiente"; }

function render() {
  const viewTitles = { overview: "Panorama", sources: "Fuentes", evidence: "Evidencias", traceability: "Trazabilidad", structure: "Arquitectura", manuscript: "Manuscrito", audit: "Auditor editorial", study: "Modo estudio" };
  $("#page-title").textContent = viewTitles[activeView];
  $("#page-kicker").textContent = activeView === "overview" ? "Taller editorial" : state.project.title;
  const selector = $("#project-selector");
  if (selector) {
    selector.innerHTML = workspace.projects.map((project) => `<option value="${escapeHtml(project.project.id)}">${escapeHtml(project.project.title)}${project.project.archived ? " · archivado" : ""}</option>`).join("");
    selector.value = state.project.id;
  }
  $("#sidebar-project-kind").textContent = `${state.project.subtitle}${state.project.archived ? " · Archivado" : ""} · ${workspace.projects.length} ${workspace.projects.length === 1 ? "proyecto" : "proyectos"}`;
  $("#nav-source-count").textContent = state.sources.length;
  $("#nav-evidence-count").textContent = state.evidence.length;
  $("#nav-traceability-count").textContent = state.evidence.length;
  $("#nav-chapter-count").textContent = state.chapters.length;
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === activeView));
  $("#app-content").innerHTML = views[activeView]();
  updateStorageStatusUi();
  if (activeView === "manuscript") syncEditorStatus();
}

function productGuideMarkup() {
  return `
    <details class="product-guide panel" open>
      <summary><span><span class="eyebrow">Para entenderlo rápido</span><strong>¿Para qué sirve Cronista?</strong></span><span class="guide-summary">Abrir o cerrar explicación <span aria-hidden="true">⌄</span></span></summary>
      <div class="product-guide-body">
        <p class="product-guide-lead">Cronista es una mesa de trabajo para transformar libros, PDFs, apuntes y borradores en un proyecto de escritura ordenado, trazable y revisable. Sirve para investigar, escribir, estudiar o editar sin perder de dónde sale cada idea.</p>
        <div class="guide-grid">
          <article class="guide-step"><span class="guide-step-number">01</span><div><h3>Reunir</h3><p>Guardá las fuentes, su procedencia y qué aporta cada una.</p></div></article>
          <article class="guide-step"><span class="guide-step-number">02</span><div><h3>Distinguir</h3><p>Separá hechos, inferencias, hipótesis y criterios de trabajo.</p></div></article>
          <article class="guide-step"><span class="guide-step-number">03</span><div><h3>Armar</h3><p>Diseñá capítulos con propósito, fuentes conectadas y estado.</p></div></article>
          <article class="guide-step"><span class="guide-step-number">04</span><div><h3>Escribir y revisar</h3><p>Redactá, auditá huecos y exportá una copia legible del proyecto.</p></div></article>
        </div>
        <div class="guide-footer"><p><strong>Importante:</strong> Cronista no decide qué es verdadero, no reemplaza tu criterio y no sube automáticamente tus textos a internet.</p><div class="guide-actions"><button class="button secondary" data-action="view" data-view="sources">Ver fuentes</button><button class="button secondary" data-action="view" data-view="manuscript">Ir al manuscrito</button><a class="button secondary" href="INSTRUCCIONES.md" target="_blank" rel="noreferrer">Leer guía completa</a></div></div>
      </div>
    </details>
  `;
}

const views = {
  overview() {
    const words = totalWords();
    const progress = Math.min(100, Math.round((words / state.project.targetWords) * 100));
    const inProcess = state.chapters.filter((chapter) => chapter.status === "En proceso").length;
    return `
      ${productGuideMarkup()}
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">Proyecto activo · ${escapeHtml(formatDate(state.project.updatedAt))}</div>
          <h2>${escapeHtml(state.project.title)}</h2>
          <p>${escapeHtml(state.project.description)}</p>
        </div>
        <div class="progress-card">
          <div class="progress-head"><span>Avance narrativo</span><span>${progress}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
          <p class="progress-note">${words.toLocaleString("es-UY")} palabras de una primera meta de ${state.project.targetWords.toLocaleString("es-UY")}.</p>
        </div>
      </section>

      <div class="stat-grid">
        <div class="stat-card"><div class="stat-label">Fuentes</div><div class="stat-value">${state.sources.length}</div><div class="stat-detail">material trazable</div></div>
        <div class="stat-card"><div class="stat-label">Capítulos</div><div class="stat-value">${state.chapters.length}</div><div class="stat-detail">${inProcess ? `${inProcess} en proceso` : "listos para ordenar"}</div></div>
        <div class="stat-card"><div class="stat-label">Palabras</div><div class="stat-value">${words.toLocaleString("es-UY")}</div><div class="stat-detail">en el manuscrito</div></div>
        <div class="stat-card"><div class="stat-label">Control</div><div class="stat-value">${auditScore()}%</div><div class="stat-detail">salud editorial</div></div>
      </div>

      <div class="section-heading"><div><h3>Mapa de trabajo</h3><p>Una vista breve de qué necesita atención ahora.</p></div><button class="button secondary" data-action="view" data-view="structure">Editar arquitectura</button></div>
      <div class="two-col">
        <div class="panel chapter-list">${state.chapters.map((chapter, index) => `
          <div class="chapter-row">
            <div class="chapter-index">${String(index + 1).padStart(2, "0")}</div>
            <div><div class="chapter-title">${escapeHtml(chapter.title)}</div><div class="chapter-meta">${escapeHtml(chapter.pages)} · ${wordCount(chapter.draft).toLocaleString("es-UY")} palabras</div></div>
            <span class="status-pill ${statusClass(chapter.status)}">${escapeHtml(chapter.status)}</span>
          </div>`).join("")}</div>
        <aside class="quote-panel"><div class="eyebrow">Norte del libro</div><blockquote>“${escapeHtml(state.project.premise)}”</blockquote><p>Esta frase no es una consigna decorativa: sirve para decidir qué entra, qué se desarrolla y qué queda fuera.</p></aside>
      </div>

      <div class="section-heading"><div><h3>Material conectado</h3><p>Las fuentes que sostienen este proyecto.</p></div><button class="button secondary" data-action="view" data-view="sources">Ver todas</button></div>
      <div class="source-mini-list">${state.sources.slice(0, 3).map((source) => `<div class="source-mini"><div class="source-symbol">${source.kind.includes("Aud") ? "✓" : "◫"}</div><div><div class="source-mini-title">${escapeHtml(source.title)}</div><div class="source-mini-meta">${escapeHtml(source.author)} · ${escapeHtml(source.pages)}</div></div></div>`).join("")}</div>
    `;
  },

  sources() {
    return `
      <section class="view-intro"><div><div class="eyebrow">Base documental</div><h2>Fuentes con contexto</h2><p>Cada documento puede conservar su procedencia, su aporte y sus límites. El texto no se vuelve automáticamente verdad por estar importado.</p></div><div class="source-toolbar"><button class="button secondary" data-action="import-file">Importar archivo</button><button class="button primary" data-action="open-source-dialog">+ Añadir nota</button></div></section>
      <div class="source-search-wrap"><span class="search-symbol">⌕</span><input id="source-search" value="${escapeHtml(sourceFilter)}" placeholder="Buscar por título, autor, nota o contenido..." aria-label="Buscar fuentes"></div>
      <div id="source-grid" class="source-grid">${sourceGridMarkup()}</div>
    `;
  },

  evidence() {
    const counts = ["Hecho", "Inferencia", "Hipótesis", "Criterio editorial"].map((type) => ({ type, count: state.evidence.filter((item) => item.type === type).length }));
    const supportedCount = state.evidence.filter((item) => (item.supportingText || "").trim()).length;
    return `
      <section class="view-intro"><div><div class="eyebrow">Trazabilidad del pensamiento</div><h2>Registro de evidencias</h2><p>Separá lo que la fuente dice, lo que vos inferís y lo que todavía querés comprobar. Cada afirmación puede quedar atada a una fuente y una ubicación.</p></div><div class="meta-chip">${state.evidence.length} registros · ${supportedCount} con respaldo</div></section>
      <div class="evidence-summary-grid">${counts.map((item) => `<div class="evidence-summary"><div class="evidence-type ${evidenceTypeClass(item.type)}">${escapeHtml(item.type)}</div><div class="evidence-summary-count">${item.count}</div></div>`).join("")}</div>
      <div class="evidence-layout">
        <div>
          <div class="panel panel-pad"><div class="eyebrow">Nueva afirmación</div><h3 style="margin-top:7px">Registrar una pieza de conocimiento</h3><form id="new-evidence-form" class="evidence-form" style="margin-top:15px"><label>Afirmación<textarea id="new-evidence-statement" name="statement" aria-label="Afirmación" required rows="3" placeholder="Qué querés sostener, discutir o recordar"></textarea></label><label>Fragmento o referencia de respaldo<textarea id="new-evidence-supporting-text" name="supportingText" aria-label="Fragmento o referencia de respaldo" rows="3" placeholder="Copiá el pasaje, resumí la idea o anotá qué parte de la fuente la sostiene">${escapeHtml(evidenceDraft.supportingText)}</textarea></label><div class="evidence-form-grid"><label>Clasificación<select id="new-evidence-type" name="type" aria-label="Clasificación"><option>Hecho</option><option>Inferencia</option><option>Hipótesis</option><option>Criterio editorial</option></select></label><label>Fuente<select id="new-evidence-source" name="sourceId" aria-label="Fuente"><option value="">Sin fuente todavía</option>${state.sources.map((source) => `<option value="${escapeHtml(source.id)}" ${source.id === evidenceDraft.sourceId ? "selected" : ""}>${escapeHtml(source.title)}</option>`).join("")}</select></label><label>Ubicación<input id="new-evidence-location" name="location" aria-label="Ubicación" value="${escapeHtml(evidenceDraft.location)}" placeholder="Ej. p. 42 o capítulo 2"></label></div><p class="form-hint">El fragmento es opcional al registrar, pero conviene completarlo antes de dar una afirmación por adoptada.</p><button class="button primary" type="submit">Registrar evidencia</button></form></div>
          <div class="source-search-wrap evidence-search"><span class="search-symbol">⌕</span><input id="evidence-search" value="${escapeHtml(evidenceFilter)}" placeholder="Buscar afirmaciones..." aria-label="Buscar evidencias"></div>
          <div id="evidence-list" class="evidence-list">${evidenceListMarkup()}</div>
        </div>
        <aside class="panel panel-pad evidence-guide"><div class="eyebrow">Regla de uso</div><h3 style="margin-top:8px">No mezclar niveles</h3><p>Un hecho se apoya en una fuente. Una inferencia explica una relación. Una hipótesis espera confirmación. Un criterio editorial describe cómo vas a tratar el material.</p><div class="guide-example"><span class="evidence-type hecho">Hecho</span><span>“La fuente afirma X”</span></div><div class="guide-example"><span class="evidence-type inferencia">Inferencia</span><span>“Esto sugiere Y”</span></div><div class="guide-example"><span class="evidence-type hipótesis">Hipótesis</span><span>“Necesito comprobar Z”</span></div></aside>
      </div>
    `;
  },

  traceability() {
    const linkedEvidence = state.evidence.filter((item) => item.sourceId && sourceById(item.sourceId));
    const map = state.evidence.map((item) => {
      const source = sourceById(item.sourceId);
      const chapters = source ? state.chapters.filter((chapter) => chapter.sources.includes(source.id)) : [];
      return { item, source, chapters };
    });
    return `
      <section class="view-intro"><div><div class="eyebrow">Afirmación → evidencia → fuente</div><h2>Mapa de trazabilidad</h2><p>Una vista derivada del proyecto para seguir qué afirmaciones tienen respaldo, de dónde viene ese respaldo y en qué capítulos aparece conectada la fuente.</p></div><div class="meta-chip">${linkedEvidence.length} de ${state.evidence.length} con fuente</div></section>
      <div class="traceability-note panel panel-pad"><strong>Cómo leerlo:</strong> el vínculo con los capítulos se infiere a partir de la fuente conectada al capítulo. No significa que la fuente sostenga automáticamente todo lo que allí se escribe; esa comprobación sigue siendo editorial.</div>
      <div class="traceability-list">${map.length ? map.map(({ item, source, chapters }) => `<article class="traceability-card ${source ? "" : "traceability-unlinked"}"><div class="traceability-card-head"><span class="evidence-type ${evidenceTypeClass(item.type)}">${escapeHtml(item.type)}</span><span class="status-pill ${item.status === "Adoptado" ? "revisado" : item.status === "Descartado" ? "pendiente" : "en-proceso"}">${escapeHtml(item.status)}</span></div><h3>${escapeHtml(item.statement || "Afirmación sin texto")}</h3><div class="traceability-flow"><div><div class="trace-label">Evidencia</div><p>${escapeHtml(item.supportingText || "Sin fragmento o referencia conservada")}</p><span class="muted">${escapeHtml(item.location || "Sin ubicación")}</span></div><div class="trace-arrow" aria-hidden="true">→</div><div><div class="trace-label">Fuente</div><p>${source ? escapeHtml(source.title) : "Sin fuente vinculada"}</p><span class="muted">${source ? escapeHtml(sourceCitation(source)) : "Completá el vínculo desde Evidencias"}</span></div><div class="trace-arrow" aria-hidden="true">→</div><div><div class="trace-label">Capítulos conectados</div>${chapters.length ? `<ul>${chapters.map((chapter) => `<li>${escapeHtml(chapter.title)}</li>`).join("")}</ul>` : `<p class="muted">Ninguno todavía</p>`}</div></div><div class="traceability-actions"><button class="text-button" data-action="view-evidence" data-evidence-id="${escapeHtml(item.id)}">Ver evidencia</button>${source ? `<button class="text-button" data-action="view-source" data-source-id="${escapeHtml(source.id)}">Ver fuente</button>` : ""}</div></article>`).join("") : `<div class="empty-state">Todavía no hay afirmaciones para mapear. Registrá una evidencia y vinculala a una fuente.</div>`}</div>
    `;
  },

  structure() {
    return `
      <section class="view-intro"><div><div class="eyebrow">Diseño del libro</div><h2>Arquitectura antes de rellenar</h2><p>Definí qué tiene que lograr cada capítulo y qué fuentes lo sostienen. El texto puede crecer después; el propósito debe estar claro primero.</p></div><div class="meta-chip">${state.chapters.length} capítulos · ${state.chapters.filter((c) => c.status === "Pendiente").length} pendientes</div></section>
      <div class="structure-list">${state.chapters.map(chapterEditor).join("")}</div>
      <div class="panel panel-pad new-chapter-panel"><div class="eyebrow">Agregar una pieza</div><h3 style="margin-top:7px">Nuevo capítulo</h3><form id="new-chapter-form" class="new-chapter-form" style="margin-top:15px"><label>Título<input name="title" required placeholder="El título de trabajo"></label><label>Objetivo<input name="purpose" required placeholder="Qué tiene que demostrar"></label><label>Páginas<input name="pages" placeholder="Ej. 111–130"></label><button class="button primary" type="submit">Agregar</button></form></div>
    `;
  },

  manuscript() {
    const chapter = chapterById(selectedChapterId) || state.chapters[0];
    if (!chapter) return `<div class="empty-state">Creá un capítulo desde Arquitectura para empezar a escribir.</div>`;
    selectedChapterId = chapter.id;
    const connectedSources = chapter.sources.map(sourceById).filter(Boolean);
    return `
      <section class="view-intro"><div><div class="eyebrow">Escritura acompañada</div><h2>Manuscrito</h2><p>Escribí con el propósito del capítulo y sus fuentes a la vista. Cronista guarda cada cambio en este navegador.</p></div><button class="button secondary" data-action="save-manuscript">Guardar ahora</button></section>
      <div class="manuscript-layout">
        <div class="panel editor-panel">
          <div class="editor-toolbar"><select id="chapter-selector" aria-label="Elegir capítulo">${state.chapters.map((item) => `<option value="${item.id}" ${item.id === chapter.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}</select><span id="editor-status" class="editor-status">${storageState === "starting" ? "Preparando guardado…" : storageState === "error" ? "⚠ No se pudo guardar" : "Guardado local"}</span></div>
          <textarea id="manuscript-editor" spellcheck="true" placeholder="Empezá a escribir el capítulo...">${escapeHtml(chapter.draft)}</textarea>
          <div class="editor-footer"><span id="editor-word-count">${wordCount(chapter.draft).toLocaleString("es-UY")} palabras</span><span>Meta del proyecto: ${state.project.targetWords.toLocaleString("es-UY")}</span></div>
        </div>
        <aside class="side-stack">
          <div class="panel panel-pad"><div class="eyebrow">Intención del capítulo</div><h3 style="margin-top:8px">${escapeHtml(chapter.title)}</h3><p style="margin:12px 0 0;color:var(--muted);font:12px/1.55 system-ui,sans-serif">${escapeHtml(chapter.purpose)}</p><div class="checklist"><div class="check-item"><span class="check-mark ${chapter.draft.trim() ? "" : "off"}">${chapter.draft.trim() ? "✓" : "·"}</span>Hay un primer cuerpo de texto</div><div class="check-item"><span class="check-mark ${chapter.sources.length ? "" : "off"}">${chapter.sources.length ? "✓" : "·"}</span>Hay fuentes conectadas</div><div class="check-item"><span class="check-mark ${wordCount(chapter.draft) >= 180 ? "" : "off"}">${wordCount(chapter.draft) >= 180 ? "✓" : "·"}</span>Supera un umbral inicial de desarrollo</div></div></div>
          <div class="panel panel-pad"><div class="eyebrow">Fuentes conectadas</div><div class="source-links">${connectedSources.length ? connectedSources.map((source) => `<div class="source-link">${escapeHtml(source.title)}<br><span style="color:var(--muted)">${escapeHtml(source.pages)}</span></div>`).join("") : `<div class="muted">Todavía no hay fuentes conectadas.</div>`}</div></div>
        </aside>
      </div>
    `;
  },

  audit() {
    const checks = auditChecks();
    const score = auditScore();
    return `
      <section class="view-intro"><div><div class="eyebrow">Control de calidad</div><h2>Auditor editorial</h2><p>Un control legible para detectar huecos antes de que se conviertan en problemas de estructura. No reemplaza tu criterio ni inventa certezas.</p></div><div class="meta-chip">Actualizado ${escapeHtml(formatDate(state.project.updatedAt))}</div></section>
      <div class="audit-summary"><div class="audit-summary-top"><div><div class="eyebrow">Estado del proyecto</div><div style="margin-top:7px;font-size:19px">${score >= 75 ? "Base sólida para seguir escribiendo" : "Hay algunos huecos que conviene atender"}</div></div><div class="audit-score">${score}%</div></div><div class="progress-track"><div class="progress-fill" style="width:${score}%"></div></div><p>La puntuación resume controles mecánicos. Las decisiones históricas, narrativas y éticas siguen siendo tuyas.</p></div>
      <div class="audit-grid">${checks.map((check) => `<article class="audit-card ${check.ok ? "ok" : "warn"}"><div class="audit-card-head"><span class="audit-icon">${check.ok ? "✓" : "!"}</span><span class="status-pill ${check.ok ? "revisado" : "en-proceso"}">${check.ok ? "Listo" : "Revisar"}</span></div><h3>${escapeHtml(check.title)}</h3><p>${escapeHtml(check.detail)}</p></article>`).join("")}</div>
    `;
  },

  study() {
    const questions = buildQuestions();
    return `
      <section class="study-hero"><div class="eyebrow">Lectura activa</div><h2>Modo estudio</h2><p>Convertí el trabajo editorial en comprensión: estas preguntas te obligan a explicar el argumento, ubicar sus tensiones y reconocer qué todavía no está demostrado.</p></section>
      <div class="section-heading"><div><h3>Preguntas para pensar</h3><p>Se generan desde la arquitectura y las notas del proyecto.</p></div><div class="meta-chip">${questions.length} preguntas</div></div>
      <div class="question-grid">${questions.map((question, index) => `<article class="question-card"><div class="question-number">PREGUNTA ${String(index + 1).padStart(2, "0")}</div><h3>${escapeHtml(question.question)}</h3><div class="answer">${escapeHtml(question.answer)}</div><button class="reveal-button" data-action="reveal-answer">Mostrar orientación →</button></article>`).join("")}</div>
    `;
  }
};

function sourceCard(source) {
  const words = sourceWordCount(source);
  const fullText = source.content || "";
  const citation = sourceCitation(source);
  const archivedLabel = source.archived ? `<span class="status-pill pendiente">Archivada</span>` : "";
  return `<article class="source-card ${source.archived ? "is-archived" : ""}" data-source-id="${escapeHtml(source.id)}"><div class="source-card-top"><div><div class="source-kind">${escapeHtml(source.kind)}</div><h3>${escapeHtml(source.title)}</h3><div class="source-author">${escapeHtml(source.author || "Procedencia no indicada")}</div></div><div class="source-badge">${source.imported ? "Importada" : "Conectada"}</div></div><div class="source-meta"><span class="meta-chip">${escapeHtml(source.pages || "Sin paginar")}</span>${words ? `<span class="meta-chip">${words.toLocaleString("es-UY")} palabras conservadas</span>` : ""}${archivedLabel}</div><p class="source-citation">${escapeHtml(citation)}${source.accessedAt ? ` · Consultada el ${escapeHtml(source.accessedAt)}` : ""}</p><p class="source-note">${escapeHtml(source.note || "Sin nota de trabajo todavía.")}</p>${source.location ? sourceLocationMarkup(source.location) : ""}${source.url ? sourceLocationMarkup(source.url) : ""}${source.excerpt ? `<div class="source-preview">${escapeHtml(source.excerpt)}</div>` : ""}${fullText ? `<details class="source-full-text"><summary>Leer contenido completo</summary><pre>${escapeHtml(fullText)}</pre><div class="source-reader-hint">Seleccioná un pasaje y después elegí “Crear evidencia desde este texto”.</div></details>` : `<div class="source-empty-content">Contenido completo no incorporado</div>`}<div class="source-card-actions"><button class="text-button" data-action="compose-evidence" data-source-id="${escapeHtml(source.id)}">${fullText ? "Crear evidencia desde este texto" : "Crear evidencia vinculada"}</button><button class="text-button" data-action="edit-source" data-source-id="${escapeHtml(source.id)}">Editar</button><button class="text-button danger-text" data-action="delete-source" data-source-id="${escapeHtml(source.id)}">Eliminar</button></div></article>`;
}

function chapterEditor(chapter, index) {
  const sourceIds = Array.isArray(chapter.sources) ? chapter.sources : [];
  const connectedSources = sourceIds.map(sourceById).filter(Boolean);
  const sourceOptions = state.sources.length ? state.sources.map((source) => `<option value="${escapeHtml(source.id)}" ${sourceIds.includes(source.id) ? "selected" : ""}>${escapeHtml(source.title)}</option>`).join("") : `<option disabled>No hay fuentes en este proyecto</option>`;
  const chapterId = escapeHtml(chapter.id);
  return `<article class="chapter-editor"><div class="chapter-editor-head"><div><div class="chapter-number">CAPÍTULO ${String(index + 1).padStart(2, "0")}</div><h3>${escapeHtml(chapter.title)}</h3></div><span class="status-pill ${statusClass(chapter.status)}">${escapeHtml(chapter.status)}</span></div><div class="chapter-editor-grid"><label>Propósito<textarea data-chapter-field="purpose" data-chapter-id="${chapterId}">${escapeHtml(chapter.purpose)}</textarea></label><label>Páginas<input data-chapter-field="pages" data-chapter-id="${chapterId}" value="${escapeHtml(chapter.pages)}"></label><label>Fuentes<select class="source-picker" data-chapter-sources="${chapterId}" multiple size="${Math.min(Math.max(state.sources.length, 2), 4)}">${sourceOptions}</select></label></div><div class="chapter-editor-footer"><div class="tag-row">${connectedSources.length ? connectedSources.map((source) => `<span class="source-tag">${escapeHtml(source.title)}</span>`).join("") : `<span class="muted">Sin fuentes conectadas</span>`}</div><label style="display:flex;align-items:center;gap:6px">Estado<select data-chapter-field="status" data-chapter-id="${chapterId}" style="width:auto;padding:5px 8px"><option ${chapter.status === "Pendiente" ? "selected" : ""}>Pendiente</option><option ${chapter.status === "Borrador" ? "selected" : ""}>Borrador</option><option ${chapter.status === "En proceso" ? "selected" : ""}>En proceso</option><option ${chapter.status === "Revisado" ? "selected" : ""}>Revisado</option></select></label></div></article>`;
}

function filteredSources() {
  const query = sourceFilter.trim().toLowerCase();
  if (!query) return state.sources;
  return state.sources.filter((source) => [source.title, source.kind, source.author, source.location, source.url, source.edition, source.publisher, source.year, source.note, source.excerpt, source.content].join(" ").toLowerCase().includes(query));
}

function sourceGridMarkup() {
  const sources = filteredSources();
  if (!sources.length) return `<div class="empty-state">${sourceFilter ? "No hay fuentes que coincidan con esa búsqueda." : "Todavía no hay fuentes. Añadí una nota o importá un archivo para empezar."}</div>`;
  return sources.map(sourceCard).join("");
}

function evidenceTypeClass(type) {
  return String(type).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "hipotesis";
}

function filteredEvidence() {
  const query = evidenceFilter.trim().toLowerCase();
  if (!query) return state.evidence;
  return state.evidence.filter((item) => {
    const source = sourceById(item.sourceId);
    return [item.statement, item.type, item.location, item.status, item.note, item.supportingText, source?.title || ""].join(" ").toLowerCase().includes(query);
  });
}

function evidenceListMarkup() {
  const items = filteredEvidence();
  if (!items.length) return `<div class="empty-state">${evidenceFilter ? "No hay evidencias que coincidan con esa búsqueda." : "Todavía no registraste afirmaciones. Empezá con una idea importante del texto."}</div>`;
  return items.map(evidenceCard).join("");
}

function evidenceCard(item) {
  const source = sourceById(item.sourceId);
  const support = item.supportingText || "";
  const sourceOptions = `<option value="">Sin fuente todavía</option>${state.sources.map((sourceItem) => `<option value="${escapeHtml(sourceItem.id)}" ${sourceItem.id === item.sourceId ? "selected" : ""}>${escapeHtml(sourceItem.title)}</option>`).join("")}`;
  const evidenceId = escapeHtml(item.id);
  return `<article class="evidence-card ${item.archived ? "is-archived" : ""}"><div class="evidence-card-head"><span class="evidence-type ${evidenceTypeClass(item.type)}">${escapeHtml(item.type)}</span><span class="status-pill ${item.status === "Adoptado" ? "revisado" : item.status === "Descartado" ? "pendiente" : "en-proceso"}">${escapeHtml(item.status)}${item.archived ? " · Archivada" : ""}</span></div><label>Afirmación<textarea data-evidence-field="statement" data-evidence-id="${evidenceId}" rows="3">${escapeHtml(item.statement)}</textarea></label><label>Fragmento o referencia de respaldo<textarea data-evidence-field="supportingText" data-evidence-id="${evidenceId}" rows="3" placeholder="Pasaje textual, paráfrasis o referencia precisa">${escapeHtml(support)}</textarea></label>${support.trim() ? `<blockquote class="evidence-support">${escapeHtml(support)}</blockquote>` : `<div class="evidence-support-empty">Sin fragmento de respaldo todavía</div>`}<div class="evidence-meta-grid"><label>Clasificación<select data-evidence-field="type" data-evidence-id="${evidenceId}"><option ${item.type === "Hecho" ? "selected" : ""}>Hecho</option><option ${item.type === "Inferencia" ? "selected" : ""}>Inferencia</option><option ${item.type === "Hipótesis" ? "selected" : ""}>Hipótesis</option><option ${item.type === "Criterio editorial" ? "selected" : ""}>Criterio editorial</option></select></label><label>Fuente<select data-evidence-field="sourceId" data-evidence-id="${evidenceId}">${sourceOptions}</select></label><label>Ubicación<input data-evidence-field="location" data-evidence-id="${evidenceId}" value="${escapeHtml(item.location)}" placeholder="p. 42"></label><label>Estado<select data-evidence-field="status" data-evidence-id="${evidenceId}"><option ${item.status === "Por revisar" ? "selected" : ""}>Por revisar</option><option ${item.status === "En discusión" ? "selected" : ""}>En discusión</option><option ${item.status === "Adoptado" ? "selected" : ""}>Adoptado</option><option ${item.status === "Descartado" ? "selected" : ""}>Descartado</option></select></label></div><label>Nota de trabajo<textarea data-evidence-field="note" data-evidence-id="${evidenceId}" rows="2" placeholder="Qué falta confirmar o por qué importa">${escapeHtml(item.note)}</textarea></label><div class="evidence-card-footer">${source ? `Vinculada a <span>${escapeHtml(source.title)}</span> <button class="text-button evidence-source-button" data-action="view-source" data-source-id="${escapeHtml(source.id)}">Ver fuente</button>` : "Sin fuente vinculada todavía"}<button class="text-button danger-text" data-action="delete-evidence" data-evidence-id="${evidenceId}">Eliminar</button></div></article>`;
}

function auditChecks() {
  const hasChapters = state.chapters.length > 0;
  const allPurposes = hasChapters && state.chapters.every((chapter) => chapter.purpose.trim());
  const allSources = hasChapters && state.chapters.every((chapter) => chapter.sources.length > 0);
  const hasDraft = state.chapters.some((chapter) => wordCount(chapter.draft) > 0);
  const hasDoubts = state.evidence.some((item) => item.type === "Hipótesis" || item.status === "Por revisar" || item.status === "En discusión");
  const hasProgress = state.chapters.some((chapter) => wordCount(chapter.draft) >= 180);
  const hasEvidence = state.evidence.length > 0;
  const supportedEvidenceCount = state.evidence.filter((item) => (item.supportingText || "").trim()).length;
  const hasSupport = supportedEvidenceCount > 0;
  const unlinkedEvidenceCount = state.evidence.filter((item) => !item.sourceId || !sourceById(item.sourceId)).length;
  const unusedSourceCount = state.sources.filter((source) => !state.chapters.some((chapter) => chapter.sources.includes(source.id)) && !state.evidence.some((item) => item.sourceId === source.id)).length;
  const uniqueSourceLinks = new Set(state.chapters.flatMap((chapter) => chapter.sources)).size;
  return [
    { ok: allPurposes, title: "Cada capítulo tiene un propósito", detail: allPurposes ? "La arquitectura explica qué debe conseguir cada tramo." : "Hay capítulos sin una intención explícita." },
    { ok: allSources, title: "La estructura tiene fuentes conectadas", detail: allSources ? `${uniqueSourceLinks} fuentes están relacionadas con la arquitectura.` : "Algún capítulo todavía está separado de su base documental." },
    { ok: hasDraft, title: "El manuscrito ya tiene materia", detail: hasDraft ? `${totalWords().toLocaleString("es-UY")} palabras están disponibles para revisar.` : "Todavía no hay un cuerpo de texto para auditar." },
    { ok: hasProgress, title: "Existe al menos un desarrollo sustantivo", detail: hasProgress ? "Hay un capítulo que ya superó el umbral inicial de desarrollo." : "Conviene llevar un capítulo a una primera versión más completa." },
    { ok: hasDoubts, title: "Las dudas editoriales están visibles", detail: hasDoubts ? "Las ambigüedades permanecen registradas y no se presentan como certezas." : "Añadí un registro de dudas para separar control y conjetura." },
    { ok: hasEvidence, title: "Las afirmaciones importantes están registradas", detail: hasEvidence ? `${state.evidence.length} piezas distinguen hechos, inferencias y decisiones de trabajo.` : "Registrá al menos una afirmación para empezar a construir trazabilidad." },
    { ok: hasSupport, title: "Hay respaldos textuales conservados", detail: hasSupport ? `${supportedEvidenceCount} evidencias conservan un fragmento o referencia para volver a la fuente.` : "Completá el fragmento de respaldo en las evidencias que quieras cerrar." },
    { ok: hasEvidence && unlinkedEvidenceCount === 0, title: "Las evidencias tienen fuente identificada", detail: unlinkedEvidenceCount ? `${unlinkedEvidenceCount} evidencia(s) todavía no tienen una fuente válida vinculada.` : "Cada evidencia registrada apunta a una fuente del proyecto." },
    { ok: state.sources.length === 0 || unusedSourceCount === 0, title: "No hay fuentes aisladas", detail: unusedSourceCount ? `${unusedSourceCount} fuente(s) todavía no están conectadas a capítulos ni evidencias.` : "Las fuentes tienen al menos un vínculo de trabajo." },
    { ok: false, title: "Revisión de hechos e inferencias", detail: "Este control requiere lectura humana: Cronista puede señalar zonas, pero no debe decidir por vos qué es histórico." }
  ];
}

function auditScore() {
  const checks = auditChecks();
  return Math.round((checks.filter((check) => check.ok).length / checks.length) * 100);
}

function buildQuestions() {
  const first = state.chapters[0];
  return [
    { question: "¿Qué diferencia hay entre el tema de un proyecto y la pregunta que lo orienta?", answer: "El tema indica de qué se ocupa el trabajo; la pregunta rectora organiza la selección, la estructura y el tipo de respuesta que el texto intenta construir." },
    { question: "¿Cómo puede un proyecto tener un eje común y, al mismo tiempo, conservar tensiones internas?", answer: "El eje común ordena la lectura, pero no obliga a borrar desacuerdos, cambios de perspectiva o conflictos entre las fuentes y la interpretación." },
    { question: `¿Qué tendría que demostrar el capítulo “${first ? first.title : "inicial"}” para que el lector quiera seguir?`, answer: first ? first.purpose : "Definí un propósito concreto antes de seguir desarrollando el texto." },
    { question: "¿Qué diferencia hay entre una errata probable y una corrección editorial segura?", answer: "La primera debe conservarse como duda si no hay evidencia suficiente; la segunda puede corregirse cuando la comparación con la imagen vuelve la lectura inequívoca." },
    { question: "¿Qué queda afuera de tu marco y por qué esa exclusión importa?", answer: "Toda categoría histórica produce bordes. Hacerlos visibles evita presentar una selección parcial como si fuera la totalidad de la sociedad." },
    { question: "¿Cuál es la tensión central que debería atravesar el libro completo?", answer: state.project.premise },
    ...(state.evidence.length ? [{ question: `¿Qué tendrías que comprobar antes de convertir “${state.evidence[0].statement.slice(0, 72)}${state.evidence[0].statement.length > 72 ? "…" : ""}” en una afirmación definitiva?`, answer: "Revisá la fuente, la ubicación y la clasificación elegida. Si es una inferencia, separala claramente de lo que la fuente afirma de forma literal." }] : [])
  ];
}

function syncEditorStatus(message = "") {
  const editor = $("#manuscript-editor");
  const status = $("#editor-status");
  const count = $("#editor-word-count");
  if (editor && count) count.textContent = `${wordCount(editor.value).toLocaleString("es-UY")} palabras`;
  if (status) status.textContent = message || (storageState === "starting" ? "Preparando guardado…" : storageState === "saving" ? "Guardando…" : storageState === "error" ? "⚠ No se pudo guardar" : "Guardado local");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openSourceDialog(sourceId = "") {
  const dialog = $("#source-dialog");
  const form = $("#source-form");
  const source = sourceId ? sourceById(sourceId) : null;
  form.reset();
  form.elements.sourceId.value = source?.id || "";
  $("#source-dialog-kicker").textContent = source ? "Editar fuente" : "Nueva fuente";
  $("#source-dialog-title").textContent = source ? "Revisar material del proyecto" : "Sumar material al proyecto";
  $("#source-dialog-submit").textContent = source ? "Guardar cambios" : "Guardar fuente";
  if (source) {
    ["title", "kind", "author", "location", "url", "edition", "publisher", "year", "accessedAt", "note", "content"].forEach((field) => {
      if (form.elements[field]) form.elements[field].value = source[field] || "";
    });
  }
  dialog.showModal();
}

["source-dialog", "project-dialog"].forEach((dialogId) => {
  const dialog = $(`#${dialogId}`);
  dialog?.addEventListener("close", () => dialog.querySelector("form")?.reset());
});

function exportProject() {
  const lines = [`# ${state.project.title}`, "", state.project.description, "", `## Norte`, "", state.project.premise, "", "## Fuentes y referencias", "", ...state.sources.map((source) => `${sourceReferenceMarkdown(source)}${source.note ? `\n  - Nota: ${source.note}` : ""}`), "", "## Evidencias", "", ...(state.evidence.length ? state.evidence.flatMap((item) => {
    const source = sourceById(item.sourceId);
    return [`- **${item.type}** ${item.statement} — ${source ? source.title : "Sin fuente"} (${item.location || "sin ubicación"}). Estado: ${item.status}.`, item.supportingText ? `  - Respaldo: ${item.supportingText}` : "  - Respaldo: _Sin fragmento conservado._"];
  }) : ["_No hay evidencias registradas._"]), "", "## Arquitectura", "", ...state.chapters.map((chapter, index) => `### ${index + 1}. ${chapter.title}\n\n**Propósito:** ${chapter.purpose}\n\n**Páginas:** ${chapter.pages}\n\n**Estado:** ${chapter.status}\n\n${chapter.draft || "_Sin borrador todavía._"}\n`), "", "## Auditoría", "", `Puntuación mecánica: ${auditScore()}%.`, "La revisión de hechos e inferencias requiere lectura humana.", ""];
  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.project.title.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, "-").replace(/-+/g, "-")}-cronista.md`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Proyecto exportado en Markdown");
}

function exportJson() {
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.project.title.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, "-").replace(/-+/g, "-")}-cronista.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Copia JSON guardada");
}

document.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;
  if (action === "view") { activeView = actionTarget.dataset.view; render(); return; }
  if (action === "open-project-dialog") { $("#project-dialog").showModal(); return; }
  if (action === "open-source-dialog") { openSourceDialog(); return; }
  if (action === "rename-project") { renameProject(); return; }
  if (action === "archive-project") { archiveProject(); return; }
  if (action === "delete-project") { deleteProject(); return; }
  if (action === "edit-source") { openSourceDialog(actionTarget.dataset.sourceId); return; }
  if (action === "delete-source") { deleteSource(actionTarget.dataset.sourceId); return; }
  if (action === "delete-evidence") { deleteEvidence(actionTarget.dataset.evidenceId); return; }
  if (action === "import-file") { $("#file-input").click(); return; }
  if (action === "import-json") { $("#project-file-input").click(); return; }
  if (action === "export") { exportProject(); return; }
  if (action === "export-json") { exportJson(); return; }
  if (action === "view-source") { activeView = "sources"; sourceFilter = sourceById(actionTarget.dataset.sourceId)?.title || ""; render(); return; }
  if (action === "view-evidence") { activeView = "evidence"; evidenceFilter = evidenceById(actionTarget.dataset.evidenceId)?.statement || ""; render(); return; }
  if (action === "compose-evidence") {
    const source = sourceById(actionTarget.dataset.sourceId);
    const selection = selectedSourceSelection.sourceId === source?.id ? selectedSourceSelection.text : "";
    selectedSourceSelection = { sourceId: "", text: "" };
    evidenceDraft = { sourceId: source?.id || "", supportingText: selection, location: "" };
    evidenceFilter = "";
    activeView = "evidence";
    render();
    setTimeout(() => { const statement = $("#new-evidence-form [name=statement]"); statement?.focus(); statement?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 0);
    showToast(selection ? "Fragmento preparado para una evidencia" : "Fuente vinculada para una nueva evidencia");
    return;
  }
  if (action === "save-manuscript") { persist().then((result) => { syncEditorStatus(result.ok ? "Guardado ahora" : "⚠ No se pudo guardar"); showToast(result.ok ? "Manuscrito guardado localmente" : "No se pudo guardar. Exportá una copia."); }); return; }
  if (action === "reset-demo") {
    if (window.confirm("Esto reemplaza los cambios guardados de este proyecto por su versión inicial. ¿Continuar?")) { const replacement = cloneInitialProject(state); state = replacement; sourceFilter = ""; selectedChapterId = state.chapters[0]?.id || null; persist(); render(); showToast("Proyecto de prueba restaurado"); }
    return;
  }
  if (action === "reveal-answer") { actionTarget.closest(".question-card").classList.toggle("revealed"); actionTarget.textContent = actionTarget.closest(".question-card").classList.contains("revealed") ? "Ocultar orientación ↑" : "Mostrar orientación →"; }
});

document.addEventListener("mouseup", (event) => {
  const textContainer = event.target.closest(".source-full-text pre");
  if (!textContainer) return;
  const sourceCard = textContainer.closest(".source-card");
  const text = window.getSelection()?.toString().trim() || "";
  if (sourceCard && text) selectedSourceSelection = { sourceId: sourceCard.dataset.sourceId, text };
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("[data-evidence-field]")) {
    const item = state.evidence.find((evidence) => evidence.id === target.dataset.evidenceId);
    if (item) { item[target.dataset.evidenceField] = target.value; persist(); }
    return;
  }
  if (target.matches("[data-chapter-field]")) {
    const chapter = chapterById(target.dataset.chapterId);
    if (chapter) { chapter[target.dataset.chapterField] = target.value; persist(); }
    return;
  }
  if (target.id === "source-search") {
    sourceFilter = target.value;
    const grid = $("#source-grid");
    if (grid) grid.innerHTML = sourceGridMarkup();
    return;
  }
  if (target.id === "evidence-search") {
    evidenceFilter = target.value;
    const list = $("#evidence-list");
    if (list) list.innerHTML = evidenceListMarkup();
    return;
  }
  if (target.id === "manuscript-editor") {
    const chapter = chapterById(selectedChapterId);
    if (!chapter) return;
    chapter.draft = target.value;
    syncEditorStatus("Guardando…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      const result = await persist();
      syncEditorStatus(result.ok ? "Guardado local" : "⚠ No se pudo guardar — exportá una copia");
      if (!result.ok) showToast("No se pudo guardar. Exportá una copia.");
    }, 450);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "project-selector") {
    persist();
    const nextProject = workspace.projects.find((project) => project.project.id === event.target.value);
    if (nextProject) {
      state = nextProject;
      workspace.activeProjectId = state.project.id;
      sourceFilter = "";
      selectedChapterId = state.chapters[0]?.id || null;
      activeView = "overview";
      persist();
      render();
      showToast(`Proyecto activo: ${state.project.title}`);
    }
    return;
  }
  if (event.target.id === "chapter-selector") { selectedChapterId = event.target.value; render(); return; }
  if (event.target.matches("[data-evidence-field]")) {
    const item = state.evidence.find((evidence) => evidence.id === event.target.dataset.evidenceId);
    if (item) { item[event.target.dataset.evidenceField] = event.target.value; persist(); render(); showToast("Evidencia actualizada"); }
    return;
  }
  if (event.target.matches("[data-chapter-sources]")) {
    const chapter = chapterById(event.target.dataset.chapterSources);
    if (chapter) { chapter.sources = [...event.target.selectedOptions].map((option) => option.value); persist(); render(); showToast("Fuentes del capítulo actualizadas"); }
    return;
  }
  if (event.target.matches("[data-chapter-field]")) { const chapter = chapterById(event.target.dataset.chapterId); if (chapter) { chapter[event.target.dataset.chapterField] = event.target.value; persist(); } }
});

$("#source-form").addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const title = String(form.get("title") || "").trim();
  if (!title) { showToast("Poné un nombre para la fuente"); return; }
  const content = String(form.get("content") || "").trim();
  const sourceId = String(form.get("sourceId") || "").trim();
  const existingSource = sourceId ? sourceById(sourceId) : null;
  const sourceData = { title, kind: String(form.get("kind") || "Fuente").trim(), author: String(form.get("author") || "Procedencia no indicada").trim(), location: String(form.get("location") || "").trim(), url: String(form.get("url") || "").trim(), edition: String(form.get("edition") || "").trim(), publisher: String(form.get("publisher") || "").trim(), year: String(form.get("year") || "").trim(), accessedAt: String(form.get("accessedAt") || "").trim(), pages: existingSource?.pages || "Sin paginar", note: String(form.get("note") || "").trim(), excerpt: content.replace(/\s+/g, " ").slice(0, 430), content, wordCount: wordCount(content), imported: existingSource ? Boolean(existingSource.imported) : true, archived: existingSource ? Boolean(existingSource.archived) : false };
  if (sourceId) {
    const index = state.sources.findIndex((source) => source.id === sourceId);
    if (index >= 0) state.sources[index] = { ...state.sources[index], ...sourceData };
  } else {
    state.sources.push({ id: newId("source"), ...sourceData });
  }
  event.currentTarget.reset();
  $("#source-dialog").close();
  render();
  persistAndNotify(sourceId ? "Fuente actualizada" : "Fuente agregada al proyecto");
});

$("#project-form").addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  if (!title || !description) { showToast("Completá el nombre y la descripción del proyecto"); return; }
  const project = createEmptyProject({ title, type: form.get("type"), description, premise: form.get("premise"), targetWords: form.get("targetWords") });
  workspace.projects.push(project);
  state = project;
  workspace.activeProjectId = project.project.id;
  sourceFilter = "";
  selectedChapterId = null;
  activeView = "overview";
  persist();
  event.currentTarget.reset();
  $("#project-dialog").close();
  render();
  showToast("Nuevo proyecto creado");
});

$("#file-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const extension = file.name.split(".").pop().toLowerCase();
  let text = "";
  if (extension !== "pdf") {
    try { text = await file.text(); } catch { text = ""; }
  }
  const source = { id: newId("file"), title: file.name.replace(/\.[^.]+$/, "") || "Archivo importado", kind: extension.toUpperCase() === "MD" ? "Markdown importado" : `${extension.toUpperCase() || "Archivo"} importado`, author: "Archivo local", location: file.name, pages: `${Math.round(file.size / 1024)} KB`, note: extension === "pdf" ? "PDF agregado como referencia local. La extracción de texto se puede incorporar desde un TXT o Markdown asociado." : "Archivo importado desde este navegador. El contenido completo queda guardado localmente; revisalo antes de usarlo como evidencia.", excerpt: text.replace(/\s+/g, " ").trim().slice(0, 430), content: text, wordCount: wordCount(text), imported: true };
  state.sources.push(source);
  persist();
  event.target.value = "";
  render();
  showToast(`Fuente importada: ${file.name}`);
});

$("#project-file-input").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = normalizeProject(JSON.parse(await file.text()));
    const originalTitle = imported.project.title || "Proyecto importado";
    imported.project.id = newId("project");
    imported.project.title = workspace.projects.some((project) => project.project.title === originalTitle) ? `${originalTitle} (importado)` : originalTitle;
    workspace.projects.push(imported);
    state = imported;
    workspace.activeProjectId = state.project.id;
    sourceFilter = "";
    selectedChapterId = state.chapters[0]?.id || null;
    activeView = "overview";
    persist();
    render();
    showToast("Proyecto importado a la biblioteca");
  } catch (error) {
    console.warn("No se pudo importar la copia JSON", error);
    showToast("No se pudo leer esa copia JSON");
  } finally {
    event.target.value = "";
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "new-evidence-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    const statement = String(form.get("statement") || "").trim();
    if (!statement) return;
    state.evidence.push({
      id: newId("evidence"),
      statement,
      type: String(form.get("type") || "Hecho"),
      sourceId: String(form.get("sourceId") || ""),
      location: String(form.get("location") || "").trim(),
      status: "Por revisar",
      note: "",
      supportingText: String(form.get("supportingText") || "").trim()
    });
    evidenceDraft = { sourceId: "", supportingText: "", location: "" };
    persist();
    event.target.reset();
    render();
    showToast("Evidencia registrada");
    return;
  }
  if (event.target.id !== "new-chapter-form") return;
  event.preventDefault();
  const form = new FormData(event.target);
  const title = String(form.get("title") || "").trim();
  const purpose = String(form.get("purpose") || "").trim();
  if (!title || !purpose) { showToast("Completá el título y el objetivo del capítulo"); return; }
  const chapter = { id: newId("chapter"), title, purpose, pages: String(form.get("pages") || "Por definir").trim() || "Por definir", status: "Pendiente", sources: [], draft: "" };
  state.chapters.push(chapter);
  selectedChapterId = chapter.id;
  persist();
  render();
  showToast("Capítulo agregado a la arquitectura");
});

render();
storageReady = initializeStorage();
