/* ================= STAR CANVAS SETUP ================= */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ================= MOUSE ================= */
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let cursorStars = [];

document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const cursor = document.getElementById("cursor");
    if (cursor) {
        cursor.style.left = mouse.x + "px";
        cursor.style.top = mouse.y + "px";
    }

    cursorStars.push({
        x: mouse.x,
        y: mouse.y,
        size: Math.random() * 5 + 2,
        life: 1
    });

    if (cursorStars.length > 120) cursorStars.shift();
});

/* ================= FALLING STAR FIELD ================= */
let stars = [];
const STAR_COUNT = 200;

for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: 0,
        baseY: 0,
        size: Math.random() * 2,
        speedY: Math.random() * 1 + 0.3, // ⭐ FALL SPEED
        density: Math.random() * 40 + 1
    });

    stars[i].baseX = stars[i].x;
    stars[i].baseY = stars[i].y;
}

/* ================= ANIMATION LOOP ================= */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* ===== FALLING + REPULSION STARS ===== */
    for (let s of stars) {

        // 🔻 FALLING MOTION
        s.y += s.speedY;

        // reset when bottom reached
        if (s.y > canvas.height) {
            s.y = 0;
            s.x = Math.random() * canvas.width;
            s.baseX = s.x;
        }

        // 🔥 CURSOR REPULSION
        let dx = s.x - mouse.x;
        let dy = s.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let maxDistance = 140;

        if (distance < maxDistance) {
            let force = (maxDistance - distance) / maxDistance;

            let angle = Math.atan2(dy, dx);

            let pushX = Math.cos(angle) * force * 6;
            let pushY = Math.sin(angle) * force * 6;

            s.x += pushX * 0.8;
            s.y += pushY * 0.8;
        }

        // draw star
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#38bdf8";
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    }

    /* ===== CURSOR PARTICLES ===== */
    for (let i = 0; i < cursorStars.length; i++) {
        let p = cursorStars[i];

        p.life -= 0.02;
        p.size *= 0.96;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${p.life})`;
        ctx.fill();

        if (p.life <= 0) {
            cursorStars.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}

animate();

/* ================= TYPING ================= */
const text = "Hi, I'm Mahesh 👋";
let i = 0;

function typeEffect() {
    const el = document.getElementById("typing");
    if (!el) return;

    if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeEffect, 110);
    }
}

typeEffect();

/* ================= SCROLL REVEAL ================= */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

document.querySelectorAll(".card").forEach(el => {
    observer.observe(el);
});