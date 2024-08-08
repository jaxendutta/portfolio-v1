/********************
  Clock and Timezone
 ********************/
setInterval(() => {
  const estTime = new Date().toLocaleString('nl-NL', {timeZone: 'America/Toronto'});
  document.getElementById('est').innerHTML = estTime;
}, 1000);

/****************
  Theme Switcher
 ****************/
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }
  return (systemSettingDark.matches) ? "dark" : "light";
}

// Utility function to update the button text and aria-label
function updateButton({ button, isDark }) {
  button.setAttribute(
    "aria-label", 
    isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
  );
  document.getElementById("light-icon").style.display = isDark ? "block" : "none";
  document.getElementById("dark-icon").style.display = isDark ? "none" : "block";
}

// Utility function to update the theme setting on the html tag
function updateThemeOnHtml({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
  document.getElementsByClassName("menu-container")[0].setAttribute("mix-blend-mode", "normal");
}

//On page load:
// 1. Grab what we need from the DOM and system settings on page load
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

// 2. Work out the current site settings
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

// 3. Update the theme setting and button text according to current settings
updateButton({ button: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtml({ theme: currentThemeSetting });

// 4. Add an event listener to toggle the theme
button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  updateButton({ button: button, isDark: newTheme === "dark" });
  updateThemeOnHtml({ theme: newTheme });
  currentThemeSetting = newTheme;
});

/*******************
  Divider Animation
 *******************/

// Scroll tracking variables
let scrollPosition = [];
let lastScrollTop = 0;

// For each divider, add a position to the scrollPosition
// NOTE: Assume querySelectorAll is in document order!
const allDividers = document.querySelectorAll(".divider");
allDividers.forEach(() => scrollPosition.push(0));

// Check if divider element is visible by comparing client rect with screen height
function is_divider_visible(elem) {
  const rect = elem.getBoundingClientRect()
  if(!rect) return false;
  return !((rect.y > window.outerHeight + 200) && (rect.y < -200));
}

window.addEventListener(
  "scroll",
  (e) => {
    // Detect scroll direction here
    const curScrollTop = window.scrollY || document.documentElement.scrollTop;
    const direction = curScrollTop < lastScrollTop ? 1 : -1;

    // Divider animation parameters here
    const speed = 0.015 * (lastScrollTop - curScrollTop);
    const scaleRange = 0.2;

    // !! important, set this after speed and scaleRange !!
    lastScrollTop = curScrollTop;

    // Divider animation
    allDividers.forEach(function(divider, index) {
      // If this divider is not visible, just bail out.
      if(!is_divider_visible(divider))
        return;

      // Update the position for that divider and clamp to [-10, 10]
      scrollPosition[index] = Math.max(-80, Math.min(80, scrollPosition[index] + speed));
      
      // Compute the transform now
      const pos = index % 2 === 0 ? scrollPosition[index] : -scrollPosition[index];
      const skew = (direction === 1) ^ (index % 2 === 0) ? -10 : 10;
      // Explanation of scale: sin(pos) ∈ [-1, 1], so we re-scale it to [0, 1]
      // and then multiply by scaleRange and offset so the final scale <= 1 always.
      const scale = scaleRange*(Math.sin(pos)+1)/2 + (1-scaleRange);

      // Set the transform property
      divider.style.transform = `scale(${scale}) translateX(${pos}em) skewX(${skew}deg)`;
    })
  },
  { passive: true }
);

/********************************
  Work Experience Drop Down List
 ********************************/
document.addEventListener('DOMContentLoaded', () => {
  const options = document.querySelectorAll('.drop-down-item');
  let activeOption = null;
  let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  options.forEach(option => {
    const icon = option.querySelector('.drop-down-icon');

    option.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (activeOption && activeOption !== option) {
        activeOption.classList.remove('active');
      }

      if (option !== activeOption || e.target.closest('.drop-down-icon')) {
        option.classList.toggle('active');
        activeOption = option.classList.contains('active') ? option : null;
      }
    });

    if (isTouchDevice) {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        if (option.classList.contains('active')) {
          option.classList.remove('active');
          activeOption = null;
        } else {
          if (activeOption) {
            activeOption.classList.remove('active');
          }
          option.classList.add('active');
          activeOption = option;
        }
      });
    }
  });

  // Close expanded tile when clicking outside
  document.addEventListener('click', (e) => {
    if (activeOption && !activeOption.contains(e.target)) {
      activeOption.classList.remove('active');
      activeOption = null;
    }
  });
});
