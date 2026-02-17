// ============================================
// GSAP REGISTRATION
// ============================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ============================================
// CUSTOM CURSOR
// ============================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursorTrail = document.querySelector('.cursor-trail');

if (cursorDot && cursorOutline && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let outX = 0, outY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.08 });
    });

    function animateCursor() {
        outX += (mouseX - outX) * 0.12;
        outY += (mouseY - outY) * 0.12;
        trailX += (mouseX - trailX) * 0.06;
        trailY += (mouseY - trailY) * 0.06;
        cursorOutline.style.transform = `translate(${outX - 22}px, ${outY - 22}px)`;
        cursorTrail.style.transform = `translate(${trailX - 60}px, ${trailY - 60}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    function setupHovers() {
        document.querySelectorAll('a, button, .skill-card-3d, .project-image, .hamburger, input, textarea, .learning-tag, .contact-social-link, .journey-card, .tab-btn, .detail-card, .magnetic-btn').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    }
    setupHovers();

    document.addEventListener('mouseleave', () => {
        gsap.to([cursorDot, cursorOutline, cursorTrail], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener('mouseenter', () => {
        gsap.to([cursorDot, cursorOutline, cursorTrail], { opacity: 1, duration: 0.2 });
    });
}

// ============================================
// PRELOADER
// ============================================
function runPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.querySelector('.preloader-fill');
    const counter = document.querySelector('.preloader-counter');
    
    const tl = gsap.timeline();
    let count = { val: 0 };

    tl.to(count, {
        val: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
            counter.textContent = Math.round(count.val) + '%';
        }
    });

    tl.to(fill, { width: '100%', duration: 2, ease: 'power2.inOut' }, '<');

    tl.to(preloader, {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        duration: 0.9,
        ease: 'power3.inOut',
        delay: 0.3,
        onComplete: () => {
            preloader.style.display = 'none';
            document.body.style.overflow = '';
            initHeroAnimations();
            ScrollTrigger.refresh();
        }
    });
}

// ============================================
// HERO ANIMATIONS
// ============================================
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 })
      .to('.title-word, .title-ampersand', { y: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out' }, '-=0.4')
      .to('.hero-bottom', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero-scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.3')
      .to('.floating-tag', { opacity: 0.7, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.5')
      .from('.hero-social-sidebar a, .social-line', { opacity: 0, y: 20, duration: 0.5, stagger: 0.06 }, '-=0.6');

    // Parallax
    gsap.utils.toArray('.floating-tag').forEach((tag, i) => {
        gsap.to(tag, {
            y: -20 - i * 10,
            x: (i % 2 === 0 ? 10 : -10),
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
        });
    });

    gsap.to('.hero-orb-1', { y: -120, x: -60, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 } });
    gsap.to('.hero-orb-2', { y: -80, x: 40, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 } });

    gsap.to('.hero-content', {
        opacity: 0, y: -60,
        scrollTrigger: { trigger: '#hero', start: '55% top', end: 'bottom top', scrub: 1 }
    });
}

// ============================================
// PARTICLES (Canvas-based)
// ============================================
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = Math.min(60, Math.floor(window.innerWidth / 25));

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.4 + 0.1,
            color: ['#7c3aed', '#4cc9f0', '#06d6a0', '#f72585'][Math.floor(Math.random() * 4)]
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        });

        // Draw connections
        ctx.globalAlpha = 0.04;
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    animate();
}

// ============================================
// THREE.JS 3D GLOBE
// ============================================
function init3DGlobe() {
    const container = document.getElementById('globeContainer');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe wireframe
    const globeGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const globeMat = new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Inner glow sphere
    const innerGeo = new THREE.SphereGeometry(1.75, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.03
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Skill labels as orbiting dots with colors
    const skills = [
        { name: 'HTML5', color: 0xE44D26 },
        { name: 'CSS3', color: 0x264de4 },
        { name: 'JavaScript', color: 0xF7DF1E },
        { name: 'React', color: 0x61DAFB },
        { name: 'Node.js', color: 0x68A063 },
        { name: 'Python', color: 0xFFD43B },
        { name: 'Git', color: 0xF05032 },
        { name: 'MongoDB', color: 0x4DB33D },
        { name: 'TypeScript', color: 0x3178C6 },
        { name: 'Tailwind', color: 0x38BDF8 },
        { name: 'Express', color: 0xaaaaaa },
        { name: 'C++', color: 0x00599C },
        { name: 'Bootstrap', color: 0x7952B3 },
        { name: 'DSA', color: 0xe040fb },
        { name: 'SQL', color: 0x336791 },
        { name: 'Prompt Eng', color: 0x00BFA5 }
    ];

    const dotGroup = new THREE.Group();
    const textSprites = [];

    skills.forEach((skill, i) => {
        const phi = Math.acos(-1 + (2 * i + 1) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;
        const radius = 2.1;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        // Dot
        const dotGeo = new THREE.SphereGeometry(0.06, 12, 12);
        const dotMat = new THREE.MeshBasicMaterial({ color: skill.color });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(x, y, z);
        dotGroup.add(dot);

        // Glow
        const glowGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const glowMat = new THREE.MeshBasicMaterial({
            color: skill.color,
            transparent: true,
            opacity: 0.25
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.set(x, y, z);
        dotGroup.add(glow);

        // Text sprite
        const canvas2 = document.createElement('canvas');
        canvas2.width = 256;
        canvas2.height = 64;
        const ctx2 = canvas2.getContext('2d');
        ctx2.font = 'bold 28px Inter, sans-serif';
        ctx2.fillStyle = '#' + skill.color.toString(16).padStart(6, '0');
        ctx2.textAlign = 'center';
        ctx2.fillText(skill.name, 128, 40);

        const texture = new THREE.CanvasTexture(canvas2);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.85 });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(x * 1.25, y * 1.25, z * 1.25);
        sprite.scale.set(0.8, 0.2, 1);
        dotGroup.add(sprite);
        textSprites.push(sprite);
    });

    scene.add(dotGroup);

    // Ring
    const ringGeo = new THREE.TorusGeometry(2.3, 0.01, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4cc9f0, transparent: true, opacity: 0.15 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Second ring
    const ring2Geo = new THREE.TorusGeometry(2.5, 0.008, 8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xf72585, transparent: true, opacity: 0.1 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // Mouse interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotVel = { x: 0.003, y: 0.005 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        rotVel.y = dx * 0.003;
        rotVel.x = dy * 0.003;
        prevMouse = { x: e.clientX, y: e.clientY };
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    container.addEventListener('touchend', () => { isDragging = false; });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - prevMouse.x;
        const dy = e.touches[0].clientY - prevMouse.y;
        rotVel.y = dx * 0.003;
        rotVel.x = dy * 0.003;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    function animateGlobe() {
        requestAnimationFrame(animateGlobe);

        if (!isDragging) {
            rotVel.x *= 0.97;
            rotVel.y *= 0.97;
            rotVel.x += 0.0001;
            rotVel.y += 0.0002;
        }

        globe.rotation.x += rotVel.x;
        globe.rotation.y += rotVel.y;
        innerSphere.rotation.x += rotVel.x;
        innerSphere.rotation.y += rotVel.y;
        dotGroup.rotation.x += rotVel.x;
        dotGroup.rotation.y += rotVel.y;
        ring.rotation.z += 0.002;
        ring2.rotation.z -= 0.0015;

        renderer.render(scene, camera);
    }
    animateGlobe();

    // Resize handler
    window.addEventListener('resize', () => {
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

// ============================================
// HEADER
// ============================================
const header = document.getElementById('header');
let lastScroll = 0;

ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
        const current = self.scroll();
        if (current > 100) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        if (current > lastScroll && current > 400) {
            gsap.to(header, { y: -100, duration: 0.3 });
        } else {
            gsap.to(header, { y: 0, duration: 0.3 });
        }
        lastScroll = current;
    }
});

// ============================================
// MOBILE MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileItems = document.querySelectorAll('.mobile-nav-item');
const mobileFooter = document.querySelector('.mobile-menu-footer');
let menuOpen = false;

hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('active');
    if (menuOpen) {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        gsap.to('.mobile-menu-bg', { opacity: 1, duration: 0.4 });
        gsap.fromTo(mobileItems, { opacity: 0, y: 50, rotateX: 15 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.2 });
        gsap.fromTo(mobileFooter, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.6 });
    } else closeMenu();
});

function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
    gsap.to(mobileItems, { opacity: 0, y: 40, duration: 0.3, stagger: 0.03 });
    gsap.to(mobileFooter, { opacity: 0, duration: 0.3 });
    gsap.to('.mobile-menu-bg', { opacity: 0, duration: 0.4, delay: 0.2, onComplete: () => mobileMenu.classList.remove('active') });
}

mobileItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const target = item.getAttribute('href');
        closeMenu();
        setTimeout(() => gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power3.inOut' }), 500);
    });
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('.nav-item, .footer-nav a, .cta-secondary, .about-cta').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            gsap.to(window, { scrollTo: { y: href, offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
        }
    });
});

document.querySelector('.cta-primary')?.addEventListener('click', (e) => {
    e.preventDefault();
    gsap.to(window, { scrollTo: { y: '#projects', offsetY: 80 }, duration: 1, ease: 'power3.inOut' });
});

document.querySelectorAll('.logo, .footer-logo').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(window, { scrollTo: 0, duration: 1, ease: 'power3.inOut' });
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

// Section headers
document.querySelectorAll('.section-header').forEach(sh => {
    gsap.from(sh.querySelectorAll('.section-number, .title-reveal, .section-line'), {
        opacity: 0, y: 35, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sh, start: 'top 82%', toggleActions: 'play none none reverse' }
    });
});

// About
gsap.from('.about-image-wrapper', {
    opacity: 0, x: -70, rotateY: 8, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#about .about-grid', start: 'top 72%', toggleActions: 'play none none reverse' }
});

gsap.from('.about-code-badge', {
    opacity: 0, scale: 0, duration: 0.5, delay: 0.4, ease: 'back.out(2)',
    scrollTrigger: { trigger: '#about .about-grid', start: 'top 72%', toggleActions: 'play none none reverse' }
});

gsap.from('.about-experience-badge', {
    opacity: 0, scale: 0.5, duration: 0.6, delay: 0.5, ease: 'back.out(2)',
    scrollTrigger: { trigger: '#about .about-grid', start: 'top 72%', toggleActions: 'play none none reverse' }
});

gsap.from('.about-text-col .about-intro, .about-text-col .about-description, .about-text-col .about-details, .about-text-col .about-cta', {
    opacity: 0, y: 45, duration: 0.8, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '#about .about-grid', start: 'top 68%', toggleActions: 'play none none reverse' }
});

gsap.from('.detail-card', {
    opacity: 0, y: 25, scale: 0.95, duration: 0.5, stagger: 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-details', start: 'top 85%', toggleActions: 'play none none reverse' }
});

gsap.to('.about-photo', {
    yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 }
});

// Skills cards
document.querySelectorAll('.skill-card-3d').forEach(card => {
    gsap.from(card, {
        opacity: 0, y: 55, scale: 0.88, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' }
    });
});

// Skill meters
ScrollTrigger.create({
    trigger: '#skills',
    start: 'top 55%',
    onEnter: () => {
        document.querySelectorAll('.meter-fill').forEach((bar, i) => {
            gsap.to(bar, { width: bar.dataset.width + '%', duration: 1.8, delay: i * 0.06, ease: 'power3.out' });
        });
    },
    once: true
});

gsap.from('.currently-learning', {
    opacity: 0, y: 45, duration: 0.8,
    scrollTrigger: { trigger: '.currently-learning', start: 'top 82%', toggleActions: 'play none none reverse' }
});

gsap.from('.learning-tag', {
    opacity: 0, y: 25, scale: 0.9, duration: 0.5, stagger: 0.1, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.learning-tags', start: 'top 85%', toggleActions: 'play none none reverse' }
});

// Projects
document.querySelectorAll('.project-item').forEach((item, i) => {
    const imgW = item.querySelector('.project-image-wrapper');
    const det = item.querySelector('.project-details');
    const isRev = item.classList.contains('project-reverse');

    gsap.from(imgW, {
        opacity: 0, x: isRev ? 70 : -70, scale: 0.94, duration: 1.1,
        scrollTrigger: { trigger: item, start: 'top 72%', toggleActions: 'play none none reverse' }
    });

    gsap.from(det.children, {
        opacity: 0, y: 45, duration: 0.8, stagger: 0.1,
        scrollTrigger: { trigger: item, start: 'top 68%', toggleActions: 'play none none reverse' }
    });

    const img = imgW.querySelector('img');
    if (img) gsap.to(img, { yPercent: -12, scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1 } });

    const num = imgW.querySelector('.project-number');
    if (num) gsap.to(num, { y: -40, scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
});

gsap.from('.projects-footer', {
    opacity: 0, y: 35, duration: 0.8,
    scrollTrigger: { trigger: '.projects-footer', start: 'top 85%', toggleActions: 'play none none reverse' }
});

// Journey
document.querySelectorAll('.journey-item').forEach(item => {
    gsap.from(item.querySelector('.journey-marker'), {
        opacity: 0, scale: 0, duration: 0.5, ease: 'back.out(2)',
        scrollTrigger: { trigger: item, start: 'top 82%', toggleActions: 'play none none reverse' }
    });
    gsap.from(item.querySelector('.journey-card'), {
        opacity: 0, x: -50, rotateY: 5, duration: 0.9,
        scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
});

ScrollTrigger.create({
    trigger: '.journey-timeline',
    start: 'top 80%',
    end: 'bottom 25%',
    scrub: 1,
    onUpdate: (self) => gsap.set('.timeline-progress', { height: self.progress * 100 + '%' })
});

// Contact
gsap.from('.contact-heading, .contact-subtext, .contact-info-item, .contact-socials', {
    opacity: 0, y: 45, duration: 0.8, stagger: 0.12,
    scrollTrigger: { trigger: '#contact .contact-layout', start: 'top 68%', toggleActions: 'play none none reverse' }
});

gsap.from('.contact-form', {
    opacity: 0, y: 65, scale: 0.97, duration: 1.1,
    scrollTrigger: { trigger: '#contact .contact-layout', start: 'top 60%', toggleActions: 'play none none reverse' }
});

// Footer
gsap.from('.footer-cta h2, .footer-email-link', {
    opacity: 0, y: 40, duration: 0.8, stagger: 0.15,
    scrollTrigger: { trigger: '.footer-top', start: 'top 82%', toggleActions: 'play none none reverse' }
});

// ============================================
// 3D TILT EFFECTS
// ============================================
if (window.innerWidth > 768) {
    // Skill cards
    document.querySelectorAll('.skill-card-3d').forEach(card => {
        const inner = card.querySelector('.skill-card-inner');
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -16;
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 16;
            gsap.to(inner, { rotateX: rx, rotateY: ry, duration: 0.3, transformPerspective: 800 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        });
    });

    // Project images
    document.querySelectorAll('.project-3d-hover').forEach(img => {
        img.addEventListener('mousemove', (e) => {
            const r = img.getBoundingClientRect();
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
            gsap.to(img, { rotateX: rx, rotateY: ry, duration: 0.3, transformPerspective: 1000 });
        });
        img.addEventListener('mouseleave', () => {
            gsap.to(img, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
        });
    });

    // Magnetic buttons
    document.querySelectorAll('.magnetic-btn').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            gsap.to(el, {
                x: ((e.clientX - r.left) / r.width - 0.5) * 15,
                y: ((e.clientY - r.top) / r.height - 0.5) * 15,
                duration: 0.3
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
    });
}

// ============================================
// SKILLS FILTER TABS
// ============================================
const tabBtns = document.querySelectorAll('.tab-btn');
const skillCards = document.querySelectorAll('.skill-card-3d');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;

        skillCards.forEach(card => {
            if (cat === 'all' || card.dataset.category === cat) {
                card.classList.remove('hidden');
                gsap.fromTo(card, { opacity: 0, scale: 0.85, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' });
            } else {
                card.classList.add('hidden');
            }
        });

        // Re-animate meters for visible cards
        setTimeout(() => {
            document.querySelectorAll('.skill-card-3d:not(.hidden) .meter-fill').forEach(bar => {
                gsap.fromTo(bar, { width: 0 }, { width: bar.dataset.width + '%', duration: 1.2, ease: 'power3.out' });
            });
        }, 200);
    });
});

// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
const progressCircle = document.querySelector('.progress-ring-circle');
const circumference = 2 * Math.PI * 24;

if (progressCircle) {
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
}

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    if (scrollTop > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');

    if (progressCircle) {
        progressCircle.style.strokeDashoffset = Math.max(0, circumference - progress * circumference);
    }
}, { passive: true });

backToTop.addEventListener('click', () => {
    gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power3.inOut' });
});

// ============================================
// FORM
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.parentElement.querySelector('label'), { color: '#7c3aed', y: -2, duration: 0.3 });
        });
        input.addEventListener('blur', () => {
            gsap.to(input.parentElement.querySelector('label'), { color: '', y: 0, duration: 0.3 });
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = contactForm.querySelectorAll('[required]');
        let valid = true;

        inputs.forEach(inp => {
            if (!inp.value.trim()) {
                valid = false;
                gsap.to(inp, { borderBottomColor: '#ff6b6b', duration: 0.3 });
                gsap.fromTo(inp.parentElement, { x: -4 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
            } else {
                gsap.to(inp, { borderBottomColor: 'rgba(255,255,255,0.08)', duration: 0.3 });
            }
        });

        if (valid) {
            const btn = contactForm.querySelector('.submit-button');
            const txt = btn.querySelector('.btn-text');
            const ico = btn.querySelector('.btn-icon');
            const orig = txt.textContent;

            gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, onComplete: () => {
                txt.textContent = 'Sent Successfully!';
                ico.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.background = '#06d6a0';
                gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
            }});

            setTimeout(() => {
                txt.textContent = orig;
                ico.innerHTML = '<i class="fas fa-paper-plane"></i>';
                btn.style.background = '';
                contactForm.reset();
                contactForm.querySelectorAll('.input-line').forEach(l => gsap.to(l, { width: 0, duration: 0.3 }));
            }, 3000);
        }
    });
}

// ============================================
// MARQUEE CLONE
// ============================================
const marqueeTrack = document.querySelector('.marquee-track');
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeTrack && marqueeContent) {
    const clone = marqueeContent.cloneNode(true);
    marqueeTrack.appendChild(clone);
}

// ============================================
// ACTIVE NAV
// ============================================
const sections = document.querySelectorAll('section[id]');
const navItemsList = document.querySelectorAll('.nav-item');

sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => highlightNav(section.id),
        onEnterBack: () => highlightNav(section.id)
    });
});

function highlightNav(id) {
    navItemsList.forEach(item => {
        const isActive = item.getAttribute('href') === '#' + id;
        item.style.color = isActive ? 'var(--text-primary)' : '';
    });
}

// ============================================
// COPYRIGHT
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// ACCESSIBILITY
// ============================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(3);
    document.querySelectorAll('.floating-tag, .hero-gradient-orb, .hero-aurora, .hero-particles').forEach(el => el.style.display = 'none');
}

// ============================================
// INIT
// ============================================
window.addEventListener('load', () => {
    document.body.style.overflow = 'hidden';
    runPreloader();
    initParticles();
    init3DGlobe();
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 300);
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') ScrollTrigger.refresh();
});