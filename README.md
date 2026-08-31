# Cronista

**Cronista es una mesa de trabajo local para convertir fuentes, apuntes y borradores en libros, investigaciones y textos de estudio más claros, trazables y revisables.**

No es un procesador de texto genérico ni una máquina que decide qué es verdad. Ayuda a ordenar el trabajo intelectual para que cada capítulo tenga un propósito, cada afirmación pueda volver a una fuente y cada duda quede visible.

## Explicado sin tecnicismos

Cronista es una mesa de trabajo para investigar y escribir libros, ensayos y otros proyectos largos.

Permite reunir libros, PDFs, apuntes y entrevistas; ordenar qué aporta cada fuente; guardar fragmentos importantes con su página; separar los hechos de las interpretaciones; organizar capítulos y redactar el manuscrito.

También incluye un mapa de trazabilidad para saber de dónde sale cada afirmación y una auditoría editorial que señala qué partes necesitan más respaldo o revisión.

Aunque el menú parezca amplio, no hace falta usar todo desde el principio. Se puede empezar de manera muy simple:

1. Crear un proyecto.
2. Agregar una fuente, incluso un PDF.
3. Registrar una idea o evidencia.
4. Organizar un capítulo.
5. Escribir y revisar.

Cronista funciona localmente en el navegador: tus textos y documentos no se suben automáticamente a internet. La herramienta acompaña el proceso desde la primera lectura hasta un manuscrito más claro, ordenado y verificable.

## Para qué sirve

Cronista puede servirte si estás:

- investigando un libro histórico o documental;
- escribiendo un ensayo, una novela histórica o un texto de estudio;
- trabajando con PDFs, libros, apuntes, entrevistas o archivos propios;
- intentando separar lo que una fuente afirma de lo que vos interpretás;
- revisando un manuscrito antes de compartirlo o publicarlo.

El recorrido básico es sencillo:

1. **Reunir:** creás un proyecto y agregás fuentes, enlaces, notas o archivos.
2. **Distinguir:** registrás hechos, inferencias, hipótesis y criterios editoriales.
3. **Armar:** organizás capítulos con propósito, páginas, estado y fuentes conectadas.
4. **Escribir:** redactás el manuscrito por capítulo, con la arquitectura y las fuentes a la vista.
5. **Rastrear:** seguís afirmaciones, fuentes, ubicaciones y capítulos desde el mapa de trazabilidad.
6. **Revisar y exportar:** usás el auditor editorial, el modo estudio y las exportaciones Markdown/JSON.

## Qué incluye esta versión

- Biblioteca de varios proyectos, aislados entre sí para no mezclar fuentes ni manuscritos.
- Proyecto inicial de muestra para explorar el flujo editorial.
- Proyecto demostrativo local de *Ismael*, novela histórica uruguaya de Eduardo Acevedo Díaz.
- Proyecto demostrativo hispanoamericano de *Amalia*, de José Mármol.
- Importación de TXT, Markdown, CSV, JSON, JSONL y PDF.
- Extracción local del texto de los PDF por página, sin enviar documentos a un servidor.
- Conservación local del contenido completo de archivos de texto importados y de las páginas extraídas.
- Registro de evidencias con fuente, ubicación, fragmento de respaldo, clasificación, estado y notas.
- Mapa de trazabilidad que conecta afirmaciones, evidencias, fuentes y capítulos relacionados.
- Búsqueda dentro de fuentes y evidencias.
- Edición y eliminación de fuentes y evidencias, además de renombrar, archivar y eliminar proyectos.
- Ficha bibliográfica básica con edición, editorial o institución, año y fecha de consulta.
- Arquitectura de capítulos y editor de manuscrito con recuento de palabras.
- Auditoría mecánica para detectar capítulos sin propósito, fuentes desconectadas, afirmaciones sin fuente, desarrollo insuficiente y respaldos ausentes.
- Modo estudio con preguntas de lectura activa.
- Exportación del proyecto a Markdown y copia completa `.cronista.json`.

## Ejemplos incluidos

### *Ismael* · novela histórica uruguaya

Es el ejemplo local principal. Permite mostrar cómo Cronista trabaja con una obra literaria vinculada a la revolución oriental de 1811, diferenciando representación ficcional, memoria nacional y evidencia histórica. El texto puede consultarse en [Wikisource](https://es.wikisource.org/wiki/Ismael) y el contexto institucional en la [Biblioteca Nacional de Uruguay](https://www.bibna.gub.uy/blog-bnu/ismael-la-batalla-de-las-piedras-vista-desde-la-ficcion-heroica-de-acevedo-diaz/).

### *Amalia* · novela histórica

Es un segundo ejemplo en español para mostrar el flujo con una novela histórica hispanoamericana y un conflicto político distinto. El proyecto enlaza la [edición de 1909 en Wikisource](https://es.wikisource.org/wiki/Amalia), pero no duplica la novela completa dentro del repositorio.

## Privacidad y límites

La aplicación funciona como herramienta local y guarda los proyectos en IndexedDB, un almacenamiento del navegador preparado para datos locales más grandes. `localStorage` se usa para compatibilidad y para migrar bibliotecas antiguas; no se necesita una cuenta para abrirla.

La aplicación no realiza conexiones externas para enviar datos, analítica o contenido del usuario. Cuando la abrís desde GitHub Pages, el navegador descarga la aplicación y sus archivos necesarios desde el propio sitio; eso no implica que la biblioteca local se envíe de vuelta.

El estado de guardado aparece dentro de la aplicación. Si el navegador rechaza un guardado, Cronista lo informa y recomienda exportar una copia JSON. Para material importante, mantené igualmente copias externas periódicas.

Si alguna vez tuvo que usar el almacenamiento de compatibilidad, al volver IndexedDB Cronista compara las fechas de actualización de ambas versiones y conserva la más reciente por proyecto.

Esto no equivale a cifrado: otros procesos con acceso a la sesión de Windows podrían leer esos datos. Antes de publicar una copia, revisá las fuentes, las rutas, los textos importados y cualquier material privado.

Los PDF con texto seleccionable se leen dentro del navegador mediante PDF.js, incluido localmente en `vendor/pdfjs/`. Cronista conserva las páginas extraídas como representación canónica y genera el texto corrido sólo para tareas que lo necesitan, como una búsqueda. Los PDF escaneados pueden conservarse como referencia, pero esta versión todavía no hace OCR; para trabajar con ellos hace falta incorporar una transcripción revisada.

Cronista tampoco verifica por sí solo la verdad histórica de una afirmación. La auditoría señala huecos mecánicos; la lectura crítica, el contraste documental y las decisiones narrativas siguen siendo responsabilidad de quien trabaja el libro.

## Abrirlo

Desde esta carpeta:

```powershell
python -m http.server 4327
```

Después abrí <http://127.0.0.1:4327>.

También podés usar `Abrir Cronista.cmd` con doble clic si Python está disponible en Windows.

La explicación breve aparece dentro de **Panorama**. Para el recorrido completo, consultá la [Guía de uso](INSTRUCCIONES.md).

## Publicación en Git

La carpeta está preparada como aplicación estática sin dependencias de instalación. Antes de subirla a un repositorio público:

1. probá la apertura en un navegador limpio;
2. revisá que los demos no contengan documentos privados ni rutas personales;
3. definí una licencia para el código y documentá por separado las condiciones de las ediciones digitales enlazadas;
4. comprobá que las exportaciones locales `.cronista.json` no formen parte del repositorio;
5. agregá capturas o un enlace de demostración cuando el repositorio ya esté publicado.

La obra original de *Ismael* figura como de dominio público en Uruguay en [Autores.uy](https://autores.uy/autor/512). Aun así, conviene identificar la edición y conservar la atribución de la transcripción o digitalización concreta que se use.

## Licencia

El código y la documentación original de este repositorio se distribuyen bajo la [licencia MIT](LICENSE). Los textos, ediciones digitalizadas, marcas y enlaces de terceros conservan sus propias condiciones. El contenido que cada usuario importe en su navegador no forma parte de este repositorio ni queda cubierto por esta licencia.
