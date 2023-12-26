// Clock
function updateClock() {
  const estTime = new Date().toLocaleString('nl-NL', {timeZone: 'America/New_York'});
  document.getElementById('est').innerHTML = estTime;
}

setInterval(updateClock, 1000);

// Timeline animation and progress
const timelines = document.querySelectorAll(".timeline__right");

const trackers = document.querySelectorAll(".timeline__tracker");

window.addEventListener(
  "scroll",
  (e) => {
    timelines.forEach((timeline, i) => {
      //  Animate on scroll
      if (trackers[i].offsetTop > 0) {
        timeline
          .querySelector(".timeline__content")
          .classList.add("animate-on-scroll");
      } else {
        timeline
          .querySelector(".timeline__content")
          .classList.remove("animate-on-scroll");
      }

      //       Timeline progress
      timeline.style.background = `linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) ${trackers[i].offsetTop + 5
        }px, var(--color-grey) ${trackers[i].offsetTop + 5
        }px, var(--color-grey) 100%)`;
    });
  },
  { passive: true }
);

// Contact form
function validateForm() {
  var n = document.getElementById('name').value;
  var e = document.getElementById('email').value;
  var l = document.getElementById('linkedin').value;
  var m = document.getElementById('message').value;
  var onlyLetters = /^[a-zA-Z\s]*$/;
  var onlyEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (n == "" || n == null) {
    document.getElementById('nameLabel').innerHTML = ('Enter your name');
    document.getElementById('name').style.borderColor = "red";
    return false;
  }

  if (!n.match(onlyLetters)) {
    document.getElementById('nameLabel').innerHTML = ('Please enter only letters');
    document.getElementById('name').style.borderColor = "red";
    return false;
  }

  if (e == "" || e == null) {
    document.getElementById('emailLabel').innerHTML = ('Enter your email');
    document.getElementById('email').style.borderColor = "red";
    return false;
  }

  if (!e.match(onlyEmail)) {
    document.getElementById('emailLabel').innerHTML = ('Enter a valid email address');
    document.getElementById('email').style.borderColor = "red";
    return false;
  }

  if (m == "" || m == null) {
    document.getElementById('messageLabel').innerHTML = ('Enter a message');
    document.getElementById('message').style.borderColor = "red";
    return false;
  }

  else {
    return true;
  }
}
