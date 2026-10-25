/* Lunar Medical — site behavior */

// Where general inquiries are delivered. To send submissions to a form
// service instead of the visitor's email app, set FORM_ENDPOINT to its URL
// (for example a Formspree endpoint: https://formspree.io/f/xxxxxxx).
const FORM_ENDPOINT = "";
const INQUIRY_EMAIL = "admin@lunar-med.com";

document.documentElement.classList.add("js");

// Mobile navigation
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
if (header && toggle) {
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  header.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

// Reveal sections as they scroll into view
const revealables = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add("is-visible"));
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Preselect the inquiry topic from a link like contact.html?topic=partnership
const form = document.getElementById("inquiry-form");
if (form) {
  const topic = new URLSearchParams(location.search).get("topic");
  const select = form.querySelector("#topic");
  if (topic && select && select.querySelector(`option[value="${CSS.escape(topic)}"]`)) {
    select.value = topic;
  }

  const status = form.querySelector(".form-status");
  const setStatus = (msg, kind) => {
    status.textContent = msg;
    status.className = "form-status " + (kind || "");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    if (data.get("company_website")) return; // honeypot filled in: likely a bot

    const button = form.querySelector('button[type="submit"]');
    const topicLabel = select.options[select.selectedIndex].text;

    if (FORM_ENDPOINT) {
      button.disabled = true;
      setStatus("Sending…");
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        setStatus("Thank you. Your message has been received and our team will reply within two business days.", "ok");
      } catch (err) {
        setStatus(`We couldn't send your message. Please email us at ${INQUIRY_EMAIL}.`, "err");
      } finally {
        button.disabled = false;
      }
      return;
    }

    // No form service configured: hand the message to the visitor's email app.
    const lines = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      data.get("organization") ? `Organization: ${data.get("organization")}` : "",
      data.get("phone") ? `Phone: ${data.get("phone")}` : "",
      `Topic: ${topicLabel}`,
      "",
      data.get("message"),
    ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "");
    const subject = `Website inquiry: ${topicLabel}`;
    window.location.href =
      `mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setStatus(`Your email app should open with your message ready to send. If it doesn't, write to us at ${INQUIRY_EMAIL}.`, "ok");
  });
}
