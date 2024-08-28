// Clock and Timezone
const updateClock = () => {
  const estElement = document.getElementById('est');
  if (estElement) {
      const estTime = new Date().toLocaleString('nl-NL', { timeZone: 'America/Toronto' });
      estElement.textContent = estTime;
  }
};

setInterval(updateClock, 1000);

// Theme Switcher
const calculateTheme = ({ localStorageTheme, systemSettingDark }) => 
  localStorageTheme ?? (systemSettingDark.matches ? "dark" : "light");

const updateButton = ({ button, isDark }) => {
  button.setAttribute("aria-label", isDark ? "Switch to Light Mode" : "Switch to Dark Mode");
  document.getElementById("light-icon").style.display = isDark ? "block" : "none";
  document.getElementById("dark-icon").style.display = isDark ? "none" : "block";
};

const updateThemeOnHtml = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
};

const initializeTheme = () => {
  const button = document.querySelector("[data-theme-toggle]") || document.getElementById("theme-toggle");
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

  let currentTheme = calculateTheme({ localStorageTheme, systemSettingDark });

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateButton({ button, isDark: theme === "dark" });
    
    // Force a repaint to ensure immediate application of styles
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger a reflow
    document.body.style.display = '';
  }

  applyTheme(currentTheme);

  button.addEventListener("click", () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    currentTheme = newTheme;
  });

  // Listen for system theme changes
  systemSettingDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      currentTheme = e.matches ? "dark" : "light";
      applyTheme(currentTheme);
    }
  });
};

// Divider Animation
const initializeDividerAnimation = () => {
  const allDividers = [...document.querySelectorAll(".divider")];
  const scrollPositions = new Array(allDividers.length).fill(0);
  let lastScrollTop = 0;
  let ticking = false;

  const isDividerVisible = (elem) => {
    const rect = elem.getBoundingClientRect();
    return rect && (rect.y <= window.innerHeight + 200 && rect.y >= -200);
  };

  const animateDividers = () => {
    const curScrollTop = window.scrollY || document.documentElement.scrollTop;
    const direction = curScrollTop < lastScrollTop ? 1 : -1;
    const speed = 0.015 * (lastScrollTop - curScrollTop);
    const scaleRange = 0.2;

    lastScrollTop = curScrollTop;

    allDividers.forEach((divider, index) => {
      if (!isDividerVisible(divider)) return;

      scrollPositions[index] = Math.max(-80, Math.min(80, scrollPositions[index] + speed));
      
      const pos = index % 2 === 0 ? scrollPositions[index] : -scrollPositions[index];
      const skew = (direction === 1) ^ (index % 2 === 0) ? -10 : 10;
      const scale = scaleRange * (Math.sin(pos) + 1) / 2 + (1 - scaleRange);

      divider.style.transform = `scale(${scale}) translateX(${pos}em) skewX(${skew}deg)`;
    });

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(animateDividers);
      ticking = true;
    }
  }, { passive: true });
};

// Work Experience Drop Down List
const initializeDropDownList = () => {
  const options = document.querySelectorAll('.drop-down-item');
  let activeOption = null;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const toggleOption = (option) => {
    if (activeOption && activeOption !== option) {
      activeOption.classList.remove('active');
    }
    option.classList.toggle('active');
    activeOption = option.classList.contains('active') ? option : null;
  };

  options.forEach(option => {
    const icon = option.querySelector('.drop-down-icon');
    const companyLink = option.querySelector('.drop-down-sub a');

    if (!isTouchDevice) {
      option.addEventListener('mouseenter', () => {
        option.classList.add('hover');
      });

      option.addEventListener('mouseleave', () => {
        option.classList.remove('hover');
      });
    }

    option.addEventListener('click', (e) => {
      // Check if the click is on the company link
      if (companyLink && companyLink.contains(e.target)) {
        // Allow the default link behavior
        return;
      }

      e.preventDefault();
      if (option !== activeOption || e.target.closest('.drop-down-icon')) {
        toggleOption(option);
      }
    });

    if (companyLink) {
      companyLink.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click from bubbling up to the option
      });
    }

    if (isTouchDevice) {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleOption(option);
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (activeOption && !activeOption.contains(e.target)) {
      activeOption.classList.remove('active');
      activeOption = null;
    }
  });
};

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  initializeTheme();
  initializeDividerAnimation();
  initializeDropDownList();
});
