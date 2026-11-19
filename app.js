let members = {};
let entries = [];
const outcomes = {
  winner: ["Winner", "win", "wins"],
  runner: ["Runner-up", "runner-up finish", "runner-up finishes"],
  finalist: ["Finalist", "finalist finish", "finalist finishes"],
  qualified: ["Qualified", "qualification", "qualifications"],
  ranked: ["Ranked", "ranked finish", "ranked finishes"],
  loss: ["Loss", "loss", "losses"],
  other: ["Other", "other result", "other results"],
};

async function init() {
  const timeline = document.getElementById("timeline");
  // Give the loader one visible pass, even when the data comes from cache.
  const intro = new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 1300)));
  });
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    members = data.members || {};
    entries = data.entries || [];
    await intro;
    window.hideLoader && window.hideLoader();
  } catch (err) {
    console.error("Failed to load data.json:", err);
    timeline.innerHTML = '<p role="alert">The logbook couldn’t load. <a href="">Reload to try again</a>.</p>';
    timeline.setAttribute("aria-busy", "false");
    window.hideLoader && window.hideLoader();
    return;
  }

  const search = document.getElementById("filter-search");
  const status = document.getElementById("filter-status");
  const filterYear = document.getElementById("filter-year");
  const filterResult = document.getElementById("filter-result");
  const filterLocation = document.getElementById("filter-location");
  const filterReset = document.getElementById("filter-reset");
  const filterToggle = document.getElementById("filter-toggle");
  const selects = [filterYear, filterResult, filterLocation];

  setupFilters(entries, filterYear, filterResult, filterLocation);
  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    const activeCount = selects.filter((select) => select.value !== "all").length;
    filterToggle.textContent = activeCount ? `Filters (${activeCount})` : "Filters";
    const filtered = entries.filter((entry) => {
      const matchesYear = filterYear.value === "all" || String(entry.year) === filterYear.value;
      const matchesResult = filterResult.value === "all" || resultStatus(entry.result) === filterResult.value;
      const matchesLocation = filterLocation.value === "all" || entry.location === filterLocation.value;
      return matchesYear && matchesResult && matchesLocation && matchesSearch(entry, query);
    });
    renderTimeline(filtered, timeline);
    if (!filtered.length) {
      status.textContent = "No matching hackathons. Try another search or reset the filters.";
    } else if (query || filtered.length < entries.length) {
      status.textContent = `${filtered.length} of ${entries.length} hackathons`;
    } else {
      status.textContent = "";
    }
  }

  applyFilters();
  filterToggle.addEventListener("click", () => {
    const expanded = filterToggle.getAttribute("aria-expanded") === "true";
    filterToggle.setAttribute("aria-expanded", String(!expanded));
  });
  search.addEventListener("input", applyFilters);
  for (const select of selects) {
    select.addEventListener("change", applyFilters);
  }
  function resetFilters() {
    search.value = "";
    filterYear.value = "all";
    filterResult.value = "all";
    filterLocation.value = "all";
    applyFilters();
  }
  filterReset.addEventListener("click", resetFilters);

  function showLinkedEvent() {
    const id = location.hash.slice(1);
    timeline.querySelector(".linked")?.classList.remove("linked");
    if (!id.startsWith("event-")) return;
    if (!document.getElementById(id) && entries.some((entry) => eventId(entry) === id)) {
      resetFilters();
    }
    const card = document.getElementById(id);
    if (card) {
      card.classList.add("linked");
      card.scrollIntoView();
    }
  }
  window.addEventListener("hashchange", showLinkedEvent);
  showLinkedEvent();

  renderSummary(entries);
  timeline.setAttribute("aria-busy", "false");
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

  filterResult.add(new Option("All results", "all"));
  const recorded = new Set(list.map((entry) => resultStatus(entry.result)));
  for (const [value, [label]] of Object.entries(outcomes)) {
    if (recorded.has(value)) filterResult.add(new Option(label, value));
  }
}

function setOptions(select, items, allLabel) {
  select.innerHTML = [`<option value="all">${allLabel}</option>`]
    .concat(items.map((item) => `<option value="${item}">${item}</option>`))
    .join("");
}

function matchesSearch(entry, query) {
  if (!query) return true;
  const teammates = (entry.team || []).map(memberLabel);
  return [entry.name, entry.description, entry.projectUrl, ...teammates]
    .some((value) => value && value.toLowerCase().includes(query));
}

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
      const count = grouped[year].length;
      section.innerHTML = `<h2>${year} <span class="year-count">· ${count} ${count === 1 ? "event" : "events"}</span></h2>`;

      const sortedEntries = grouped[year]
        .slice()
        .sort((a, b) => compareEntryDates(a, b) || a.name.localeCompare(b.name));

      sortedEntries.forEach((entry) => {
        const div = document.createElement("div");
        const status = resultStatus(entry.result);
        div.id = eventId(entry);
        div.className = `entry ${status}`;
        div.innerHTML = `
        <div class="dot"></div>
        <div class="card">
          <div class="name">${entry.name}</div>
          <div class="description">${entry.description || ""}</div>
          <div class="meta result">${entry.result}</div>
          ${entry.date ? `<span class="meta reveal-date">${formatDate(entry.date)}</span>` : ""}
          <div class="meta">${detailLine(entry.location, entry.duration, entry.team)}</div>
          ${entry.projectUrl ? `<a class="project-link" href="${safeUrl(entry.projectUrl)}" target="_blank" rel="noopener">View project</a>` : ""}
        </div>
      `;
        const images = getEntryImages(entry);
        if (images.length) {
          const thumbnails = images.map((image, index) => entry.thumbnails?.[index] || image);
          addEventPhoto(div.querySelector(".card"), entry.name, thumbnails, images);
        }
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

function eventId(entry) {
  const slug = entry.slug || `${entry.year}-${entry.name}`;
  return "event-" + slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

function getEntryImages(entry) {
  if (Array.isArray(entry.images)) return entry.images.filter(Boolean);
  if (Array.isArray(entry.image)) return entry.image.filter(Boolean);
  if (entry.image) return [entry.image];
  if (entry.images) return [entry.images];
  return [];
}

function addEventPhoto(card, name, thumbnails, images) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "event-photo";
  button.setAttribute("aria-label", `Open photos from ${name}`);
  button.setAttribute("aria-haspopup", "dialog");
  const photo = document.createElement("img");
  photo.alt = "";
  photo.loading = "lazy";
  photo.decoding = "async";
  let index = 0;
  photo.src = thumbnails[index];
  button.append(photo);
  card.prepend(button);
  button.addEventListener("click", () => openGallery(name, images, index));

  if (images.length < 2) return;
  let timer;
  card.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      if (!card.isConnected) {
        window.clearInterval(timer);
        return;
      }
      index = (index + 1) % images.length;
      photo.src = thumbnails[index];
    }, 1400);
  });
  card.addEventListener("pointerleave", () => {
    window.clearInterval(timer);
    index = 0;
    photo.src = thumbnails[index];
  });
}

function openGallery(name, images, index) {
  const dialog = document.getElementById("gallery");
  const photo = document.getElementById("gallery-image");
  const previous = document.getElementById("gallery-prev");
  const next = document.getElementById("gallery-next");
  const count = document.getElementById("gallery-count");

  function show(step) {
    index = (index + step + images.length) % images.length;
    photo.src = images[index];
    photo.alt = `${name}, photo ${index + 1}`;
    count.textContent = `${index + 1} of ${images.length}`;
  }

  document.getElementById("gallery-title").textContent = name;
  previous.hidden = next.hidden = images.length < 2;
  previous.onclick = () => show(-1);
  next.onclick = () => show(1);
  dialog.onkeydown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(event.key === "ArrowLeft" ? -1 : 1);
    }
  };
  let start;
  photo.ontouchstart = (event) => {
    start = event.touches.length === 1 ? event.touches[0] : null;
  };
  photo.ontouchcancel = () => { start = null; };
  photo.ontouchend = (event) => {
    if (!start) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - start.clientX;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(end.clientY - start.clientY)) {
      show(dx < 0 ? 1 : -1);
    }
    start = null;
  };
  show(0);
  dialog.showModal();
}

function resultStatus(result) {
  const value = String(result || "").trim().toLowerCase();
  if (/\brunner[ -]?up\b/.test(value)) return "runner";
  if (/^(winner|win|won|first place|1st place)$/.test(value)) return "winner";
  if (/\bfinalists?\b/.test(value)) return "finalist";
  if (/\bqualified\b/.test(value)) return "qualified";
  if (/\brank(ed)?\b/.test(value)) return "ranked";
  if (value === "loss") return "loss";
  return "other";
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
  const counts = {};
  for (const entry of entries) {
    const status = resultStatus(entry.result);
    counts[status] = (counts[status] || 0) + 1;
  }
  const breakdown = Object.entries(outcomes)
    .filter(([key]) => counts[key])
    .map(([key, [, one, many]]) => `${counts[key]} ${counts[key] === 1 ? one : many}`);
  const total = entries.length;
  const selfKey = "sc";
  const buddies = findHackathonBuddies(entries, selfKey, 5);
  const buddy = buddies[0] || null;
  const locations = mostCommonLocations(entries, 5);
  const commonLocation = locations[0] || null;
  const longestEvent = longestDuration(entries);
  const hours = entries.map((entry) => parseHours(entry.duration)).filter((value) => value !== null);
  const teammates = new Set(entries.flatMap((entry) => entry.team || []));
  teammates.delete(selfKey);
  const solo = entries.filter((entry) => entry.team?.length === 1 && entry.team[0] === selfKey).length;

  document.getElementById("summary").innerHTML = `
    ${total} hackathons · ${breakdown.join(" · ")}
    <dl class="stat-totals">
      <div><dt>Recorded event hours</dt><dd>${hours.reduce((sum, value) => sum + value, 0)}<small>Across ${hours.length} timed events</small></dd></div>
      <div><dt>Distinct teammates</dt><dd>${teammates.size}</dd></div>
      <div><dt>Solo entries</dt><dd>${solo}</dd></div>
    </dl>
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
