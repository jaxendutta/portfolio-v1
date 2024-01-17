// Clock
setInterval(() => {
  const estTime = new Date().toLocaleString('nl-NL', {timeZone: 'America/Toronto'});
  document.getElementById('est').innerHTML = estTime;
}, 1000);

// Timeline animation and progress
const timelines = document.querySelectorAll(".timeline__right");
const trackers = document.querySelectorAll(".timeline__tracker");

// This is for keeping track of the scroll
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
    // Timeline animation and progress
    timelines.forEach((timeline, i) => {
      // Animate on scroll
      if (trackers[i].offsetTop > 0) {
        timeline
          .querySelector(".timeline__content")
          .classList.add("animate-on-scroll");
      } else {
        timeline
          .querySelector(".timeline__content")
          .classList.remove("animate-on-scroll");
      }
      // Timeline progress
      timeline.style.background = `linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${trackers[i].offsetTop + 5
        }px, var(--color-grey) ${trackers[i].offsetTop + 5
        }px, var(--color-grey) 100%)`;
    });

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
