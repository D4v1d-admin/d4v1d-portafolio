// Cargar proyectos desde el archivo JSON
fetch('data/proyectos.json')
    .then(respuesta => respuesta.json())
    .then(proyectos => {
        const contenedor = document.getElementById('lista-proyectos');
        
        proyectos.forEach(proy => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'proyecto';
            
            tarjeta.innerHTML = `
                <div class="img-container">
                    <img src="${proy.imagen}" alt="${proy.titulo}" draggable="false">
                    <div class="img-protector"></div>
                </div>
                <h3>${proy.titulo}</h3>
                <p>${proy.descripcion}</p>
                <a href="${proy.enlace}" target="_blank" rel="noopener">
                    Ver proyecto →
                </a>
            `;
            
            contenedor.appendChild(tarjeta);
        });
    })
    .catch(error => {
        console.error('Error al cargar proyectos:', error);
        document.getElementById('lista-proyectos').innerHTML = 
            '<p style="color:#e63946;">Error al cargar los proyectos</p>';
    });
