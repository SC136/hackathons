const members = {
  sc: { name: "Me", url: "https://swarchuri.me" },
  sherv: { name: "Sherwin", url: "https://github.com/SHERV22" },
  sai: { name: "Sai", url: "https://github.com/WillyEverGreen" },
  tanc: { name: "Tanush", url: "https://example.com" },
  nandan: { name: "Nandan", url: "https://example.com" },
  aryan: { name: "Aryan", url: "https://example.com" },
  norvin: { name: "Norvin", url: "https://example.com" },
  maithil: { name: "Maithil", url: "https://example.com" },
  karpe: { name: "Sahil", url: "https://example.com" },
  urine: { name: "Ulric", url: "https://example.com" },
  chetan: { name: "Chetan", url: "https://example.com" },
  arpit: { name: "Arpit", url: "https://example.com" },
  david: { name: "David", url: "https://example.com" },
  aman: { name: "Aman", url: "https://example.com" },
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
    name: "SPIT FrontEnd Odyssey",
    result: "loss",
    description: "UI was clean, but feature depth was light.",
    location: "Mumbai - Andheri",
    duration: "6 hours",
    team: ["sc", "aryan"],
  },
  {
    year: 2025,
    name: "Xavier's Technova",
    result: "loss",
    description: "Good idea, execution gaps.",
    location: "Mumbai - Mahim",
    duration: "24 hours",
    projectUrl: "https://github.com/SC136/TimeShift",
    demoImage: "https://swarchuri.me/assets/2.jpg",
    team: ["sc", "sherv", "norvin", "nandan"],
  },
  {
    year: 2025,
    name: "SIES Enigma 3.0",
    result: "3rd Runner Up",
    description: "Strong demo and crisp story.",
    location: "Navi Mumbai - Nerul",
    duration: "6 hours",
    team: ["sc", "aryan", "chetan", "arpit"],
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
    name: "TSEC Tech-A-Thon",
    result: "Finalists",
    description: "Great teamwork, average problem fit.",
    location: "Mumbai - Bandra",
    duration: "48 hours",
    team: ["sc", "sherv", "maithil", "karpe"],
  },
  {
    year: 2025,
    name: "TSEC FrontEnd hackathon",
    result: "loss",
    description: "UI looked sharp, backend was thin.",
    location: "Mumbai - Bandra",
    duration: "5 hours",
    team: ["sc", "sherv", "urine"],
  },
  {
    year: 2025,
    name: "Google GenAI Exchange",
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
    name: "NMIMS",
    result: "2nd Runner Up",
    description: "Clear problem, clean execution, strong pitch.",
    location: "Navi Mumbai - Kharghar",
    duration: "24 hours",
    team: ["sc", "sherv", "sai", "david"],
  },
  {
    year: 2026,
    name: "Atharva HackDeck 2.0",
    result: "Top 5 Finalist",
    description: "Went bold, hit constraints late.",
    location: "Mumbai - Malad",
    duration: "6 hours",
    team: ["sc", "sherv", "sai", "slora"],
  },
  {
    year: 2026,
    name: "DMCE Code-a-Thon",
    result: "Top 8 Finalist",
    description: "Good UI, but lacked depth in features.",
    location: "Airoli - Navi Mumbai",
    duration: "8 hours",
    team: ["sc", "sai", "slora", "larisa"],
  },
];

const timeline = document.getElementById("timeline");
const filterYear = document.getElementById("filter-year");
const filterResult = document.getElementById("filter-result");
const filterLocation = document.getElementById("filter-location");
const filterReset = document.getElementById("filter-reset");
const hoverPreview = createHoverPreview();

setupFilters(entries);
renderTimeline(entries);
initHoverPreview();

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

      grouped[year].forEach((entry) => {
        const div = document.createElement("div");
        const status = resultStatus(entry.result);
        const demoAttr = entry.demoImage
          ? ` data-demo="${safeUrl(entry.demoImage)}"`
          : "";
        div.className = `entry ${status}`;
        div.innerHTML = `
        <div class="dot"></div>
        <div class="card"${demoAttr}>
          <div class="name">${entry.name}</div>
          <div class="meta result">${entry.result}</div>
          <div class="meta">${entry.description || ""}</div>
          ${projectLine(entry)}
          <div class="meta">${detailLine(entry.location, entry.duration, entry.team)}</div>
        </div>
      `;
        section.appendChild(div);
      });

      timeline.appendChild(section);
    });
}

function detailLine(location, duration, team) {
  const parts = [];
  if (location) parts.push(`Location: ${location}`);
  if (duration) parts.push(`Duration: ${duration}`);
  if (team && team.length) parts.push(`Team: ${teamLinks(team)}`);
  return parts.join(" | ");
}

function projectLine(entry) {
  const links = [];
  if (entry.projectUrl) {
    const safeProject = safeUrl(entry.projectUrl);
    links.push(`<a href="${safeProject}" target="_blank" rel="noopener">Project</a>`);
  }
  if (entry.demoImage) {
    const safeDemo = safeUrl(entry.demoImage);
    links.push(
      `<span class="preview">Demo<span class="preview-image"><img src="${safeDemo}" alt="${entry.name} demo preview"></span></span>`
    );
  }
  if (!links.length) return "";
  return `<div class="meta link-row">${links.join(" ")}</div>`;
}

function safeUrl(url) {
  return String(url).replace(/"/g, "&quot;");
}

function createHoverPreview() {
  const preview = document.createElement("div");
  preview.className = "hover-preview";
  preview.innerHTML = "<img alt=\"Demo preview\">";
  document.body.appendChild(preview);
  return preview;
}

function initHoverPreview() {
  const image = hoverPreview.querySelector("img");

  timeline.addEventListener("mousemove", (event) => {
    const card = event.target.closest(".card");
    if (!card || !timeline.contains(card)) {
      hideHoverPreview();
      return;
    }

    const demo = card.dataset.demo;
    if (!demo) {
      hideHoverPreview();
      return;
    }

    if (image.getAttribute("src") !== demo) {
      image.setAttribute("src", demo);
    }

    showHoverPreview();
    positionHoverPreview(event);
  });

  timeline.addEventListener("mouseleave", hideHoverPreview);
}

function showHoverPreview() {
  hoverPreview.classList.add("is-visible");
}

function hideHoverPreview() {
  hoverPreview.classList.remove("is-visible");
}

function positionHoverPreview(event) {
  const offset = 18;
  const rect = hoverPreview.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - 12;
  const maxY = window.innerHeight - rect.height - 12;
  const nextX = Math.min(event.clientX + offset, Math.max(12, maxX));
  const nextY = Math.min(event.clientY + offset, Math.max(12, maxY));

  hoverPreview.style.left = `${nextX}px`;
  hoverPreview.style.top = `${nextY}px`;
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
