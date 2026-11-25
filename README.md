# GTA VI Radio — The Sound of Leonida

Simulador web de las 25 emisoras de radio de GTA VI con estética limpia estilo Spotify + modo opcional **Dial GTA**.

## Características principales

- **Primera visita aleatoria:** Al entrar por primera vez, se selecciona una emisora aleatoria y cada una de las 25 emisoras arranca en un punto aleatorio de su emisión.
- **Emisión continua por sesión (`localStorage`):** Mientras estás fuera de la web (minutos, horas o días), todas las emisoras siguen avanzando en segundo plano en tiempo real. Al volver, la radio continúa más adelantada, igual que una emisora FM real, reiniciándose en bucle al terminar.
- **25 emisoras completas:** Portadas personalizadas, título, frecuencia, estilos musicales, descripción temática y duración exacta de cada emisión.
- **Estética estilo Spotify + Modo Dial GTA:** Barra lateral con biblioteca de emisoras, cabecera dinámica según el color de cada radio, buscador, filtros por género, favoritas y barra de reproducción fija inferior con efecto opcional de estática FM al cambiar de emisora.
- **Atajos de teclado:** `Espacio` (Play/Pausa), `← / →` (Emisora anterior/siguiente), `R` (Aleatoria), `M` (Silenciar).

---

## Desarrollo en local

```bash
npm install
npm run dev
```

En local, la aplicación sirve automáticamente los archivos `.mp3` ubicados en `local-audio/<slug>.mp3` con soporte de `HTTP Range` para saltar al segundo exacto al instante (sin incluirlos en `dist/`).

---

## Cómo subir a GitHub y desplegar en Vercel

> **Importante sobre los archivos de audio (~7,3 GB):**
> Los 25 archivos `.mp3` pesan entre **71 MB y 690 MB cada uno** (7,3 GB en total). GitHub bloquea archivos de más de **100 MB** y Vercel no admite despliegues estáticos de varios gigabytes.
> Por eso `local-audio/` ya está incluido en `.gitignore` para que el repositorio sea ultraligero y suba a GitHub en segundos.

### Paso 1: Alojar los audios gratis con **Cloudflare R2** (recomendado)
Cloudflare R2 incluye **10 GB de almacenamiento gratis al mes y 0 € en tráfico de salida (egress)**, además de soportar peticiones `HTTP Range` para saltar directamente al minuto exacto de un MP3 de 600 MB sin descargarlo entero.

1. Crea un bucket en [Cloudflare R2](https://dash.cloudflare.com/) (por ejemplo, `gta6-radio-audio`).
2. Activa **Public Development URL** (o conecta un dominio propio) en los ajustes del bucket. Obtendrás una URL pública como:
   `https://pub-xxxxxxxxxxxxxxxx.r2.dev`
3. Sube los 25 archivos `.mp3` de la carpeta `local-audio/` directamente a la raíz del bucket manteniendo sus nombres (`flash-fm.mp3`, `v-rock.mp3`, etc.).
4. En **Settings → CORS Policy** del bucket R2, añade:
   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedHeaders": ["Range"]
     }
   ]
   ```

### Paso 2: Subir el código a GitHub
```bash
git init
git add .
git commit -m "Initial GTA VI Radio web app"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/gta6-radio.git
git push -u origin main
```

### Paso 3: Desplegar en Vercel
1. Importa el repositorio desde [vercel.com](https://vercel.com/).
2. En **Environment Variables**, añade:
   - **Name:** `VITE_AUDIO_BASE_URL`
   - **Value:** `https://pub-xxxxxxxxxxxxxxxx.r2.dev` (tu URL pública de Cloudflare R2, sin barra `/` final)
3. Pulsa **Deploy**. ¡Listo!
