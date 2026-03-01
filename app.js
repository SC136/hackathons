let members = {};
let entries = [];

async function init() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    members = data.members || {};
    entries = data.entries || [];
  } catch (err) {
    console.error("Failed to load data.json:", err);
    return;
  }

  const timeline = document.getElementById("timeline");
  const filterYear = document.getElementById("filter-year");
  const filterResult = document.getElementById("filter-result");
  const filterLocation = document.getElementById("filter-location");
  const filterReset = document.getElementById("filter-reset");

  setupFilters(entries, filterYear, filterResult, filterLocation);
  renderTimeline(entries, timeline);

  filterYear.addEventListener("change", () =>
    applyFilters(entries, timeline, filterYear, filterResult, filterLocation)
  );
  filterResult.addEventListener("change", () =>
    applyFilters(entries, timeline, filterYear, filterResult, filterLocation)
  );
  filterLocation.addEventListener("change", () =>
    applyFilters(entries, timeline, filterYear, filterResult, filterLocation)
  );
  filterReset.addEventListener("click", () => {
    filterYear.value = "all";
    filterResult.value = "all";
    filterLocation.value = "all";
    applyFilters(entries, timeline, filterYear, filterResult, filterLocation);
  });

  renderSummary(entries);
}

init();

function setupFilters(list, filterYear, filterResult, filterLocation) {
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

function applyFilters(entries, timeline, filterYear, filterResult, filterLocation) {
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

  renderTimeline(filtered, timeline);
}

const cardTimers = new WeakMap();
const cardFadeTimers = new WeakMap();

function renderTimeline(list, timeline) {
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

  attachImageHover(timeline);
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

function attachImageHover(timeline) {
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
      const safeHref = String(member.url).replace(/"/g, "&quot;");
      return `<a href="${safeHref}" target="_blank" rel="noopener">${member.name}</a>`;
    })
    .join(", ")}</span>`;
}

function renderSummary(entries) {
  const wins = entries.filter((entry) => resultStatus(entry.result) === "win").length;
  const finalists = entries.filter((entry) => /finalist/i.test(entry.result)).length;
  const losses = entries.filter((entry) => resultStatus(entry.result) === "loss").length;
  const total = entries.length;
  const selfKey = "sc";
  const buddies = findHackathonBuddies(entries, selfKey, 5);
  const buddy = buddies[0] || null;
  const locations = mostCommonLocations(entries, 5);
  const commonLocation = locations[0] || null;
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
        <span class="buddy">
          ${locationLabel(commonLocation)}
          ${locations.length > 1 ? `<span class="buddy-toggle" aria-hidden="true">▾</span>` : ""}
          ${locations.length > 1 ? `<span class="buddy-list">${locationList(locations)}</span>` : ""}
        </span>
      </div>
      <div class="stat">
        <span>Longest hackathon</span>
        <span>${longestEvent ? `${longestEvent.duration} • ${longestEvent.name}` : "—"}</span>
      </div>
    </div>
  `;
}

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
    const safeHref = String(member.url).replace(/"/g, "&quot;");
    return `<a href="${safeHref}" target="_blank" rel="noopener">${member.name}</a> (${buddy.count})`;
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

function mostCommonLocations(list, limit) {
  const counts = new Map();
  list.forEach((entry) => {
    if (!entry.location) return;
    counts.set(entry.location, (counts.get(entry.location) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count || a.location.localeCompare(b.location))
    .slice(0, limit);
}

function locationLabel(location) {
  if (!location) return "—";
  return `${location.location} (${location.count})`;
}

function locationList(list) {
  return list
    .map((item, index) => {
      const label = `${index + 1}. ${locationLabel(item)}`;
      return `<span class="buddy-item">${label}</span>`;
    })
    .join("");
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
