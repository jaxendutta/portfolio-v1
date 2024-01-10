// Clock
function updateClock() {
  const estTime = new Date().toLocaleString('nl-NL', {timeZone: 'America/New_York'});
  document.getElementById('est').innerHTML = estTime;
}

setInterval(updateClock, 1000);

// Timeline animation and progress
const timelines = document.querySelectorAll(".timeline__right");
const trackers = document.querySelectorAll(".timeline__tracker");

// This is for keeping track of the scroll
let scrollPosition = 0;
let lastScrollTop = 0;

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
    lastScrollTop = curScrollTop;

    // Divider animation
    const speed = 0.2;
    scrollPosition += direction * speed;
    const allDividers = document.querySelectorAll(".divider");
    allDividers.forEach(function(divider, index) {
      if (index % 2 === 0) {
        divider.style.transform = `translateX(${scrollPosition}em)`;
      } else {
        divider.style.transform = `translateX(${-scrollPosition}em)`;
      }
    })
  },
  { passive: true }
);
