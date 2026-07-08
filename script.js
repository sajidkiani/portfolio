/* Security: prevent clickjacking (defense-in-depth alongside CSP) */
if (window.self !== window.top) {
  document.body.innerHTML = '';
  window.top.location = window.self.location;
}

/* Navigation toggle */
(function() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navLinks.classList.toggle('open', isOpen);
  });
})();

/* Custom cursor */
(function() {
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  if (!dot || !ring) return;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx - 4 + 'px';
    dot.style.top = my - 4 + 'px';
  });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animCursor() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }

  animCursor();

  document.querySelectorAll('a, button, .writeup-card, .btn').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '50px';
      ring.style.height = '50px';
      ring.style.opacity = '0.6';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.opacity = '1';
    });
  });
})();

/* Three.js 3D particle field */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const COUNT = 2000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const t = Math.random();
    if (t < 0.6) {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.52;
      colors[i * 3 + 2] = 0.63;
    } else if (t < 0.85) {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 0.62;
    } else {
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.42;
      colors[i * 3 + 2] = 0.21;
    }
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  const gridMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.04 });
  const gridGeo = new THREE.BufferGeometry();
  const gridVerts = [];

  for (let x = -15; x <= 15; x += 2) {
    gridVerts.push(x, -15, -5, x, 15, -5);
  }
  for (let y = -15; y <= 15; y += 2) {
    gridVerts.push(-15, y, -5, 15, y, -5);
  }

  gridGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridVerts), 3));
  const grid = new THREE.LineSegments(gridGeo, gridMat);
  scene.add(grid);

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  function animate(t) {
    requestAnimationFrame(animate);
    mat.opacity = Math.max(0.05, 0.55 - scrollY * 0.0003);
    particles.rotation.y = t * 0.00004 + mouseX * 0.1;
    particles.rotation.x = mouseY * 0.08;
    grid.rotation.y = t * 0.00002 + mouseX * 0.05;
    renderer.render(scene, camera);
  }

  animate(0);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* Writeup filter */
function filterWriteups(cat) {
  document.querySelectorAll('.w-tab').forEach((tab) => {
    const isActive = tab.dataset.cat === cat;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  document.querySelectorAll('.writeup-card').forEach((card) => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? 'flex' : 'none';

    if (show && typeof gsap !== 'undefined') {
      gsap.fromTo(card, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
    }
  });
}

/* Page interactions and animations */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.w-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      filterWriteups(tab.dataset.cat || 'all');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const hamburger = document.querySelector('.nav-hamburger');
      const navLinks = document.querySelector('.nav-links');
      if (hamburger && navLinks) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      }
    });
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
      .to('.hero-name', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
      .to('.hero-role', { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
      .to('.hero-desc', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.scroll-hint', { opacity: 1, duration: 0.5 }, '-=0.2');

    gsap.set(
      ['.hero-tag', '.hero-name', '.hero-role', '.hero-desc', '.hero-stats', '.hero-cta', '.scroll-hint'],
      { y: 30 }
    );

    gsap.utils.toArray('.tl-item').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.7,
        delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    gsap.utils.toArray('.skill-group').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    gsap.utils.toArray('.writeup-card').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.07,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => observer.observe(section));
});
