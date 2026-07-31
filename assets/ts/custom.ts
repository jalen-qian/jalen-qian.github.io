/**
 * A restrained interactive line field for the empty space around Stack's
 * cards. Lines drift naturally, gather around a slowly moving pointer and
 * scatter when the pointer accelerates or leaves the window.
 */

type LineParticle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number;
    angularVelocity: number;
    length: number;
    attached: boolean;
    offsetX: number;
    offsetY: number;
};

const finePointer = window.matchMedia('(pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopLayout = window.matchMedia('(min-width: 768px)');

if (finePointer.matches && !reducedMotion.matches && desktopLayout.matches) {
    const canvas = document.createElement('canvas');
    canvas.className = 'ambient-line-field';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const context = canvas.getContext('2d');

    if (context) {
        const particles: LineParticle[] = [];
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
        let lineColor = '';

        const randomBetween = (minimum: number, maximum: number) =>
            minimum + Math.random() * (maximum - minimum);

        const createParticle = (): LineParticle => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: randomBetween(-0.14, 0.14),
            vy: randomBetween(-0.14, 0.14),
            angle: Math.random() * Math.PI * 2,
            angularVelocity: randomBetween(-0.0025, 0.0025),
            length: randomBetween(12, 28),
            attached: false,
            offsetX: 0,
            offsetY: 0
        });

        const updateColor = () => {
            const dark = document.documentElement.dataset.scheme === 'dark';
            lineColor = dark ? 'rgba(210, 222, 230, 0.16)' : 'rgba(52, 73, 94, 0.15)';
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

            const desiredCount = Math.max(24, Math.min(54, Math.round((width * height) / 42000)));
            while (particles.length < desiredCount) particles.push(createParticle());
            if (particles.length > desiredCount) particles.length = desiredCount;
        };

        const releaseParticles = (withImpulse: boolean) => {
            for (const particle of particles) {
                if (!particle.attached) continue;
                particle.attached = false;
                if (withImpulse) {
                    const distance = Math.hypot(particle.offsetX, particle.offsetY) || 1;
                    particle.vx += (particle.offsetX / distance) * randomBetween(0.7, 1.4);
                    particle.vy += (particle.offsetY / distance) * randomBetween(0.7, 1.4);
                }
            }
        };

        const attachParticle = (particle: LineParticle) => {
            const radius = randomBetween(18, 72);
            const angle = Math.random() * Math.PI * 2;
            particle.attached = true;
            particle.offsetX = Math.cos(angle) * radius;
            particle.offsetY = Math.sin(angle) * radius;
        };

        const updateParticle = (particle: LineParticle, frameScale: number) => {
            if (particle.attached && pointer.active) {
                const targetX = pointer.x + particle.offsetX;
                const targetY = pointer.y + particle.offsetY;
                particle.vx += (targetX - particle.x) * 0.018 * frameScale;
                particle.vy += (targetY - particle.y) * 0.018 * frameScale;
                particle.vx *= Math.pow(0.84, frameScale);
                particle.vy *= Math.pow(0.84, frameScale);
            } else {
                if (pointer.active && pointer.speed < 0.75) {
                    const dx = pointer.x - particle.x;
                    const dy = pointer.y - particle.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 190 && distance > 1) {
                        const attraction = (1 - distance / 190) * 0.016 * frameScale;
                        particle.vx += (dx / distance) * attraction;
                        particle.vy += (dy / distance) * attraction;

                        if (distance < 38 && Math.random() < 0.045 * frameScale) {
                            attachParticle(particle);
                        }
                    }
                }

                particle.vx *= Math.pow(0.997, frameScale);
                particle.vy *= Math.pow(0.997, frameScale);
            }

            const maximumSpeed = particle.attached ? 3.2 : 1.5;
            const speed = Math.hypot(particle.vx, particle.vy);
            if (speed > maximumSpeed) {
                particle.vx = (particle.vx / speed) * maximumSpeed;
                particle.vy = (particle.vy / speed) * maximumSpeed;
            }

            particle.x += particle.vx * frameScale;
            particle.y += particle.vy * frameScale;
            particle.angle += particle.angularVelocity * frameScale;

            const margin = particle.length + 8;
            if (particle.x < -margin) particle.x = width + margin;
            if (particle.x > width + margin) particle.x = -margin;
            if (particle.y < -margin) particle.y = height + margin;
            if (particle.y > height + margin) particle.y = -margin;
        };

        const draw = (time: number) => {
            animationFrame = window.requestAnimationFrame(draw);
            if (document.hidden || time - previousFrame < 32) return;

            const elapsed = previousFrame ? Math.min(time - previousFrame, 64) : 32;
            const frameScale = elapsed / 16.667;
            previousFrame = time;

            if (pointer.active) {
                pointer.speed *= Math.pow(0.82, frameScale);
                if (time - pointer.lastMove > 1800) pointer.speed = 0;
            }

            context.clearRect(0, 0, width, height);
            context.strokeStyle = lineColor;
            context.lineWidth = 1.15;
            context.lineCap = 'round';

            for (const particle of particles) {
                updateParticle(particle, frameScale);
                const halfLength = particle.length / 2;
                const dx = Math.cos(particle.angle) * halfLength;
                const dy = Math.sin(particle.angle) * halfLength;
                context.beginPath();
                context.moveTo(particle.x - dx, particle.y - dy);
                context.lineTo(particle.x + dx, particle.y + dy);
                context.stroke();
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

            const distance = Math.hypot(
                event.clientX - pointer.previousX,
                event.clientY - pointer.previousY
            );
            pointer.speed = distance / elapsed;
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.previousX = event.clientX;
            pointer.previousY = event.clientY;
            pointer.lastMove = now;

            if (pointer.speed > 1.25) releaseParticles(true);
        }, { passive: true });

        document.documentElement.addEventListener('mouseleave', () => {
            pointer.active = false;
            releaseParticles(false);
        });

        window.addEventListener('blur', () => {
            pointer.active = false;
            releaseParticles(false);
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
