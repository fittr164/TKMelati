/**
 * Floating Circles Manager
 * Mengatur lingkaran melayang interaktif di background
 */

class FloatingCirclesManager {
  constructor() {
    this.container = null;
    this.circles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'floating-elements-container';
    document.body.insertBefore(this.container, document.body.firstChild);

    // Generate circles
    this.generateCircles();

    // Add event listeners
    this.addEventListeners();
  }

  generateCircles() {
    const positions = [
      { x: 10, y: 15, class: 'circle-1 gradient-primary' },
      { x: 85, y: 20, class: 'circle-2 gradient-secondary' },
      { x: 5, y: 60, class: 'circle-3 gradient-primary' },
      { x: 90, y: 75, class: 'circle-4 gradient-secondary' },
      { x: 50, y: 85, class: 'circle-5 gradient-primary' },
      { x: 75, y: 35, class: 'circle-6 gradient-secondary' }
    ];

    positions.forEach((pos, index) => {
      const circle = document.createElement('div');
      circle.className = `floating-circle ${pos.class} interactive`;
      circle.style.left = `${pos.x}%`;
      circle.style.top = `${pos.y}%`;
      circle.dataset.index = index;
      circle.dataset.originalX = pos.x;
      circle.dataset.originalY = pos.y;
      circle.style.cursor = 'pointer';

      // Add pulse effect to some circles
      if (index % 2 === 0) {
        circle.classList.add('pulse');
      }

      this.container.appendChild(circle);
      this.circles.push({
        element: circle,
        x: pos.x,
        y: pos.y,
        originalX: pos.x,
        originalY: pos.y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        isBurst: false,
        burstTimeout: null
      });

      // Add click event untuk burst
      circle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.burstCircle(index);
      });
    });
  }

  burstCircle(index) {
    const circleData = this.circles[index];
    const circle = circleData.element;

    if (circleData.isBurst) return; // Prevent double burst

    circleData.isBurst = true;

    // Create burst particles
    this.createBurstEffect(circle);

    // Hide circle with animation
    circle.style.animation = 'none';
    circle.style.pointerEvents = 'none';
    circle.style.opacity = '0';
    circle.style.transform = 'scale(0.5)';

    // Clear existing timeout if any
    if (circleData.burstTimeout) {
      clearTimeout(circleData.burstTimeout);
    }

    // Respawn circle after 10 seconds
    circleData.burstTimeout = setTimeout(() => {
      this.respawnCircle(index);
    }, 10000);
  }

  respawnCircle(index) {
    const circleData = this.circles[index];
    const circle = circleData.element;

    circleData.isBurst = false;

    // Reset position
    circle.style.left = `${circleData.originalX}%`;
    circle.style.top = `${circleData.originalY}%`;

    // Restore animation
    const classes = circle.className;
    if (classes.includes('circle-1')) {
      circle.style.animation = 'float-circle 8s ease-in-out infinite';
    } else if (classes.includes('circle-2')) {
      circle.style.animation = 'float-circle 10s ease-in-out infinite 1s';
    } else if (classes.includes('circle-3')) {
      circle.style.animation = 'float-circle 9s ease-in-out infinite 2s';
    } else if (classes.includes('circle-4')) {
      circle.style.animation = 'float-circle 7s ease-in-out infinite 0.5s';
    } else if (classes.includes('circle-5')) {
      circle.style.animation = 'float-circle 11s ease-in-out infinite 1.5s';
    } else if (classes.includes('circle-6')) {
      circle.style.animation = 'float-circle 8s ease-in-out infinite 2.5s';
    }

    // Restore visibility with pop animation
    circle.style.pointerEvents = 'auto';
    circle.style.opacity = '0.6';
    circle.style.transform = 'scale(0)';
    
    // Trigger animation
    setTimeout(() => {
      circle.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      circle.style.transform = 'scale(1)';
      
      setTimeout(() => {
        circle.style.transition = '';
      }, 600);
    }, 10);
  }

  createBurstEffect(circle) {
    const rect = circle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    // Hitung jumlah particles berdasarkan ukuran circle
    const particleCount = Math.min(12, Math.ceil(radius / 5));

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = 3 + Math.random() * 4;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      this.createParticle(centerX, centerY, vx, vy);
    }

    // Add burst sound effect (visual only - pop animation)
    this.createPopAnimation(centerX, centerY, radius);
  }

  createParticle(x, y, vx, vy) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.borderRadius = '50%';
    
    // Random color palette - vibrant blues and cyans
    const hue = Math.random() * 60 + 160;  // 160-220 hue range
    particle.style.background = `hsl(${hue}, 100%, 60%)`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    
    // Enhanced dual-layer glow
    const glowColor = `hsl(${hue}, 100%, 60%)`;
    particle.style.boxShadow = `
      0 0 8px ${glowColor},
      0 0 16px ${glowColor},
      0 0 25px rgba(128, 208, 199, 0.6),
      inset 0 0 8px rgba(255, 255, 255, 0.3)
    `;

    document.body.appendChild(particle);

    let px = x;
    let py = y;
    let pvx = vx;
    let pvy = vy;
    const gravity = 0.15;
    let life = 1;

    const animate = () => {
      pvx *= 0.96; // Air resistance
      pvy = pvy * 0.96 + gravity;
      px += pvx;
      py += pvy;
      life -= 0.015;

      particle.style.left = px + 'px';
      particle.style.top = py + 'px';
      particle.style.opacity = Math.max(0, life).toString();
      particle.style.transform = `scale(${life})`;

      if (life > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    animate();
  }

  createPopAnimation(x, y, radius) {
    const pop = document.createElement('div');
    pop.style.position = 'fixed';
    pop.style.left = x + 'px';
    pop.style.top = y + 'px';
    pop.style.width = radius * 2 + 'px';
    pop.style.height = radius * 2 + 'px';
    pop.style.borderRadius = '50%';
    pop.style.border = '3px solid rgba(128, 208, 199, 0.8)';
    pop.style.pointerEvents = 'none';
    pop.style.zIndex = '998';
    pop.style.transform = 'translate(-50%, -50%)';
    pop.style.boxShadow = '0 0 20px rgba(128, 208, 199, 0.6), inset 0 0 20px rgba(128, 208, 199, 0.3)';
    pop.style.animation = 'pop-burst 0.8s ease-out forwards';

    document.body.appendChild(pop);

    setTimeout(() => pop.remove(), 800);
  }

  addEventListeners() {
    // Mouse move effect
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.circles.forEach((circle, index) => {
        if (circle.isBurst) return; // Skip burst circles

        const rect = circle.element.getBoundingClientRect();
        const circleX = rect.left + rect.width / 2;
        const circleY = rect.top + rect.height / 2;

        const dx = this.mouseX - circleX;
        const dy = this.mouseY - circleY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repulsion effect - circles move away dari mouse
        if (distance < 200) {
          const angle = Math.atan2(dy, dx);
          const force = (200 - distance) / 200 * 20;

          const moveX = -Math.cos(angle) * force;
          const moveY = -Math.sin(angle) * force;

          circle.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          circle.element.style.transform = 'translate(0, 0)';
        }
      });
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.repositionCircles();
    });

    // Click ripple effect
    document.addEventListener('click', (e) => {
      // Check if click is not on a circle
      if (!e.target.classList.contains('floating-circle')) {
        this.createClickRipple(e.clientX, e.clientY);
      }
    });
  }

  repositionCircles() {
    // Optional: reposition circles on window resize
    // Bisa di-implement jika diinginkan
  }

  createClickRipple(x, y) {
    // Optional: create visual ripple saat click
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.border = '2px solid rgba(128, 208, 199, 0.5)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple-expand 0.6s ease-out forwards';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.zIndex = '2';

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }
}

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-expand {
    0% {
      width: 20px;
      height: 20px;
      opacity: 1;
      box-shadow: 0 0 10px rgba(128, 208, 199, 0.8);
    }
    100% {
      width: 120px;
      height: 120px;
      opacity: 0;
      box-shadow: 0 0 30px rgba(128, 208, 199, 0);
    }
  }

  @keyframes pop-burst {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(0.3);
      border-width: 4px;
      box-shadow: 0 0 25px rgba(128, 208, 199, 0.9), inset 0 0 15px rgba(128, 208, 199, 0.6);
    }
    50% {
      opacity: 1;
      border-width: 2px;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(2.5);
      border-width: 0px;
      box-shadow: 0 0 50px rgba(128, 208, 199, 0), inset 0 0 15px rgba(128, 208, 199, 0);
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FloatingCirclesManager();
  });
} else {
  new FloatingCirclesManager();
}

console.log('✨ Floating Circles with Burst Feature Initialized!');
