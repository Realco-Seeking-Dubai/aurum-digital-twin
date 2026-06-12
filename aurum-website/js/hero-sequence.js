// Core Aurum Hero Canvas Sequence Logic
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");

  const TOTAL_FRAMES = 40;
  const images = [];
  const frameState = { frame: 0 };

  // Generate Frame URLs using user pattern:
  // `/aurum-hero-sequence/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`
  function getFramePath(index) {
    const frameNumber = String(index + 1).padStart(3, "0");
    return `./public/hero-section/ezgif-frame-${frameNumber}.jpg`;
  }

  // Preload Images
  let loadedCount = 0;
  function preloadImages() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        // Draw frame 001 immediately on first load
        if (i === 0) {
          drawFrame(0);
        }
      };
      images.push(img);
    }
  }

  // Cover Scaling math logic
  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;

    // Calculate background-size: cover scale factor
    const scale = Math.max(canvasW / imgW, canvasH / imgH);

    // Center image
    const offsetX = (canvasW - imgW * scale) / 2;
    const offsetY = (canvasH - imgH * scale) / 2;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, offsetX, offsetY, imgW * scale, imgH * scale);
  }

  // Resize canvas handler
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(Math.round(frameState.frame));
    drawGrid();
  }

  // Draw Grid Canvas
  const gridCanvas = document.getElementById("hero-grid");
  const gridCtx = gridCanvas.getContext("2d");

  function drawGrid() {
    gridCanvas.width = window.innerWidth;
    gridCanvas.height = window.innerHeight;
    
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    
    const step = 60; // Grid square size
    gridCtx.strokeStyle = "rgba(236, 231, 218, 0.08)"; // Low opacity cream
    gridCtx.lineWidth = 1;
    
    // Draw columns
    for (let x = 0; x < gridCanvas.width; x += step) {
      gridCtx.beginPath();
      gridCtx.moveTo(x, 0);
      gridCtx.lineTo(x, gridCanvas.height);
      gridCtx.stroke();
    }
    
    // Draw rows
    for (let y = 0; y < gridCanvas.height; y += step) {
      gridCtx.beginPath();
      gridCtx.moveTo(0, y);
      gridCtx.lineTo(gridCanvas.width, y);
      gridCtx.stroke();
    }
  }

  // Initialize Canvas Sizes & Preloading
  window.addEventListener("resize", resizeCanvas);
  preloadImages();
  resizeCanvas(); // Sets initial scale and draws background grid

  // Register GSAP plugins & Scroll Animation
  gsap.registerPlugin(ScrollTrigger);

  // Animate text & scroll cue fade out on scroll down
  const heroContent = document.querySelector(".hero-content");
  const scrollCue = document.querySelector(".hero-scroll-cue");

  // GSAP Scrub animation
  gsap.to(frameState, {
    frame: TOTAL_FRAMES - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=300%", // Scroll distance matching spacer height
      scrub: 0.5,
      pin: true,
      onUpdate: (self) => {
        drawFrame(Math.round(frameState.frame));
        
        // Dynamic opacity values for UI overlay text & scroll cue
        const progress = self.progress;
        heroContent.style.opacity = Math.max(0, 1 - progress * 2.5);
        scrollCue.style.opacity = Math.max(0, 1 - progress * 4);

        // Show/hide navbar based on progress
        const nav = document.querySelector(".aurum-nav");
        if (nav) {
          if (progress > 0.05) {
            nav.classList.add("nav-visible");
          } else {
            nav.classList.remove("nav-visible");
          }
        }
      }
    }
  });

  const stateElements = document.querySelectorAll(".feature-state");
  const navButtons = document.querySelectorAll(".feature-nav button");

  function updateStates(activeIndex) {
    stateElements.forEach((el, index) => {
      const video = el.querySelector("video");
      if (index === activeIndex) {
        el.classList.add("active");
        if (video) {
          video.play().catch(() => {});
        }
      } else {
        el.classList.remove("active");
        if (video) {
          video.pause();
        }
      }
    });

    navButtons.forEach((btn, index) => {
      if (index === activeIndex) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Setup responsive GSAP media queries
  let mm = gsap.matchMedia();

  // Desktop Pinned Walkthrough Layout
  mm.add("(min-width: 769px)", () => {
    window.walkthroughTrigger = ScrollTrigger.create({
      trigger: ".feature-walkthrough",
      start: "top top",
      end: "+=400%",
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        let activeIndex = 0;

        if (progress < 0.25) {
          activeIndex = 0;
        } else if (progress >= 0.25 && progress < 0.50) {
          activeIndex = 1;
        } else if (progress >= 0.50 && progress < 0.75) {
          activeIndex = 2;
        } else {
          activeIndex = 3;
        }

        updateStates(activeIndex);
      }
    });

    // Handle clicking left navigation to scroll to specific states (Desktop only)
    const btnListeners = [];
    navButtons.forEach((btn, index) => {
      const listener = () => {
        if (!window.walkthroughTrigger) return;
        const progressPoints = [0.125, 0.375, 0.625, 0.875];
        const targetProgress = progressPoints[index];
        
        const startScroll = window.walkthroughTrigger.start;
        const endScroll = window.walkthroughTrigger.end;
        const targetScroll = startScroll + (endScroll - startScroll) * targetProgress;

        window.scrollTo({
          top: targetScroll,
          behavior: "smooth"
        });
      };
      btn.addEventListener("click", listener);
      btnListeners.push({ btn, listener });
    });

    // Cleanup when leaving desktop media query breakpoint
    return () => {
      if (window.walkthroughTrigger) {
        window.walkthroughTrigger.kill();
        window.walkthroughTrigger = null;
      }
      btnListeners.forEach(({ btn, listener }) => {
        btn.removeEventListener("click", listener);
      });
      // Reset active states for clean fallback
      stateElements.forEach(el => el.classList.remove("active"));
      navButtons.forEach(btn => btn.classList.remove("active"));
    };
  });

  // Mobile Stacked Normal Scroll Layout
  mm.add("(max-width: 768px)", () => {
    // Autoplay all videos since they are stacked and visible simultaneously
    stateElements.forEach((el) => {
      const video = el.querySelector("video");
      if (video) {
        video.play().catch(() => {});
      }
    });
  });
});
