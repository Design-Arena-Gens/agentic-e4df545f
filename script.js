const canvas = document.getElementById("grid-canvas");
const ctx = canvas.getContext("2d");
let width = window.innerWidth;
let height = window.innerHeight;
let animationId;

const config = {
  spacing: 120,
  speed: 0.015,
  offset: 0,
  amplitude: 16,
  color: "rgba(93, 139, 255, 0.28)",
  secondary: "rgba(70, 255, 198, 0.16)",
};

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function drawGrid() {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  for (let x = -config.spacing; x < width + config.spacing; x += config.spacing) {
    const offset = Math.sin((x + config.offset) * 0.008) * config.amplitude;
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, config.color);
    gradient.addColorStop(1, "rgba(9, 12, 18, 0)");
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + offset, height);
    ctx.stroke();
  }

  for (let y = -config.spacing; y < height + config.spacing; y += config.spacing) {
    const offset = Math.cos((y + config.offset) * 0.008) * config.amplitude;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, config.secondary);
    gradient.addColorStop(1, "rgba(9, 12, 18, 0)");
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + offset);
    ctx.stroke();
  }

  config.offset += config.speed * 120;
  animationId = requestAnimationFrame(drawGrid);
}

resizeCanvas();
animationId = requestAnimationFrame(drawGrid);
window.addEventListener("resize", () => {
  cancelAnimationFrame(animationId);
  resizeCanvas();
  animationId = requestAnimationFrame(drawGrid);
});

// Metrics counter animation
const metrics = document.querySelectorAll("[data-count]");
const metricDur = 1200;

metrics.forEach((metric) => {
  const target = metric.dataset.count;
  const suffix = metric.dataset.suffix ?? "";
  const decimals = target.includes(".");
  const endValue = parseFloat(target);
  const startValue = 0;
  let start;

  function animateMetric(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / metricDur, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startValue + (endValue - startValue) * eased;
    metric.textContent = decimals ? `${current.toFixed(1)}${suffix}` : `${Math.round(current)}${suffix}`;
    if (progress < 1) requestAnimationFrame(animateMetric);
  }

  requestAnimationFrame(animateMetric);
});

// Activity log
const log = document.getElementById("activity-log");
const refreshBtn = document.getElementById("log-refresh");

const events = [
  { status: "shipped", message: "AI-assisted feature flags rolled out to 28 markets", time: "2h ago" },
  { status: "synced", message: "Prompt tuning cycle trimmed response latency by 34%", time: "5h ago" },
  { status: "deployed", message: "Realtime inference edge worker replicated globally", time: "1d ago" },
  { status: "trained", message: "Domain-specific copilots augmented with fresh datasets", time: "2d ago" },
  { status: "automated", message: "Regression suite orchestrated via autonomous agent", time: "2d ago" },
];

function renderLog(items) {
  log.innerHTML = "";
  items.slice(0, 4).forEach((event) => {
    const li = document.createElement("li");
    li.className = "log__item";
    li.innerHTML = `
      <span class="log__message">${event.message}</span>
      <span class="log__status">${event.status} · ${event.time}</span>
    `;
    log.appendChild(li);
  });
}

function shuffleEvents() {
  const shuffled = [...events].sort(() => Math.random() - 0.5);
  renderLog(shuffled);
}

renderLog(events);
refreshBtn.addEventListener("click", () => {
  refreshBtn.classList.add("spin");
  shuffleEvents();
  setTimeout(() => refreshBtn.classList.remove("spin"), 400);
});

// Tilt effect
const tiltElements = document.querySelectorAll("[data-tilt]");
tiltElements.forEach((el) => {
  const maxRotation = 6;
  function handleMove(event) {
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * maxRotation * 2;
    const rotateX = (0.5 - y) * maxRotation * 2;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
  }
  function reset() {
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }
  el.addEventListener("pointermove", handleMove);
  el.addEventListener("pointerleave", reset);
});

// Command palette
const commandDialog = document.getElementById("command-dialog");
const commandTrigger = document.getElementById("command-trigger");
const commandInput = document.getElementById("command-input");
const commandResults = document.getElementById("command-results");

const actions = [
  {
    title: "Request a Build Sprint",
    description: "Kickstart a 5-day AI-accelerated delivery cycle",
    href: "#contact",
  },
  {
    title: "Explore Selected Work",
    description: "Dive into shipped projects and product demos",
    href: "#projects",
  },
  {
    title: "View Tooling Stack",
    description: "See how AI copilots and automation integrate into delivery",
    href: "#stack",
  },
  {
    title: "Open GitHub",
    description: "Browse open-source experiments and prototypes",
    href: "https://github.com",
    external: true,
  },
];

let activeIndex = 0;
let filteredActions = [...actions];

function renderActions(filter = "") {
  commandResults.innerHTML = "";
  filteredActions = actions.filter(
    (action) =>
      action.title.toLowerCase().includes(filter.toLowerCase()) ||
      action.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (!filteredActions.length) {
    const li = document.createElement("li");
    li.className = "command__item";
    li.textContent = "No matches found.";
    commandResults.appendChild(li);
    return;
  }

  filteredActions.forEach((action, index) => {
    const li = document.createElement("li");
    li.className = "command__item";
    li.setAttribute("role", "option");
    li.dataset.index = index;
    if (index === activeIndex) {
      li.setAttribute("aria-selected", "true");
    }
    li.innerHTML = `
      <span class="command__item-title">${action.title}</span>
      <span class="command__item-desc">${action.description}</span>
    `;
    li.addEventListener("click", () => executeAction(action));
    li.addEventListener("mouseenter", () => setActiveIndex(index));
    commandResults.appendChild(li);
  });
}

function setActiveIndex(index) {
  activeIndex = index;
  [...commandResults.children].forEach((child, idx) => {
    if (idx === activeIndex) {
      child.setAttribute("aria-selected", "true");
    } else {
      child.removeAttribute("aria-selected");
    }
  });
}

function executeAction(action) {
  commandDialog.close();
  if (action.external) {
    window.open(action.href, "_blank", "noopener");
  } else {
    window.location.hash = action.href;
  }
}

commandTrigger.addEventListener("click", () => {
  commandDialog.showModal();
  renderActions();
  requestAnimationFrame(() => {
    commandInput.value = "";
    commandInput.focus();
  });
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandDialog.open ? commandDialog.close() : commandTrigger.click();
  }

  if (commandDialog.open) {
    if (event.key === "ArrowDown" && filteredActions.length) {
      event.preventDefault();
      setActiveIndex(Math.min(activeIndex + 1, commandResults.children.length - 1));
    }
    if (event.key === "ArrowUp" && filteredActions.length) {
      event.preventDefault();
      setActiveIndex(Math.max(activeIndex - 1, 0));
    }
    if (event.key === "Enter" && filteredActions.length) {
      event.preventDefault();
      const action = filteredActions[activeIndex];
      if (action) executeAction(action);
    }
  }
});

commandInput.addEventListener("input", (event) => {
  activeIndex = 0;
  renderActions(event.currentTarget.value);
});

commandDialog.addEventListener("close", () => {
  commandTrigger.focus();
});

// CTA form handling
const form = document.querySelector(".cta__form");
const emailInput = document.getElementById("email");
const availability = document.querySelector("[data-toggle='availability']");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email) return;

  form.classList.add("submitted");
  availability.innerHTML = `System Status: <strong>Engaged</strong>`;
  setTimeout(() => {
    availability.innerHTML = `System Status: <strong>Online</strong>`;
    form.classList.remove("submitted");
  }, 3200);

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <strong>Request received</strong>
    <span>I'll reply to ${email} within 6 hours.</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 400);
  }, 4200);

  form.reset();
});

// Availability toggle on hover
availability.addEventListener("mouseenter", () => {
  availability.innerHTML = `System Status: <strong>Latency &lt; 6h</strong>`;
});
availability.addEventListener("mouseleave", () => {
  availability.innerHTML = `System Status: <strong>Online</strong>`;
});

// Accessibility enhancement: close command palette with Escape
commandDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  commandDialog.close();
});
