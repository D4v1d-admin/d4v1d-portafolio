// Animación de partículas CON seguimiento del mouse
const canvas = document.getElementById('fondoCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particulas = [];
const NUM_PARTICULAS = 80;
const COLOR_AZUL = '#3b82f6';
const COLOR_ROJO = '#e63946';

// Posición del mouse
let mouse = {
    x: null,
    y: null,
    radio: 120 // Radio de atracción
};

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', () => {
    resize();
    crearParticulas();
});

// Detectar movimiento del mouse
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Cuando el mouse sale de la pantalla
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// También para pantallas táctiles
window.addEventListener('touchmove', (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

resize();

class Particula {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.tamano = Math.random() * 3 + 1;
        this.velocidadX = Math.random() * 1.5 - 0.75;
        this.velocidadY = Math.random() * 1.5 - 0.75;
        this.color = Math.random() > 0.5 ? COLOR_AZUL : COLOR_ROJO;
        this.xOriginal = this.x;
        this.yOriginal = this.y;
    }

    actualizar() {
        // Movimiento normal
        this.x += this.velocidadX;
        this.y += this.velocidadY;

        // Atracción hacia el mouse
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < mouse.radio) {
                const fuerza = (mouse.radio - distancia) / mouse.radio;
                this.x += dx * fuerza * 0.03;
                this.y += dy * fuerza * 0.03;
            }
        }

        // Rebote en bordes
        if (this.x < 0 || this.x > width) this.velocidadX *= -1;
        if (this.y < 0 || this.y > height) this.velocidadY *= -1;
    }

    dibujar() {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            Math.floor(this.x),
            Math.floor(this.y),
            this.tamano,
            this.tamano
        );
    }
}

function crearParticulas() {
    particulas = [];
    for (let i = 0; i < NUM_PARTICULAS; i++) {
        particulas.push(new Particula());
    }
}

function conectarParticulas() {
    for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
            const dx = particulas[i].x - particulas[j].x;
            const dy = particulas[i].y - particulas[j].y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < 150) {
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 - distancia / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particulas[i].x, particulas[i].y);
                ctx.lineTo(particulas[j].x, particulas[j].y);
                ctx.stroke();
            }
        }
    }
}

function animar() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particulas) {
        p.actualizar();
        p.dibujar();
    }

    conectarParticulas();
    requestAnimationFrame(animar);
}

crearParticulas();
animar();