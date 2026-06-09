import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
  input: document.querySelector("#datetime-picker"),
  startBtn: document.querySelector("[data-start]"),
  timer: document.querySelector(".timer"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
  allowReselect: document.querySelector("#allow-reselect"),
};
let selectedDate = null;
let timerId = null;

/* ------- Date-time selector ------- */

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const firstDate = selectedDates[0];
    console.log(firstDate);
    if (firstDate <= new Date()) {
      refs.startBtn.disabled = true;
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
      });
    } else {
      refs.startBtn.disabled = false;
      selectedDate = firstDate;
    }
  },
};
flatpickr(refs.input, options);

/* ------- Start button ------- */

refs.startBtn.addEventListener("click", onStartBtnClick);

function onStartBtnClick() {
  // reset
  const date = selectedDate;
  selectedDate = null;
  refs.startBtn.disabled = true;
  if (!refs.allowReselect.checked) {
    refs.input.disabled = true;
  }
  if (timerId) {
    clearInterval(timerId);
  }

  timerId = setInterval(() => {
    const currentTime = new Date();
    const timeDifferenceMs = date - currentTime;
    if (timeDifferenceMs <= 0) {
      // stop timer
      clearInterval(timerId);
      timerId = null;
      refs.input.disabled = false;
    }
    updateTimer(timeDifferenceMs);
  }, 1000);

}

/* ------- Timer ------- */

function updateTimer(timeDifferenceMs) {
  const components = convertMs(timeDifferenceMs);

  // add Leading Zero
  for (const key in components) {
    let value = components[key];
    if (value < 0) value = 0;
    components[key] = String(value).padStart(2, "0");
  }

  const { days, hours, minutes, seconds } = components;

  refs.days.textContent = days;
  refs.hours.textContent = hours;
  refs.minutes.textContent = minutes;
  refs.seconds.textContent = seconds;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}