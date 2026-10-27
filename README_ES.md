# ViralStudio AI — MVP 0.1

Primera versión de un editor móvil para preparar videos verticales. Es una PWA estática: puede instalarse desde Chrome en Android cuando se aloje mediante HTTPS.

## Incluye
- Interfaz adaptable a Android.
- Borrador de guion por estilos (plantillas locales; no es IA generativa todavía).
- Escenas editables con título y narración.
- Importación de imágenes desde el teléfono.
- Vista previa vertical 9:16.
- Lectura del guion con las voces disponibles en el dispositivo.
- Exportación experimental del lienzo como WebM si el navegador admite MediaRecorder.
- Descarga/importación del proyecto en JSON.
- Caché offline mediante service worker.

## Limitaciones conocidas
- La voz de SpeechSynthesis es una previsualización; no se mezcla en el video exportado.
- El archivo exportado puede ser WebM, no MP4. Se puede convertir con un editor gratuito compatible.
- La música se puede seleccionar en esta versión, pero aún no se mezcla automáticamente.
- Las imágenes no se guardan dentro del JSON del proyecto.
- No genera imágenes o escenas realistas mediante IA y no verifica datos de actualidad.
- Para instalar una PWA, los archivos deben estar alojados en HTTPS (localhost es la excepción para desarrollo).

## Prueba rápida
1. Abre `index.html` en un navegador de escritorio para una comprobación inicial.
2. Para instalar en Android, publica los archivos en un hosting HTTPS estático.
3. Abre la dirección en Chrome Android.
4. Menú ⋮ → **Instalar aplicación** o **Añadir a pantalla de inicio**.
5. Genera un guion, cambia escenas, carga imágenes y prueba la exportación.

## Publicar gratis con GitHub Pages
1. Crea una cuenta de GitHub si no tienes.
2. Crea un repositorio público llamado `viralstudio-ai`.
3. Sube todos los archivos de esta carpeta a la raíz del repositorio.
4. En el repositorio abre Settings → Pages.
5. En Build and deployment elige Deploy from a branch, rama `main`, carpeta `/ (root)`, y guarda.
6. Espera a que GitHub Pages publique la URL HTTPS.
7. Abre la URL desde Chrome en Android e instala la app.

Los nombres exactos de algunos botones de GitHub pueden variar según el idioma y la interfaz.

## Próximos pasos
1. Guardado local automático.
2. Mezcla real de voz y música con la imagen.
3. Exportación MP4 o empaquetado con Capacitor.
4. Conectar un modelo gratuito o de bajo coste para generar guiones; proteger las claves API en un backend, nunca dentro de la app.
5. Opciones para generar imágenes/clips, con control de derechos de uso.
