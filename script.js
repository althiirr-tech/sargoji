// ================================================================
// SCRIPT.JS — semua kode JavaScript
// ================================================================

(function() {
  "use strict";

  // =============================================
  // 1. PARTICLE BACKGROUND
  // =============================================
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: null, y: null };
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 8000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // =============================================
  // 2. NAVBAR SCROLL EFFECT
  // =============================================
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = currentScroll;
  });

  // =============================================
  // 3. MOBILE MENU
  // =============================================
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
    document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "auto";
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "auto";
    });
  });

  // =============================================
  // 4. SCROLL REVEAL
  // =============================================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // =============================================
  // 5. SKILL BARS ANIMATION
  // =============================================
  const skillBars = document.querySelectorAll(".skill-bar-fill");

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute("data-target");
          if (target) {
            entry.target.style.setProperty("--target", target);
            entry.target.classList.add("animated");
          }
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  skillBars.forEach((bar) => barObserver.observe(bar));

  // =============================================
  // 6. TIMELINE ACTIVE STATE
  // =============================================
  const timelineItems = document.querySelectorAll(".timeline-item");

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));

  // =============================================
  // 7. CONTACT FORM HANDLER
  // =============================================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        alert("Mohon isi semua field!");
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        alert("Mohon masukkan email yang valid!");
        return;
      }

      const btn = this.querySelector("button[type='submit']");
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Mengirim...';
      btn.disabled = true;

      setTimeout(() => {
        alert("Pesan berhasil dikirim! (Simulasi)");
        btn.innerHTML = originalText;
        btn.disabled = false;
        this.reset();
      }, 1500);
    });
  }

  // =============================================
  // 8. SMOOTH SCROLL
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // =============================================
  // 9. AVATAR 3D HOVER (ring effect)
  // =============================================
  const avatarFrame = document.querySelector(".avatar-frame");
  if (avatarFrame) {
    avatarFrame.addEventListener("mouseenter", () => {
      const rings = document.querySelectorAll(".circuit-ring");
      rings.forEach((ring, i) => {
        ring.style.borderColor = "rgba(59, 130, 246, 0.6)";
        ring.style.transition = "border-color 0.5s ease";
        setTimeout(() => {
          ring.style.borderColor = "";
        }, 1000 + i * 200);
      });
    });
  }

  // =============================================
  // 10. ESCAPE KEY untuk close mobile menu
  // =============================================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "auto";
    }
  });

  console.log("Portofolio Fathir 3D — siap beraksi!");
})();