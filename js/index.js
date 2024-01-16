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
    const speed = 0.015 * (lastScrollTop - curScrollTop);
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

      // Set the transform property
      divider.style.transform = `translateX(${pos}em) skewX(${skew}deg)`;
    })
  },
  { passive: true }
);
