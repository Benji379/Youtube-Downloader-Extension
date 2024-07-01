// Función para obtener información del video usando el servidor Flask
async function getVideoInfo(link) {
    const url = 'http://localhost:5000/api/getVideoInfo';  // Actualiza la URL si es necesario
    const payload = new URLSearchParams();
    payload.append('link', link);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        if (response.ok) {
            const data = await response.json();
            const { title } = data;
            return title;
        } else {
            console.error('Error fetching video info:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching video info:', error);
        return null;
    }
}

// Función para convertir y descargar usando el servidor Flask
async function convertAndDownload(link, formatType) {
    const url = 'http://localhost:5000/api/convertAndDownload';  // Actualiza la URL si es necesario
    const payload = new URLSearchParams();
    payload.append('link', link);
    payload.append('format', formatType);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        if (response.ok) {
            const data = await response.json();
            const { download_url } = data;
            return download_url;
        } else {
            console.error('Error converting and downloading:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error converting and downloading:', error);
        return null;
    }
}

// Función para obtener la URL actual de la página
function getCurrentURL() {
    return window.location.href;
}

// Función para mostrar un mensaje con el tipo de descarga y la URL actual
function showMessageAndURL(downloadType) {
    let message = '';
    if (downloadType === 'mp4') {
        message = 'Descargar MP4';
    } else if (downloadType === 'mp3') {
        message = 'Descargar MP3';
    }
}

// Función para agregar los botones de descarga en la página de YouTube
function addDownloadButtons() {
    const container = document.querySelector('#top-level-buttons-computed');

    if (container && !document.querySelector('#download-button')) {
        const downloadButton = document.createElement('button');
        downloadButton.id = 'download-button';
        downloadButton.className = 'style-scope ytd-toggle-button-renderer style-default';
        downloadButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/>
            </svg>
        `;
        downloadButton.addEventListener('click', (event) => {
            const formatContainer = document.querySelector('#format-buttons-container');
            formatContainer.style.display = formatContainer.style.display === 'none' ? 'block' : 'none';

            const rect = downloadButton.getBoundingClientRect();
            formatContainer.style.top = `${rect.bottom + window.scrollY}px`;
            formatContainer.style.left = `${rect.left + window.scrollX}px`;

            event.stopPropagation(); // Evita que el evento se propague al documento
        });

        const formatContainer = document.createElement('div');
        formatContainer.id = 'format-buttons-container';
        formatContainer.style.display = 'none';

        const mp3Button = document.createElement('button');
        mp3Button.id = 'mp3-download-button';
        mp3Button.innerText = 'MP3';
        mp3Button.className = 'style-scope ytd-toggle-button-renderer style-default';
        mp3Button.addEventListener('click', async () => {
            const link = getCurrentURL();
            const formato = 'mp3';
            const downloadUrl = await convertAndDownload(link, formato);
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                console.log('No se pudo obtener la URL de descarga');
            }
            showMessageAndURL('mp3');
        });

        const mp4Button = document.createElement('button');
        mp4Button.id = 'mp4-download-button';
        mp4Button.innerText = 'MP4';
        mp4Button.className = 'style-scope ytd-toggle-button-renderer style-default';
        mp4Button.addEventListener('click', async () => {
            const link = getCurrentURL();
            const formato = 'mp4';
            const downloadUrl = await convertAndDownload(link, formato);
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                console.log('No se pudo obtener la URL de descarga');
            }
            showMessageAndURL('mp4');
        });

        formatContainer.appendChild(mp3Button);
        formatContainer.appendChild(mp4Button);
        container.appendChild(downloadButton);
        document.body.appendChild(formatContainer);

        // Añadir el evento al documento para cerrar el popup al hacer clic fuera de él
        document.addEventListener('click', (event) => {
            if (!formatContainer.contains(event.target) && event.target !== downloadButton) {
                formatContainer.style.display = 'none';
            }
        });
    }
}

// Observador para cambios en el DOM
const observer = new MutationObserver(addDownloadButtons);
observer.observe(document.body, { childList: true, subtree: true });

// Llamada inicial para agregar los botones de descarga
addDownloadButtons();
