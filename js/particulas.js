// Lluvia de píxeles + partículas con mouse
const canvas = document.getElementById('fondoCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particulas = [];
let pixelesCayendo = [];
const NUM_PARTICULAS = 50;
const NUM_PIXELES = 30;

let mouse = {
    x: null,
    y: null,
    radio: 120
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

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

resize();

// Partículas que siguen al mouse
class Particula {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.tamano = Math.random() * 3 + 1;
        this.velocidadX = Math.random() * 1 - 0.5;
        this.velocidadY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#3b82f6' : '#e63946';
    }

    actualizar() {
        this.x += this.velocidadX;
        this.y += this.velocidadY;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            if (distancia < mouse.radio) {
                const fuerza = (mouse.radio - distancia) / mouse.radio;
                this.x += dx * fuerza * 0.02;
                this.y += dy * fuerza * 0.02;
            }
        }

        if (this.x < 0 || this.x > width) this.velocidadX *= -1;
        if (this.y < 0 || this.y > height) this.velocidadY *= -1;
    }

    dibujar() {
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.tamano, this.tamano);
    }
}

// Píxeles que caen como lluvia
class PixelCayendo {
    constructor() {
        this.reset();
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = -10;
        this.tamano = Math.random() * 4 + 2;
        this.velocidad = Math.random() * 2 + 1;
        this.opacidad = Math.random() * 0.5 + 0.3;
        this.color = Math.random() > 0.5 ? '#3b82f6' : '#e63946';
    }

    actualizar() {
        this.y += this.velocidad;
        if (this.y > height + 10) {
            this.reset();
        }
    }

    dibujar() {
        ctx.fillStyle = this.color.replace(')', `, ${this.opacidad})`).replace('rgb', 'rgba');
        if (this.color.startsWith('#')) {
            ctx.globalAlpha = this.opacidad;
            ctx.fillStyle = this.color;
        }
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.tamano, this.tamano);
        ctx.globalAlpha = 1;
    }
}

function crearParticulas() {
    particulas = [];
    for (let i = 0; i < NUM_PARTICULAS; i++) {
        particulas.push(new Particula());
    }
    pixelesCayendo = [];
    for (let i = 0; i < NUM_PIXELES; i++) {
        pixelesCayendo.push(new PixelCayendo());
    }
}

function conectarParticulas() {
    for (let i = 0; i < particulas.length; i++) {
        for (let j = i + 1; j < particulas.length; j++) {
            const dx = particulas[i].x - particulas[j].x;
            const dy = particulas[i].y - particulas[j].y;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            if (distancia < 120) {
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 - distancia / 600})`;
                ctx.lineWidth = 0.5;
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

    for (let px of pixelesCayendo) {
        px.actualizar();
        px.dibujar();
    }

    conectarParticulas();
    requestAnimationFrame(animar);
}

crearParticulas();
animar();
