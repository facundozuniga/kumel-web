# Sitio web de KUMEL

Sitio estático (HTML, CSS y JS sin dependencias) listo para GitHub Pages.

## Qué completar antes de publicar

1. **WhatsApp**: abrí `js/main.js` y completá `CONFIG.whatsapp` con el número en dígitos y con código de país, por ejemplo `5492962123456`. Todos los botones y el formulario se actualizan solos.
2. **Logo**: guardá el logo como `assets/logo.png` (cuadrado o casi cuadrado, fondo transparente). Si no existe, se muestra el nombre KUMEL en texto.
3. **Fotos de obras**: subí las imágenes a `assets/obras/` y agregalas en `CONFIG.obras` (hay un ejemplo en el código). Mientras esté vacío, la sección envía al Instagram.
4. **Email** (opcional): `CONFIG.email`.
5. **Datos de la empresa**: el pie de página muestra razón social y CUIT. Si no querés mostrarlo, borrá esa línea en `index.html`.

## Publicar en GitHub Pages

1. Creá un repositorio nuevo en GitHub (por ejemplo `kumel-web`) y subí el contenido de esta carpeta a la raíz.
2. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Elegí la rama `main` y la carpeta `/ (root)`, y guardá.
4. En uno o dos minutos el sitio queda en `https://TU-USUARIO.github.io/kumel-web/`.

Para usar un dominio propio, cargalo en **Settings → Pages → Custom domain**.

## Estructura

```
index.html        contenido y secciones
css/styles.css    estilos y paleta
js/main.js        configuración, hero de colores, cotizador
assets/           logo, favicon y fotos de obras
```
