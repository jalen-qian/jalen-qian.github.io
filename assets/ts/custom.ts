/**
 * Canvas Nest-inspired background.
 *
 * Nearby drifting particles form a soft network. The pointer temporarily
 * becomes another node: slow movement attracts particles and creates denser
 * connections, while fast movement weakens those connections immediately.
 */

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
};

const finePointer = window.matchMedia('(pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopLayout = window.matchMedia('(min-width: 768px)');

if (finePointer.matches && !reducedMotion.matches && desktopLayout.matches) {
    const canvas = document.createElement('canvas');
    canvas.className = 'ambient-particle-network';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const context = canvas.getContext('2d');

    if (context) {
        const particles: Particle[] = [];
        const pointer = {
            x: 0,
            y: 0,
            previousX: 0,
            previousY: 0,
            speed: 0,
            active: false,
            lastMove: 0
        };

        let width = window.innerWidth;
        let height = window.innerHeight;
        let pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        let animationFrame = 0;
        let previousFrame = 0;
        let resizeTimer = 0;
        let color = '52, 73, 94';

        const particleConnectionDistance = 108;
        const pointerConnectionDistance = 175;

        const randomBetween = (minimum: number, maximum: number) =>
            minimum + Math.random() * (maximum - minimum);

        const createParticle = (): Particle => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: randomBetween(-0.22, 0.22),
            vy: randomBetween(-0.22, 0.22),
            radius: randomBetween(0.7, 1.35)
        });

        const updateColor = () => {
            color = document.documentElement.dataset.scheme === 'dark'
                ? '205, 219, 228'
                : '52, 73, 94';
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            // Comparable to the reference's 99 points on a full HD screen,
            // with a conservative cap for high-resolution displays.
            const desiredCount = Math.max(48, Math.min(96, Math.round((width * height) / 21000)));
            while (particles.length < desiredCount) particles.push(createParticle());
            if (particles.length > desiredCount) particles.length = desiredCount;
        };

        const drawConnection = (
            fromX: number,
            fromY: number,
            toX: number,
            toY: number,
            opacity: number,
            lineWidth: number
        ) => {
            context.beginPath();
            context.lineWidth = lineWidth;
            context.strokeStyle = `rgba(${color}, ${opacity})`;
            context.moveTo(fromX, fromY);
            context.lineTo(toX, toY);
            context.stroke();
        };

        const updateParticle = (particle: Particle, frameScale: number) => {
            if (pointer.active && pointer.speed < 1.1) {
                const dx = pointer.x - particle.x;
                const dy = pointer.y - particle.y;
                const distance = Math.hypot(dx, dy);

                if (distance < pointerConnectionDistance && distance > 1) {
                    const force = (1 - distance / pointerConnectionDistance) * 0.012 * frameScale;
                    particle.vx += (dx / distance) * force;
                    particle.vy += (dy / distance) * force;
                }
            }

            const speed = Math.hypot(particle.vx, particle.vy);
            if (speed > 0.72) {
                particle.vx = (particle.vx / speed) * 0.72;
                particle.vy = (particle.vy / speed) * 0.72;
            }

            particle.x += particle.vx * frameScale;
            particle.y += particle.vy * frameScale;

            if (particle.x <= 0 || particle.x >= width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(width, particle.x));
            }
            if (particle.y <= 0 || particle.y >= height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(height, particle.y));
            }
        };

        const draw = (time: number) => {
            animationFrame = window.requestAnimationFrame(draw);
            if (document.hidden || time - previousFrame < 32) return;

            const elapsed = previousFrame ? Math.min(time - previousFrame, 64) : 32;
            const frameScale = elapsed / 16.667;
            previousFrame = time;

            if (pointer.active) {
                pointer.speed *= Math.pow(0.8, frameScale);
                if (time - pointer.lastMove > 1600) pointer.speed = 0;
            }

            context.clearRect(0, 0, width, height);

            for (const particle of particles) updateParticle(particle, frameScale);

            // Connect nearby particles. Squared distances avoid unnecessary
            // square roots in this O(n²) portion of the animation.
            const connectionDistanceSquared = particleConnectionDistance ** 2;
            for (let index = 0; index < particles.length; index++) {
                const particle = particles[index];

                for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex++) {
                    const other = particles[otherIndex];
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distanceSquared = dx * dx + dy * dy;

                    if (distanceSquared < connectionDistanceSquared) {
                        const strength = 1 - distanceSquared / connectionDistanceSquared;
                        drawConnection(
                            particle.x,
                            particle.y,
                            other.x,
                            other.y,
                            0.05 + strength * 0.18,
                            0.45 + strength * 0.35
                        );
                    }
                }
            }

            // Treat the pointer as a temporary network node. Fast movement
            // rapidly fades the links, which creates the requested release.
            if (pointer.active) {
                const pointerDistanceSquared = pointerConnectionDistance ** 2;
                const movementStrength = Math.max(0, Math.min(1, 1.35 - pointer.speed));

                if (movementStrength > 0) {
                    for (const particle of particles) {
                        const dx = particle.x - pointer.x;
                        const dy = particle.y - pointer.y;
                        const distanceSquared = dx * dx + dy * dy;

                        if (distanceSquared < pointerDistanceSquared) {
                            const strength = (1 - distanceSquared / pointerDistanceSquared) * movementStrength;
                            drawConnection(
                                particle.x,
                                particle.y,
                                pointer.x,
                                pointer.y,
                                0.08 + strength * 0.3,
                                0.5 + strength * 0.55
                            );
                        }
                    }
                }
            }

            context.fillStyle = `rgba(${color}, 0.42)`;
            for (const particle of particles) {
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
            }
        };

        window.addEventListener('pointermove', (event) => {
            const now = performance.now();
            const elapsed = Math.max(now - pointer.lastMove, 16);

            if (!pointer.active) {
                pointer.previousX = event.clientX;
                pointer.previousY = event.clientY;
                pointer.active = true;
            }

            pointer.speed = Math.hypot(
                event.clientX - pointer.previousX,
                event.clientY - pointer.previousY
            ) / elapsed;
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.previousX = event.clientX;
            pointer.previousY = event.clientY;
            pointer.lastMove = now;
        }, { passive: true });

        document.documentElement.addEventListener('mouseleave', () => {
            pointer.active = false;
        });

        window.addEventListener('blur', () => {
            pointer.active = false;
        });

        window.addEventListener('resize', () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(resize, 120);
        }, { passive: true });

        const schemeObserver = new MutationObserver(updateColor);
        schemeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-scheme']
        });

        updateColor();
        resize();
        animationFrame = window.requestAnimationFrame(draw);

        window.addEventListener('beforeunload', () => {
            window.cancelAnimationFrame(animationFrame);
            schemeObserver.disconnect();
        }, { once: true });
    }
}
