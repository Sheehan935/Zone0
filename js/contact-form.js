// js/contact-form.js
// Handles the Contact form: client-side validation, submit to the
// zone0-photo-check Worker's /contact route, success/error UI.
// Mirrors the structure of js/photo-check-form.js.

(function () {
  const WORKER_ENDPOINT = "https://zone0-photo-check.zone0landscaping.workers.dev/contact";
  const MESSAGE_MAX = 500;

  const form = document.getElementById("contact-form");
  if (!form) return; // form isn't on this page

  const fields = {
    fullName: document.getElementById("cf-name"),
    email: document.getElementById("cf-email"),
    phone: document.getElementById("cf-phone"),
    subject: document.getElementById("cf-subject"),
    message: document.getElementById("cf-message"),
    companyWebsite: document.getElementById("cf-website"),
  };

  const messageCount = document.getElementById("cf-message-count");
  const banner = document.getElementById("contact-form-banner");
  const submitBtn = document.getElementById("contact-submit");
  const btnLabel = submitBtn.querySelector(".btn-label");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");

  function validateField(name, value) {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Enter your full name.";
        return "";
      case "email": {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Enter your email address.";
        if (!pattern.test(value)) return "Enter a valid email address.";
        return "";
      }
      case "phone": {
        if (!value.trim()) return ""; // optional
        const pattern = /^[\d\s()+\-.]{7,20}$/;
        if (!pattern.test(value)) return "Enter a valid phone number.";
        return "";
      }
      case "subject":
        if (!value) return "Choose a topic.";
        return "";
      case "message":
        if (!value.trim()) return "Enter a message.";
        if (value.trim().length < 10) return "Message must be at least 10 characters.";
        if (value.length > MESSAGE_MAX) return `Message must be ${MESSAGE_MAX} characters or fewer.`;
        return "";
      default:
        return "";
    }
  }

  function showFieldError(name, message) {
    const input = fields[name];
    const errorEl = document.getElementById(`cf-${cssId(name)}-error`);
    if (!errorEl) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      input.setAttribute("aria-invalid", "false");
      errorEl.textContent = "";
    }
  }

  // maps fullName -> name, companyWebsite -> (n/a) for id lookups above
  function cssId(name) {
    if (name === "fullName") return "name";
    return name;
  }

  ["fullName", "email", "phone", "subject", "message"].forEach((name) => {
    const el = fields[name];
    el.addEventListener("blur", () => {
      showFieldError(name, validateField(name, el.value));
    });
  });

  fields.message.addEventListener("input", () => {
    messageCount.textContent = fields.message.value.length;
  });

  function showBanner(kind, text) {
    banner.hidden = false;
    banner.className = `form-banner ${kind}`;
    banner.textContent = text;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnSpinner.hidden = !isLoading;
    btnLabel.textContent = isLoading ? "Sending..." : "Send message";
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Honeypot: bots that fill every field trip this; humans never see it.
    if (fields.companyWebsite.value) {
      showBanner("success", "Thanks — we'll be in touch soon.");
      form.reset();
      return;
    }

    const values = {
      fullName: fields.fullName.value,
      email: fields.email.value,
      phone: fields.phone.value,
      subject: fields.subject.value,
      message: fields.message.value,
    };

    let hasError = false;
    Object.keys(values).forEach((name) => {
      const err = validateField(name, values[name]);
      showFieldError(name, err);
      if (err) hasError = true;
    });

    if (hasError) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    banner.hidden = true;
    setLoading(true);

    try {
      const res = await fetch(WORKER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Request failed");

      showBanner("success", "Message sent — we'll reply within one business day.");
      form.reset();
      messageCount.textContent = "0";
    } catch (err) {
      showBanner("error", "Something went wrong sending your message. Try again, or email hello@zone0landscaping.com directly.");
    } finally {
      setLoading(false);
    }
  });
})();
