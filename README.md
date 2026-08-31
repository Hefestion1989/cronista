# Cronista

**Cronista es una mesa de trabajo local para convertir fuentes, apuntes y borradores en libros, investigaciones y textos de estudio más claros, trazables y revisables.**

No es un procesador de texto genérico ni una máquina que decide qué es verdad. Ayuda a ordenar el trabajo intelectual para que cada capítulo tenga un propósito, cada afirmación pueda volver a una fuente y cada duda quede visible.

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
5. **Revisar y exportar:** usás el auditor editorial, el modo estudio y las exportaciones Markdown/JSON.

## Qué incluye esta versión

- Biblioteca de varios proyectos, aislados entre sí para no mezclar fuentes ni manuscritos.
- Proyecto inicial de muestra para explorar el flujo editorial.
- Proyecto demostrativo local de *Ismael*, novela histórica uruguaya de Eduardo Acevedo Díaz.
- Proyecto demostrativo hispanoamericano de *Amalia*, de José Mármol.
- Importación de TXT, Markdown, CSV, JSON, JSONL y PDF como referencia local.
- Conservación local del contenido completo de archivos de texto importados.
- Registro de evidencias con fuente, ubicación, fragmento de respaldo, clasificación, estado y notas.
- Búsqueda dentro de fuentes y evidencias.
- Arquitectura de capítulos y editor de manuscrito con recuento de palabras.
- Auditoría mecánica para detectar capítulos sin propósito, fuentes desconectadas, desarrollo insuficiente y respaldos ausentes.
- Modo estudio con preguntas de lectura activa.
- Exportación del proyecto a Markdown y copia completa `.cronista.json`.

## Ejemplos incluidos

### *Ismael* · novela histórica uruguaya

Es el ejemplo local principal. Permite mostrar cómo Cronista trabaja con una obra literaria vinculada a la revolución oriental de 1811, diferenciando representación ficcional, memoria nacional y evidencia histórica. El texto puede consultarse en [Wikisource](https://es.wikisource.org/wiki/Ismael) y el contexto institucional en la [Biblioteca Nacional de Uruguay](https://www.bibna.gub.uy/blog-bnu/ismael-la-batalla-de-las-piedras-vista-desde-la-ficcion-heroica-de-acevedo-diaz/).

### *Amalia* · novela histórica

Es un segundo ejemplo en español para mostrar el flujo con una novela histórica hispanoamericana y un conflicto político distinto. El proyecto enlaza la [edición de 1909 en Wikisource](https://es.wikisource.org/wiki/Amalia), pero no duplica la novela completa dentro del repositorio.

## Privacidad y límites

La aplicación funciona como herramienta local y guarda la biblioteca en el `localStorage` del navegador. No sube automáticamente el contenido a internet ni necesita una cuenta para abrirse.

Esto no equivale a cifrado: otros procesos con acceso a la sesión de Windows podrían leer esos datos. Antes de publicar una copia, revisá las fuentes, las rutas, los textos importados y cualquier material privado.

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
