# Guía de uso de Cronista

Cronista es una mesa de trabajo local para investigar, estudiar y escribir sin perder la relación entre tus fuentes, tus ideas y el manuscrito. No reemplaza la lectura crítica ni decide qué afirmaciones son verdaderas.

## El recorrido recomendado

### 1. Abrí Cronista y elegí un proyecto

Podés explorar uno de los proyectos de muestra o crear uno nuevo con **+ Nuevo proyecto**.

Al crear un proyecto, completá:

- **Nombre:** cómo querés identificar el trabajo.
- **Tipo:** novela, investigación, ensayo u otra categoría disponible.
- **Descripción:** qué estás trabajando.
- **Norte del proyecto:** la pregunta, tensión o propósito que va a orientar las decisiones.
- **Meta de palabras:** una referencia de desarrollo, no una obligación.

Desde la tarjeta del proyecto también podés **renombrarlo**, **archivarlo**, recuperarlo o eliminarlo. Antes de eliminar algo importante, exportá una copia JSON: la eliminación no tiene papelera.

### 2. Reuní las fuentes

En **Fuentes** podés:

- agregar una nota o referencia manual;
- importar archivos TXT, Markdown, CSV, JSON, JSONL o PDF;
- buscar por título, autor, nota o contenido;
- abrir el texto completo de una fuente importada;
- leer un PDF por página cuando contiene texto seleccionable;
- preparar una evidencia a partir de un fragmento seleccionado.

Desde cada tarjeta podés editar o eliminar una fuente. La ficha conserva, cuando los completás, datos bibliográficos básicos: edición, editorial o institución, año y fecha de consulta.

Para cada fuente conviene dejar claro de dónde viene, qué contiene y para qué puede servir. En un PDF con texto seleccionable, abrí “Leer texto extraído” y seleccioná el pasaje dentro de su página: al crear la evidencia, Cronista completa automáticamente la ubicación como “p. N” o “pp. N-M” si la selección atraviesa más de una página. El texto se conserva por página como base de la extracción; la advertencia visible recuerda verificarlo contra el PDF antes de citar literalmente. Un PDF escaneado puede conservarse como referencia, pero esta versión todavía no hace OCR; en ese caso agregá también una transcripción TXT o Markdown revisada.

### 3. Separá los niveles de conocimiento

En **Evidencias**, registrá cada afirmación importante y elegí una clasificación:

- **Hecho:** algo que la fuente afirma o permite verificar directamente.
- **Inferencia:** una relación o interpretación que vos construís a partir del material.
- **Hipótesis:** una idea que todavía necesita confirmación.
- **Criterio editorial:** una decisión sobre cómo vas a tratar el texto.

Siempre que puedas, asociá la afirmación con una fuente, una ubicación y un fragmento o referencia de respaldo. La etiqueta no vuelve verdadera una afirmación: solo hace visible qué tipo de afirmación es.

Si una evidencia deja de servir, podés eliminarla desde su tarjeta. Si eliminás una fuente, las evidencias vinculadas no desaparecen: quedan sin fuente para que puedas reconstruir el vínculo o decidir qué hacer con ellas.

### 4. Armá la arquitectura

En **Arquitectura**, dividí el trabajo en capítulos o tramos. Para cada uno definí:

- qué tiene que conseguir;
- qué páginas o intervalo ocupa;
- qué fuentes lo sostienen;
- en qué estado se encuentra: pendiente, borrador, en proceso o revisado.

Un capítulo con propósito y fuentes conectadas es más fácil de escribir y de auditar. La arquitectura puede cambiar mientras el proyecto avanza.

### 5. Escribí el manuscrito

En **Manuscrito**, elegí un capítulo y redactá con su propósito y sus fuentes a la vista. Cronista cuenta las palabras y guarda los cambios en este navegador. **Guardar ahora** permite forzar el guardado cuando quieras.

La presencia de texto no significa que el capítulo esté terminado. Usá el contador, el propósito y las fuentes conectadas como señales de trabajo, no como sustitutos de la revisión.

### 6. Revisá el proyecto

En **Auditor editorial**, Cronista revisa controles mecánicos:

- capítulos con propósito;
- fuentes conectadas a la estructura;
- existencia de un borrador;
- desarrollo inicial;
- evidencias registradas;
- respaldos textuales conservados.

Las advertencias indican dónde mirar. Cronista no verifica por sí solo hechos históricos, calidad literaria, citas ni interpretaciones.

### 7. Seguí la trazabilidad

En **Trazabilidad**, cada afirmación se muestra junto con su respaldo, la fuente asociada y los capítulos que usan esa fuente. Es un mapa de relaciones de trabajo, no una prueba automática de que la fuente sostenga todo el capítulo. Si una afirmación aparece sin fuente o sin ubicación, volvé a **Evidencias** y completala.

### 8. Usá el modo estudio

**Modo estudio** genera preguntas a partir de la arquitectura y las notas del proyecto. Sirve para comprobar si entendés el argumento, detectar tensiones y reconocer qué todavía no está demostrado.

### 9. Exportá una copia

- **Markdown:** una versión legible para revisar o compartir.
- **Copia JSON:** una copia completa para respaldar o importar el proyecto en otro navegador.

Exportá periódicamente si el material es importante. La biblioteca del navegador no reemplaza un respaldo.

## Un método simple para empezar

Para un primer proyecto, cargá tres fuentes, registrá cinco afirmaciones y armá tres capítulos. Después escribí al menos un capítulo antes de mirar el auditor. Ese orden permite que la herramienta acompañe el trabajo real sin convertirlo en una planilla vacía.

## Privacidad y límites

Cronista funciona localmente y guarda los proyectos en IndexedDB, un almacenamiento del navegador preparado para datos locales más grandes. Las bibliotecas antiguas guardadas en `localStorage` se migran al abrir la aplicación; ese almacenamiento queda como compatibilidad y no se usa como destino principal. No necesitás una cuenta y Cronista no sube automáticamente tus textos.

El indicador de la barra lateral muestra si el guardado está preparado, en curso o terminado. Si aparece una advertencia, exportá una copia JSON antes de seguir trabajando. El almacenamiento local no es cifrado: cualquier proceso o usuario con acceso a esa sesión de Windows podría llegar a esos datos.

Si una biblioteca tuvo que continuar temporalmente en el almacenamiento de compatibilidad y después IndexedDB vuelve a estar disponible, Cronista compara `updatedAt` y conserva la versión más reciente de cada proyecto. Aun así, una copia JSON externa sigue siendo el respaldo más claro.

Antes de compartir o publicar el repositorio, revisá que no haya exportaciones, archivos importados, rutas personales ni material privado. La aplicación pública incluye ejemplos y documentación, no una biblioteca personal.

## Si algo sale mal

- Si la pantalla no carga, abrí la carpeta con `Abrir Cronista.cmd` o ejecutá `python -m http.server 4327` y visitá `http://127.0.0.1:4327`.
- Si no ves un proyecto después de cambiar de navegador, importá la copia JSON que hayas exportado.
- Si un archivo no trae texto utilizable, revisá si es un PDF escaneado y agregá una transcripción TXT o Markdown.
- Si una afirmación queda sin respaldo, dejala como hipótesis o por revisar hasta poder volver a la fuente.
- Si vas a restaurar un proyecto de prueba, exportá antes cualquier trabajo que quieras conservar: la restauración reemplaza los cambios de ese proyecto.
