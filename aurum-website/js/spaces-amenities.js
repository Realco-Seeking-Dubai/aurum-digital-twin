/**
 * Aurum Website - Spaces & Amenities Cinematic Gallery Controller
 */
document.addEventListener("DOMContentLoaded", () => {
  const scroller = document.querySelector(".gallery-scroller");
  const slides = document.querySelectorAll(".gallery-slide");
  const progressFill = document.getElementById("gallery-progress-fill");
  const currentSlideNum = document.getElementById("current-slide-num");
  const indicators = document.querySelectorAll(".gallery-indicator");

  if (!scroller || slides.length === 0) return;

  // Track scroll position to update progress bar continuously
  const updateProgress = () => {
    const scrollLeft = scroller.scrollLeft;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (maxScroll <= 0) return;
    
    // Calculate total progress percentage (0% to 100%)
    const pct = (scrollLeft / maxScroll) * 100;
    
    // Apply to progress bar width
    if (progressFill) {
      progressFill.style.width = `${pct}%`;
    }
  };

  // Add scroll listener with passive performance flag
  scroller.addEventListener("scroll", updateProgress, { passive: true });

  // Update active states of slides, count, and indicators using Intersection Observer
  const observerOptions = {
    root: scroller,
    threshold: 0.5 // Trigger when a slide is at least 50% visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slide = entry.target;
        const index = parseInt(slide.getAttribute("data-index"), 10);
        
        // Remove active class from all slides
        slides.forEach(s => s.classList.remove("active"));
        // Add active class to current slide to trigger CSS transitions
        slide.classList.add("active");

        // Update current slide number display
        if (currentSlideNum) {
          currentSlideNum.textContent = `0${index + 1}`;
        }

        // Sync indicator active state
        indicators.forEach((ind, i) => {
          if (i === index) {
            ind.classList.add("active");
          } else {
            ind.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  slides.forEach(slide => observer.observe(slide));

  // Handle click events on indicators for smooth slide snapping
  indicators.forEach(indicator => {
    indicator.addEventListener("click", () => {
      const slideIndex = parseInt(indicator.getAttribute("data-slide"), 10);
      const targetSlide = slides[slideIndex];
      if (targetSlide) {
        targetSlide.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start"
        });
      }
    });
  });

  // Run initial progress calculation
  updateProgress();

  // Mobile Menu Toggle Logic
  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  const navElement = document.querySelector(".aurum-nav");
  
  if (toggleBtn && navElement) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navElement.classList.toggle("mobile-menu-open");
      toggleBtn.setAttribute("aria-expanded", isOpen);
    });
    
    // Close mobile menu if clicked outside
    document.addEventListener("click", (e) => {
      if (navElement.classList.contains("mobile-menu-open") && !navElement.contains(e.target)) {
        navElement.classList.remove("mobile-menu-open");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Global Navigation Scroll Management
  const navLinks = document.querySelectorAll("[data-scroll-to], .aurum-nav .nav-links a, .aurum-nav .nav-brand, .mobile-nav-links a");
  
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      
      let targetType = link.getAttribute("data-scroll-to");
      
      // Fallback for header links that don't have data-scroll-to explicitly
      if (!targetType) {
        const text = link.textContent.trim().toLowerCase();
        if (text.includes("overview") || text.includes("realco")) targetType = "overview";
        else if (text.includes("digital twin")) targetType = "digital-twin";
        else if (text.includes("location")) targetType = "location";
        else if (text.includes("contact")) targetType = "contact";
      }

      // Close mobile menu when a link is clicked
      if (navElement && navElement.classList.contains("mobile-menu-open")) {
        navElement.classList.remove("mobile-menu-open");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      }

      if (targetType === "overview") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (targetType === "digital-twin") {
        const target = document.getElementById("digital-twin");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      } else if (targetType === "location") {
        scrollToWalkthroughState(2);
      } else if (targetType === "corporate-ecosystem") {
        scrollToWalkthroughState(1);
      } else if (targetType === "courtyard-walkthrough") {
        scrollToWalkthroughState(3);
      } else if (targetType === "inventory" || targetType === "investment-intelligence") {
        const target = document.getElementById("inventory-intelligence");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      } else if (targetType === "spaces-amenities") {
        const target = document.getElementById("spaces-amenities");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      } else if (targetType === "executive-offices") {
        const target = document.getElementById("spaces-amenities");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          // Also scroll the internal scroller to slide 1
          setTimeout(() => {
            const innerScroller = document.querySelector(".gallery-scroller");
            const gallerySlides = document.querySelectorAll(".gallery-slide");
            if (innerScroller && gallerySlides[1]) {
              gallerySlides[1].scrollIntoView({ behavior: "smooth", inline: "start" });
            }
          }, 800);
        }
      } else if (targetType === "contact") {
        const target = document.getElementById("footer-contact");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  function scrollToWalkthroughState(stateIndex) {
    if (window.walkthroughTrigger) {
      const progressPoints = [0.125, 0.375, 0.625, 0.875];
      const targetProgress = progressPoints[stateIndex];
      const startScroll = window.walkthroughTrigger.start;
      const endScroll = window.walkthroughTrigger.end;
      const targetScroll = startScroll + (endScroll - startScroll) * targetProgress;

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    } else {
      // Fallback if ScrollTrigger is not ready yet
      const target = document.getElementById("digital-twin");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  }
});
