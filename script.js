/* =========================================
   1. PRELOADER - SERVICE ANIMATION SEQUENCE
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const textCycle = document.getElementById("service-text-cycle");
    const icons = document.querySelectorAll(".icon-anim");
    const loaderBar = document.querySelector(".loader-bar");
    const body = document.body;

    // Secuencia que refleja los 3 servicios del cliente
    const services = [
        "Ensamblando Hardware...",
        "Optimizando Sistemas...",
        "Desarrollando Software...",
        "ESTABLECIENDO CONEXIÓN...",
    ];

    let step = 0;

    const interval = setInterval(() => {
        if (step < services.length) {
            // Actualizar texto
            textCycle.textContent = services[step];

            // Iluminar el icono correspondiente (si existe)
            if (icons[step]) {
                icons.forEach((i) => i.classList.remove("active")); // apagar el anterior
                icons[step].classList.add("active"); // encender el de ahora
            } else if (step === 3) {
                // Si es el ultimo paso encender todos
                icons.forEach((i) => i.classList.add("active"));
            }

            // Actualizar barra de progreso (25% por paso)
            loaderBar.style.width = `${(step + 1) * 25}%`;

            step++;
        } else {
            clearInterval(interval);

            // Fin de la secuencia: Abrir puertas PC
            body.classList.add("preloader-finish");

            // Iniciar animaciones de particulas al revelar
            initTechCanvas();
            initWaveCanvas();

            setTimeout(() => {
                document
                    .getElementById("preloader")
                    .classList.add("preloader-hidden");
                body.classList.remove("loading"); // Habilitar scroll
            }, 1200); // Duración de la animación de las puertas
        }
    }, 700); // 0.7 segundos por cada mensaje
});

/* =========================================
   2. NAVBAR STICKY
   ========================================= */
window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

/* =========================================
   3. SMOOTH SCROLL MARGIN
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const yOffset = -80;
            const y =
                targetElement.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    });
});

/* =========================================
   4. SCROLL REVEAL (BLUR & SCALE)
   ========================================= */
const revealElements = document.querySelectorAll(".reveal-blur");
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach((el) => revealOnScroll.observe(el));

/* =========================================
   5. 3D TILT EFFECT (PRO)
   ========================================= */
const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
    if (window.innerWidth > 768) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transition = "transform 0.1s ease-out";
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transition =
                "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            card.style.transform = `perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            setTimeout(() => {
                card.style.transition = "all 0.4s ease";
            }, 600);
        });
    }
});

/* =========================================
   6. CANVAS PARTICLES (HERO BACKGROUND)
   ========================================= */
function initTechCanvas() {
    const canvas = document.getElementById("techCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = document.querySelector(".hero").offsetHeight);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 100; // Menos particulas en móvil

    // Manejo de redimensionado seguro
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.querySelector(".hero").offsetHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 240, 255, 0.5)";
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Efecto de cursor atrae particulas
    let mouse = { x: null, y: null };
    document.querySelector(".hero").addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.querySelector(".hero").addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 240, 255, ${1 - dist / 120})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Interacción con mouse
            if (mouse.x != null) {
                const dxm = particles[i].x - mouse.x;
                const dym = particles[i].y - mouse.y;
                const distm = Math.sqrt(dxm * dxm + dym * dym);
                if (distm < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(157, 78, 221, ${1 - distm / 150})`; // Purple laser to mouse
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/* =========================================
   7. CANVAS MATRIX/WAVES FOR CONTACT
   ========================================= */
function initWaveCanvas() {
    const canvas = document.getElementById("digitalWaves");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height =
        document.querySelector(".contact").offsetHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height =
            document.querySelector(".contact").offsetHeight;
    });

    let time = 0;
    function animateWaves() {
        ctx.fillStyle = "rgba(10, 14, 26, 0.2)"; // Estela
        ctx.fillRect(0, 0, width, height);

        time += 0.05;

        ctx.beginPath();
        for (let i = 0; i < width; i += 20) {
            const y =
                height / 2 +
                Math.sin(i * 0.01 + time) * 50 +
                Math.cos(i * 0.02 + time * 0.5) * 30;
            if (i == 0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
        }
        ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();

        requestAnimationFrame(animateWaves);
    }
    animateWaves();
}

/* =========================================
   8. MOBILE MENU TOGGLE
   ========================================= */
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");
const navLinksItems = document.querySelectorAll(".nav-links a");

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = mobileMenu.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.classList.replace("bx-menu", "bx-x");
        } else {
            icon.classList.replace("bx-x", "bx-menu");
        }
    });

    // Cerrar el menú al hacer clic en un enlace
    navLinksItems.forEach((item) => {
        item.addEventListener("click", () => {
            navLinks.classList.remove("active");
            const icon = mobileMenu.querySelector("i");
            if (icon.classList.contains("bx-x")) {
                icon.classList.replace("bx-x", "bx-menu");
            }
        });
    });
}
