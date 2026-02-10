const members = {
  sc: { name: "Me", url: "https://swarchuri.me" },
  sherv: { name: "Sherwin", url: "https://sherv22.github.io/Portfolio/" },
  sai: { name: "Sai", url: "https://github.com/WillyEverGreen" },
  tanc: { name: "Tanush", url: "https://github.com/TanushCode" },
  nandan: { name: "Nandan", url: "https://example.com" },
  aryan: { name: "Aryan", url: "https://github.com/bhagattt" },
  norvin: { name: "Norvin", url: "https://example.com" },
  maithil: { name: "Maithil", url: "https://portfolio-mu-nine-5cnvai28mj.vercel.app/" },
  karpe: { name: "Sahil", url: "https://dev-e-portfolio.vercel.app/" },
  urine: { name: "Ulric", url: "https://ulriccollaco.me/" },
  chetan: { name: "Chetan", url: "https://chetanborkar.me/" },
  arpit: { name: "Arpit", url: "https://github.com/ar-p-it" },
  david: { name: "David", url: "https://davidporathur.vercel.app/" },
  aman: { name: "Aman", url: "https://helloitsaman.github.io/" },
  slora: { name: "Slora", url: "https://github.com/Slora123" },
};

const entries = [
  {
    year: 2024,
    name: "GDSC Ui/Ux",
    result: "loss",
    description: "first time made a full ui in figma",
    location: "Online",
    duration: "Varied",
    team: ["sc"],
    images: ["assets/coffee_shop_ui.png"],
  },
  {
    year: 2024,
    name: "GDSC Bit N Build",
    result: "loss",
    description:
      "build a working prototype alone for the whole night, still lost to a wix site",
    location: "Online",
    duration: "12 hours",
    team: ["sc", "tanc", "nandan"],
  },
  {
    year: 2025,
    date: "15-2-2025",
    name: "SPIT FrontEnd Odyssey",
    result: "loss",
    description: "UI was clean, but feature depth was light.",
    location: "Mumbai - Andheri",
    duration: "6 hours",
    team: ["sc", "aryan", "chetan"],
    image: "assets/odyssey.png",
  },
  {
    year: 2025,
    date: "22-2-2025",
    name: "Xavier's Technova",
    result: "loss",
    description: "Good idea, execution gaps.",
    location: "Mumbai - Mahim",
    duration: "24 hours",
    projectUrl: "https://github.com/SC136/TimeShift",
    images: ["assets/technova.jpg"],
    team: ["sc", "sherv", "norvin", "nandan"],
  },
  {
    year: 2025,
    date: "10-1-2025",
    name: "SIES Enigma 3.0",
    result: "3rd Runner Up",
    description: "Strong demo and crisp story.",
    location: "Navi Mumbai - Nerul",
    duration: "6 hours",
    team: ["sc", "aryan", "chetan", "arpit"],
    images: ["assets/enigma.jpg", "assets/enigma1.jpg"],
  },
  {
    year: 2025,
    name: "Atharva Ui/Ux",
    result: "loss",
    description: "Learned faster iteration with feedback loops.",
    location: "Mumbai - Malad",
    duration: "3 hours",
    team: ["sc", "sai"],
  },
  {
    year: 2025,
    name: "Atharva DSA",
    result: "33rd Rank",
    description: "Solid performance but missed the top tier.",
    location: "Mumbai - Malad",
    duration: "3 hours",
    team: ["sc"],
  },
  {
    year: 2025,
    date: "28-3-2025",
    name: "TSEC Tech-A-Thon",
    result: "Finalists",
    description: "Great teamwork, average problem fit.",
    location: "Mumbai - Bandra",
    duration: "48 hours",
    team: ["sc", "sherv", "maithil", "karpe"],
    images: ["assets/tech_a_thon.jpg", "assets/tech_a_thon2.jpg", "assets/tech_a_thon3.jpg", "assets/tech_a_thon4.jpg"],
  },
  {
    year: 2025,
    date: "28-3-2025",
    name: "TSEC FrontEnd hackathon",
    result: "loss",
    description: "UI looked sharp, backend was thin.",
    location: "Mumbai - Bandra",
    duration: "5 hours",
    team: ["sc", "sherv", "urine", "maithil"],
  },
  {
    year: 2025,
    name: "Google GenAI",
    result: "Qualified till Stage 2",
    description: "Solid idea, needed tighter evaluation.",
    location: "Online",
    duration: "Varied",
    team: ["sc", "aman"],
  },
  {
    year: 2025,
    name: "GDSC Bit N Build",
    result: "loss",
    description: "Better scope, still missed the mark.",
    location: "Online",
    duration: "12 hours",
    team: ["sc", "sherv", "urine", "tanc"],
  },
  {
    year: 2026,
    date: "24-1-2026",
    name: "NMIMS Echelon",
    result: "2nd Runner Up",
    description: "Clear problem, clean execution, strong pitch.",
    location: "Navi Mumbai - Kharghar",
    duration: "24 hours",
    team: ["sc", "sherv", "sai", "david"],
    image: "assets/echelon.jpg",
  },
  {
    year: 2026,
    date: "28-1-2026",
    name: "Atharva HackDeck 2.0",
    result: "Top 5 Finalist",
    description: "Went bold, hit constraints late.",
    location: "Mumbai - Malad",
    duration: "6 hours",
    image: "assets/hack_deck.jpeg",
    team: ["sc", "sherv", "sai", "slora"],
  },
  {
    year: 2026,
    date: "6-2-2026",
    name: "DMCE Code-a-Thon",
    result: "Top 8 Finalist",
    description: "Good UI, but lacked depth in features.",
    location: "Airoli - Navi Mumbai",
    duration: "8 hours",
    images: ["assets/codeathon.jpeg", "assets/code_a_thon_2.jpg"],
    team: ["sc", "sai", "slora", "Larisa"],
  },
];

const timeline = document.getElementById("timeline");
const filterYear = document.getElementById("filter-year");
const filterResult = document.getElementById("filter-result");
const filterLocation = document.getElementById("filter-location");
const filterReset = document.getElementById("filter-reset");

setupFilters(entries);
renderTimeline(entries);

filterYear.addEventListener("change", applyFilters);
filterResult.addEventListener("change", applyFilters);
filterLocation.addEventListener("change", applyFilters);
filterReset.addEventListener("click", () => {
  filterYear.value = "all";
  filterResult.value = "all";
  filterLocation.value = "all";
  applyFilters();
});

function setupFilters(list) {
  const years = Array.from(new Set(list.map((entry) => entry.year)))
    .sort((a, b) => Number(b) - Number(a))
    .map(String);
  const locations = Array.from(
    new Set(list.map((entry) => entry.location).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  setOptions(filterYear, years, "All years");
  setOptions(filterLocation, locations, "All locations");

  const resultOptions = [
    { value: "all", label: "All results" },
    { value: "win", label: "Wins" },
    { value: "ok", label: "Finalist or qualified" },
    { value: "loss", label: "Losses" },
  ];
  filterResult.innerHTML = resultOptions
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");
}

function setOptions(select, items, allLabel) {
  select.innerHTML = [`<option value="all">${allLabel}</option>`]
    .concat(items.map((item) => `<option value="${item}">${item}</option>`))
    .join("");
}

function applyFilters() {
  const yearValue = filterYear.value;
  const resultValue = filterResult.value;
  const locationValue = filterLocation.value;

  const filtered = entries.filter((entry) => {
    const matchesYear = yearValue === "all" || String(entry.year) === yearValue;
    const matchesResult =
      resultValue === "all" || resultStatus(entry.result) === resultValue;
    const matchesLocation =
      locationValue === "all" || entry.location === locationValue;
    return matchesYear && matchesResult && matchesLocation;
  });

  renderTimeline(filtered);
}

const cardTimers = new WeakMap();
const cardFadeTimers = new WeakMap();

function renderTimeline(list) {
  timeline.innerHTML = "";
  const grouped = list.reduce((acc, entry) => {
    acc[entry.year] = acc[entry.year] || [];
    acc[entry.year].push(entry);
    return acc;
  }, {});

  Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((year) => {
      const section = document.createElement("div");
      section.className = "year";
      section.innerHTML = `<h2>${year}</h2>`;

      const sortedEntries = grouped[year]
        .slice()
        .sort((a, b) => compareEntryDates(a, b) || a.name.localeCompare(b.name));

      sortedEntries.forEach((entry) => {
        const div = document.createElement("div");
        const status = resultStatus(entry.result);
        div.className = `entry ${status}`;
        div.innerHTML = `
        <div class="dot"></div>
        <div class="card">
          <div class="name">${entry.name}</div>
          <div class="meta result">${entry.result}</div>
          <div class="meta">${entry.description || ""}</div>
          ${revealLine(entry)}
          <div class="meta">${detailLine(entry.location, entry.duration, entry.team)}</div>
        </div>
      `;
        const card = div.querySelector(".card");
        const images = getEntryImages(entry);
        if (images.length) {
          card.classList.add("has-image");
          card.style.setProperty("--card-image", `url('${safeCssUrl(images[0])}')`);
          card.dataset.images = JSON.stringify(images);
        }
        section.appendChild(div);
      });

      timeline.appendChild(section);
    });

  attachImageHover();
}

function detailLine(location, duration, team) {
  const parts = [];
  if (location) parts.push(`Location: ${location}`);
  if (duration) parts.push(`Duration: ${duration}`);
  if (team && team.length) parts.push(`Team: ${teamLinks(team)}`);
  return parts.join(" | ");
}

function revealLine(entry) {
  const parts = [];
  if (entry.date) {
    const label = formatDate(entry.date);
    if (label) parts.push(`<span class="reveal-date">${label}</span>`);
  }
  if (entry.projectUrl) {
    const safeProject = safeUrl(entry.projectUrl);
    parts.push(`<a href="${safeProject}" target="_blank" rel="noopener">Project</a>`);
  }
  if (!parts.length) return "";
  return `<div class="meta reveal">${parts.join(" • ")}</div>`;
}

function compareEntryDates(a, b) {
  const timeA = parseEntryDate(a);
  const timeB = parseEntryDate(b);
  if (timeA === null && timeB === null) return 0;
  if (timeA === null) return 1;
  if (timeB === null) return -1;
  return timeB - timeA;
}

function parseEntryDate(entry) {
  if (!entry.date) return null;
  const time = parseFlexibleDate(entry.date);
  return time === null ? null : time;
}

function formatDate(value) {
  const time = parseFlexibleDate(value);
  if (time === null) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(time));
}

function parseFlexibleDate(value) {
  if (!value) return null;
  const text = String(value).trim();
  const dmyMatch = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const month = Number(dmyMatch[2]);
    const year = Number(dmyMatch[3]);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }
  const time = Date.parse(text);
  return Number.isNaN(time) ? null : time;
}

function safeUrl(url) {
  return String(url).replace(/"/g, "&quot;");
}

function safeCssUrl(url) {
  return String(url).replace(/'/g, "%27").replace(/"/g, "%22");
}

function getEntryImages(entry) {
  if (Array.isArray(entry.images)) return entry.images.filter(Boolean);
  if (Array.isArray(entry.image)) return entry.image.filter(Boolean);
  if (entry.image) return [entry.image];
  if (entry.images) return [entry.images];
  return [];
}

function attachImageHover() {
  timeline.querySelectorAll(".card.has-image").forEach((card) => {
    if (card.dataset.hoverBound) return;
    card.dataset.hoverBound = "true";
    card.addEventListener("mouseenter", () => startImageCycle(card));
    card.addEventListener("mouseleave", () => stopImageCycle(card));
  });
}

function startImageCycle(card) {
  const images = parseImages(card.dataset.images);
  if (images.length <= 1) return;
  stopImageCycle(card);
  let index = 0;
  const timer = window.setInterval(() => {
    index = (index + 1) % images.length;
    transitionCardImage(card, images[index]);
  }, 1400);
  cardTimers.set(card, timer);
}

function stopImageCycle(card) {
  const timer = cardTimers.get(card);
  if (timer) window.clearInterval(timer);
  cardTimers.delete(card);
  clearFadeTimer(card);
  const images = parseImages(card.dataset.images);
  if (images.length) {
    card.style.setProperty("--card-image", `url('${safeCssUrl(images[0])}')`);
    card.style.removeProperty("--card-image-next");
    card.classList.remove("image-fade");
  }
}

function transitionCardImage(card, nextImage) {
  const nextUrl = `url('${safeCssUrl(nextImage)}')`;
  card.style.setProperty("--card-image-next", nextUrl);
  card.classList.add("image-fade");
  clearFadeTimer(card);
  const timer = window.setTimeout(() => {
    card.style.setProperty("--card-image", nextUrl);
    card.style.removeProperty("--card-image-next");
    card.classList.remove("image-fade");
    cardFadeTimers.delete(card);
  }, 260);
  cardFadeTimers.set(card, timer);
}

function clearFadeTimer(card) {
  const timer = cardFadeTimers.get(card);
  if (timer) window.clearTimeout(timer);
  cardFadeTimers.delete(card);
}

function parseImages(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function resultStatus(result) {
  const value = String(result || "").toLowerCase();
  if (value.includes("loss")) return "loss";
  if (
    value.includes("winner") ||
    value.includes("1st") ||
    value.includes("first") ||
    value.includes("runner")
  ) {
    return "win";
  }
  if (
    value.includes("finalist") ||
    value.includes("rank") ||
    value.includes("qualified") ||
    value.includes("stage")
  ) {
    return "ok";
  }
  return "ok";
}

function teamLinks(team) {
  return `<span class="team-links">${team
    .map((key) => {
      const member = members[key];
      if (!member) return String(key);
      if (!member.url) return member.name;
      const safeUrl = String(member.url).replace(/"/g, "&quot;");
      return `<a href="${safeUrl}" target="_blank" rel="noopener">${member.name}</a>`;
    })
    .join(", ")}</span>`;
}

const wins = entries.filter((entry) => resultStatus(entry.result) === "win").length;
const finalists = entries.filter((entry) => /finalist/i.test(entry.result)).length;
const losses = entries.filter((entry) => resultStatus(entry.result) === "loss").length;
const total = entries.length;
const selfKey = "sc";
const buddies = findHackathonBuddies(entries, selfKey, 5);
const buddy = buddies[0] || null;
const commonLocation = mostCommonLocation(entries);
const longestEvent = longestDuration(entries);

document.getElementById("summary").innerHTML = `
  Out of ${total} hackathons: ${wins} wins, ${finalists} finalist finishes, ${losses} losses.
  The rest still mattered — they shaped how I think, build, and iterate.
  <div class="stats">
    <div class="stat">
      <span>Hackathon buddy</span>
      <span class="buddy">
        ${buddyLabel(buddy)}
        ${buddies.length > 1 ? `<span class="buddy-toggle" aria-hidden="true">▾</span>` : ""}
        ${buddies.length > 1 ? `<span class="buddy-list">${buddyList(buddies)}</span>` : ""}
      </span>
    </div>
    <div class="stat">
      <span>Most common location</span>
      <span>${commonLocation ? `${commonLocation.location} (${commonLocation.count})` : "—"}</span>
    </div>
    <div class="stat">
      <span>Longest hackathon</span>
      <span>${longestEvent ? `${longestEvent.duration} • ${longestEvent.name}` : "—"}</span>
    </div>
  </div>
`;

function findHackathonBuddies(list, self, limit) {
  const counts = new Map();
  list.forEach((entry) => {
    if (!entry.team || !entry.team.includes(self)) return;
    entry.team.forEach((key) => {
      if (key === self) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .map(([key, count]) => ({ key, name: memberLabel(key), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function buddyLabel(buddy) {
  if (!buddy) return "No repeats yet";
  const member = members[buddy.key];
  if (member && member.url) {
    const safeUrl = String(member.url).replace(/"/g, "&quot;");
    return `<a href="${safeUrl}" target="_blank" rel="noopener">${member.name}</a> (${buddy.count})`;
  }
  return `${buddy.name} (${buddy.count})`;
}

function buddyList(list) {
  return list
    .map((item, index) => {
      const label = `${index + 1}. ${buddyLabel(item)}`;
      return `<span class="buddy-item">${label}</span>`;
    })
    .join("");
}

function memberLabel(key) {
  return members[key] ? members[key].name : String(key);
}

function mostCommonLocation(list) {
  const counts = new Map();
  list.forEach((entry) => {
    if (!entry.location) return;
    counts.set(entry.location, (counts.get(entry.location) || 0) + 1);
  });
  let best = null;
  counts.forEach((count, location) => {
    if (!best || count > best.count) best = { location, count };
  });
  return best;
}

function longestDuration(list) {
  let best = null;
  list.forEach((entry) => {
    const hours = parseHours(entry.duration);
    if (hours === null) return;
    if (!best || hours > best.hours) {
      best = { name: entry.name, duration: entry.duration, hours };
    }
  });
  return best;
}

function parseHours(duration) {
  if (!duration) return null;
  const match = String(duration).match(/(\d+)\s*hours?/i);
  return match ? Number(match[1]) : null;
}
