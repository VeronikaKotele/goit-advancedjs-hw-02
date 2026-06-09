import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const refs = {
  form: document.querySelector("form"),
};

refs.form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const delay = formData.get("delay");
    const state = formData.get("state");
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            } else if (state === "rejected") {
                reject(delay);
            }
        }, delay);
    });

    promise
    .then((delay) => {
        iziToast.success({
            message: `✅ Fulfilled promise in ${delay}ms`,
        });
    })
    .catch((delay) => {
        iziToast.error({
            message: `❌ Rejected promise in ${delay}ms`,
        });
    });
}