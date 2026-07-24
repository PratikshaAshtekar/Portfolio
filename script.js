(() => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Floating header ---------- */
    const header = document.querySelector(".site-header");
    const onScrollHeader = () => {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });

    /* ---------- Mobile nav ---------- */
    const navToggle = document.getElementById("navToggle");
    const siteNav = document.getElementById("siteNav");

    const closeNav = () => {
        siteNav?.classList.remove("is-open");
        navToggle?.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
    };

    navToggle?.addEventListener("click", () => {
        const open = siteNav?.classList.toggle("is-open");
        navToggle.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", String(Boolean(open)));
    });

    siteNav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (e) => {
        if (!siteNav?.classList.contains("is-open")) return;
        if (siteNav.contains(e.target) || navToggle?.contains(e.target)) return;
        closeNav();
    });

    /* ---------- Active section indicator ---------- */
    const navLinks = [...document.querySelectorAll(".nav-link")];
    const sectionIds = navLinks
        .map((link) => link.getAttribute("href"))
        .filter((href) => href && href.startsWith("#"))
        .map((href) => href.slice(1));

    const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
    };

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]) {
                    setActiveLink(visible[0].target.id);
                }
            },
            {
                rootMargin: "-35% 0px -45% 0px",
                threshold: [0.1, 0.25, 0.5],
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    /* ---------- Smooth reveal ---------- */
    const reveals = [...document.querySelectorAll(".reveal")];

    document.querySelectorAll(".project-card:not(.reveal)").forEach((card, index) => {
        card.classList.add("reveal");
        card.style.setProperty("--reveal-delay", `${(index % 3) * 100}ms`);
        reveals.push(card);
    });

    if (reduceMotion) {
        reveals.forEach((el) => el.classList.add("is-visible"));
    } else if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );

        reveals.forEach((el) => revealObserver.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add("is-visible"));
    }

    /* ---------- Mouse glow ---------- */
    const root = document.documentElement;
    let glowRaf = null;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.3;

    const applyGlow = () => {
        glowRaf = null;
        root.style.setProperty("--mouse-x", `${targetX}px`);
        root.style.setProperty("--mouse-y", `${targetY}px`);
    };

    if (!reduceMotion) {
        window.addEventListener(
            "pointermove",
            (e) => {
                targetX = e.clientX;
                targetY = e.clientY;
                if (glowRaf == null) {
                    glowRaf = requestAnimationFrame(applyGlow);
                }
            },
            { passive: true }
        );
    }

    /* ---------- Button ripple ---------- */
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".primary-btn, .project-btn");
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
    });

    /* ---------- Contact form ---------- */
    const form = document.getElementById("contactForm");
    form?.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = new FormData(form);
        const name = String(data.get("name") || "").trim();
        const email = String(data.get("email") || "").trim();
        const subject = String(data.get("subject") || "Portfolio Inquiry").trim();
        const message = String(data.get("message") || "").trim();

        const body = [
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            message,
        ].join("\n");

        const mailto = `mailto:pratikshaashtekar5@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        let status = form.querySelector(".form-status");
        if (!status) {
            status = document.createElement("p");
            status.className = "form-status";
            form.appendChild(status);
        }
        status.textContent = "Opening your email client…";

        window.location.href = mailto;
        form.reset();
    });

    /* ---------- Experience timeline ---------- */
    const xpTimeline = document.getElementById("xpTimeline");
    const xpProgress = document.getElementById("xpProgress");
    const xpItems = [...document.querySelectorAll("[data-xp-item]")];

    const updateXpTimeline = () => {
        if (!xpTimeline || !xpProgress) return;

        const rect = xpTimeline.getBoundingClientRect();
        const view = window.innerHeight || document.documentElement.clientHeight;
        const total = rect.height;
        const scrolled = Math.min(total, Math.max(0, -rect.top + view * 0.35));
        const ratio = total > 0 ? Math.min(1, Math.max(0.08, scrolled / total)) : 0;

        xpProgress.style.height = `${ratio * 100}%`;

        xpItems.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const active = itemRect.top < view * 0.65 && itemRect.bottom > view * 0.25;
            item.classList.toggle("is-active", active);
        });
    };

    if (xpTimeline) {
        updateXpTimeline();
        window.addEventListener("scroll", updateXpTimeline, { passive: true });
        window.addEventListener("resize", updateXpTimeline, { passive: true });
    }

    /* ---------- Premium interactive cards ---------- */
    const interactiveSelector = [
        ".project-card",
        ".xp-card",
        ".skill-card",
        ".education-card",
        ".certificate-card",
        ".xp-highlight",
        ".xp-achievement",
    ].join(",");

    const interactiveCards = [...document.querySelectorAll(interactiveSelector)];

    const lerp = (a, b, t) => a + (b - a) * t;

    const initInteractiveCard = (card) => {
        card.classList.add("interactive-card");

        if (!card.querySelector(":scope > .card-spotlight")) {
            const spotlight = document.createElement("span");
            spotlight.className = "card-spotlight";
            spotlight.setAttribute("aria-hidden", "true");
            card.prepend(spotlight);
        }

        if (!card.querySelector(":scope > .card-border")) {
            const border = document.createElement("span");
            border.className = "card-border";
            border.setAttribute("aria-hidden", "true");
            card.prepend(border);
        }

        if (reduceMotion) return;

        const isMicro = card.classList.contains("xp-achievement") || card.classList.contains("xp-highlight");
        const maxTilt = isMicro ? 3 : 6;
        const lift = isMicro ? -6 : -10;

        const state = {
            hover: false,
            tx: 0.5,
            ty: 0.5,
            mx: 0.5,
            my: 0.5,
            lift: 0,
            raf: 0,
        };

        const render = () => {
            state.mx = lerp(state.mx, state.tx, 0.14);
            state.my = lerp(state.my, state.ty, 0.14);
            state.lift = lerp(state.lift, state.hover ? lift : 0, 0.16);

            const rotateX = (0.5 - state.my) * (maxTilt * 2);
            const rotateY = (state.mx - 0.5) * (maxTilt * 2);

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg) translate3d(0, ${state.lift.toFixed(3)}px, 0)`;
            card.style.setProperty("--spot-x", `${(state.mx * 100).toFixed(2)}%`);
            card.style.setProperty("--spot-y", `${(state.my * 100).toFixed(2)}%`);
            card.style.setProperty("--spot-opacity", state.hover ? "1" : "0");

            const settling =
                Math.abs(state.tx - state.mx) > 0.001 ||
                Math.abs(state.ty - state.my) > 0.001 ||
                Math.abs(state.lift - (state.hover ? lift : 0)) > 0.05;

            if (state.hover || settling) {
                state.raf = requestAnimationFrame(render);
            } else {
                state.raf = 0;
                card.style.transform = "";
            }
        };

        const start = () => {
            if (!state.raf) state.raf = requestAnimationFrame(render);
        };

        card.addEventListener(
            "pointerenter",
            (e) => {
                state.hover = true;
                card.classList.add("is-hovered");
                const rect = card.getBoundingClientRect();
                state.tx = (e.clientX - rect.left) / rect.width;
                state.ty = (e.clientY - rect.top) / rect.height;
                start();
            },
            { passive: true }
        );

        card.addEventListener(
            "pointermove",
            (e) => {
                const rect = card.getBoundingClientRect();
                state.tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                state.ty = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
                start();
            },
            { passive: true }
        );

        card.addEventListener(
            "pointerleave",
            () => {
                state.hover = false;
                state.tx = 0.5;
                state.ty = 0.5;
                card.classList.remove("is-hovered");
                start();
            },
            { passive: true }
        );
    };

    interactiveCards.forEach(initInteractiveCard);

    /* ---------- Neural network canvas ---------- */
    const canvas = document.getElementById("networkCanvas");
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles = [];
    let animId = null;
    let running = true;

    const PARTICLE_COUNT_DESKTOP = 55;
    const PARTICLE_COUNT_MOBILE = 28;
    const CONNECT_DIST = 140;

    const createParticles = (count) => {
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.6,
        }));
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = width < 700 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
        createParticles(count);
    };

    const draw = () => {
        if (!running) return;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(148, 163, 255, 0.55)";
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.hypot(dx, dy);

                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.28;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
        running = document.visibilityState === "visible";
        if (running && animId == null) {
            animId = requestAnimationFrame(draw);
        }
        if (!running && animId != null) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    };

    resize();
    draw();

    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
})();
