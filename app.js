/* AwaHome — student housing app (vanilla JS, no build step) */
(() => {
"use strict";

/* ============================ helpers ============================ */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = (n) => "₦" + Number(n).toLocaleString("en-NG");
const clock = (d = new Date()) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const pad2 = (n) => String(n).padStart(2, "0");
const isoDate = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const prettyDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const initials = (n) => n.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "").split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const hues = ["#0e7a48", "#b45309", "#1d4ed8", "#7c3aed", "#be123c", "#0f766e", "#475569", "#c2410c"];
const hue = (s) => hues[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length];

/* ============================ icons ============================ */
const P = {
  home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
  heart: "M12 20s-7-4.5-9-9.2C1.8 7.5 4 4.5 7 4.5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 5.2 3 4 6.3C19 15.5 12 20 12 20z",
  chat: "M4 5h16v11H9l-5 4V5z",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.5-6 8-6s8 2 8 6",
  bell: "M6 17v-6a6 6 0 1112 0v6l2 2H4l2-2zM10 21h4",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  filter: "M4 7h9M17 7h3M4 17h3M11 17h9M15 4v6M9 14v6",
  back: "M15 5l-7 7 7 7",
  chev: "M9 5l7 7-7 7",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  eyeoff: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6zM4 4l16 16",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  shieldok: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5",
  pin: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  bed: "M3 18V7M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5M7 11.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  shower: "M5 20V9a4 4 0 014-4h2M11 5h5M9 12l-1 2M12 12l-1 2M15 12l-1 2M9 17l-1 2M12 17l-1 2M15 17l-1 2",
  water: "M12 3s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z",
  bus: "M5 4h14v13H5zM5 11h14M8 20v-3M16 20v-3M8.5 14h.01M15.5 14h.01",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  plus: "M12 5v14M5 12h14",
  clip: "M20 11l-8 8a5 5 0 01-7-7l8-8a3.5 3.5 0 015 5l-8 8a2 2 0 01-3-3l7-7",
  smile: "M12 21a9 9 0 100-18 9 9 0 000 18zM8.5 14c1 1.5 2.2 2 3.5 2s2.5-.5 3.5-2M9 9.5h.01M15 9.5h.01",
  more: "M12 5h.01M12 12h.01M12 19h.01",
  bookmark: "M6 4h12v17l-6-4-6 4V4z",
  book: "M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2V4zM5 18a2 2 0 012-2h11",
  history: "M4 12a8 8 0 108-8 8 8 0 00-6 2.7L4 9M4 4v5h5M12 8v4l3 2",
  flag: "M6 21V4M6 5h11l-2 4 2 4H6",
  help: "M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
  logout: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9",
  check: "M5 12.5l4.5 4.5L19 7",
  close: "M6 6l12 12M18 6L6 18",
  send: "M3 11l18-8-8 18-2-8-8-2z",
  cal: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01",
};
const ic = (n, cls = "", w = 1.7) =>
  `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;
const GOOGLE = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.2a5.3 5.3 0 01-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.4z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1.1.7-2.5 1.2-4.2 1.2-3.2 0-5.9-2.2-6.9-5H1.3v3C3.3 21.4 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.1 14.4a7.2 7.2 0 010-4.8v-3H1.3a12 12 0 000 10.8l3.8-3z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 001.3 6.6l3.8 3C6.1 7 8.8 4.8 12 4.8z"/></svg>`;
const APPLE = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>`;
const BADGE = `<svg viewBox="0 0 24 24" width="20" height="20" aria-label="Verified"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M7.5 12.3l3 3 6-6.3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const WARN = `<svg viewBox="0 0 64 64" width="52" height="52"><path fill="#DC2626" d="M32 6c1.500 0 2.800.8 3.600 2.100l24 41.500a4.200 4.200 0 01-3.600 6.300H8a4.200 4.200 0 01-3.600-6.300l24-41.500A4.100 4.100 0 0132 6z"/><rect x="29.500" y="22" width="5" height="17" rx="2.500" fill="#fff"/><circle cx="32" cy="46" r="3" fill="#fff"/></svg>`;
const LOGO_MARK = (c1 = "#0e7a48", c2 = "#f08a00") =>
  `<svg viewBox="0 0 120 64" width="110" height="59" aria-hidden="true"><path d="M60 4L8 46h12v14h20V44h40v16h20V46h12L60 4z" fill="none"/><path d="M60 6L6 50l8 6 46-38 46 38 8-6L60 6z" fill="${c1}"/><rect x="51" y="30" width="8" height="8" fill="${c1}"/><rect x="62" y="30" width="8" height="8" fill="${c1}"/><rect x="51" y="41" width="8" height="8" fill="${c1}"/><rect x="62" y="41" width="8" height="8" fill="${c1}"/><rect x="92" y="14" width="7" height="18" fill="${c1}"/></svg>`;
const logo = (cls = "") => `<div class="logo ${cls}">${LOGO_MARK(cls.includes("light") ? "#fff" : "#0e7a48")}<div class="word"><span>Awa</span><b>Home</b></div></div>`;

/* ============================ illustrations (fallbacks) ============================ */
const palettes = [["#bfe3d0", "#2f8f63", "#e8f6ef"], ["#cfe0f3", "#2d6aa8", "#eef5fc"], ["#f3dcc7", "#b8662b", "#fbf1e8"], ["#dcd3f0", "#6b4cb5", "#f4f0fb"], ["#f1cfd6", "#b23a56", "#fbeff2"]];
function houseSVG(seed = 1, v = 0) {
  const [sky, wall, tint] = palettes[(seed + v) % palettes.length];
  const floors = 2 + ((seed + v) % 2);
  let wins = "";
  for (let r = 0; r < floors; r++) for (let c = 0; c < 4; c++) wins += `<rect x="${34 + c * 17}" y="${34 + r * 20}" width="9" height="12" rx="1" fill="${tint}" opacity=".95"/>`;
  return `<svg viewBox="0 0 130 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="130" height="100" fill="${sky}"/><circle cx="${100 - v * 12}" cy="20" r="9" fill="#fff" opacity=".7"/><rect y="82" width="130" height="18" fill="#7fbf9a"/><rect x="26" y="${74 - floors * 20}" width="80" height="${8 + floors * 20}" fill="${wall}"/><path d="M20 ${76 - floors * 20}l46-18 46 18z" fill="#3b4a46"/>${wins}<rect x="56" y="66" width="18" height="22" rx="2" fill="#2b3a36"/><rect x="0" y="86" width="130" height="3" fill="#fff" opacity=".35"/></svg>`;
}
function personSVG(skin = "#8a5a3b", shirt = "#2f8f63", bg = "#d6efe2", build = true) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" rx="60" fill="${bg}"/>${build ? `<rect x="74" y="34" width="26" height="54" rx="3" fill="#6fbf92"/><rect x="79" y="40" width="6" height="7" fill="#e8f6ef"/><rect x="89" y="40" width="6" height="7" fill="#e8f6ef"/><rect x="79" y="54" width="6" height="7" fill="#e8f6ef"/><rect x="89" y="54" width="6" height="7" fill="#e8f6ef"/>` : ""}<path d="M24 120c0-24 16-38 34-38s34 14 34 38z" fill="${shirt}"/><circle cx="58" cy="56" r="20" fill="${skin}"/><path d="M38 52c0-14 9-22 20-22s20 8 20 22c-6-5-12-8-20-8s-14 3-20 8z" fill="#1f2937"/></svg>`;
}
function sceneSVG(n) {
  const base = `<rect width="400" height="360" fill="none"/><ellipse cx="200" cy="330" rx="230" ry="70" fill="#d7f0e3"/>`;
  const bld = `<rect x="20" y="170" width="150" height="170" fill="#f1f5f3"/><rect x="20" y="170" width="150" height="14" fill="#2f8f63"/>${[0, 1, 2, 3].map((r) => [0, 1].map((c) => `<rect x="${42 + c * 56}" y="${196 + r * 34}" width="30" height="22" fill="#2f8f63" opacity=".85"/>`).join("")).join("")}<rect x="75" y="300" width="28" height="40" fill="#1f5c3f"/>`;
  const person = (x, s, shirt) => `<g transform="translate(${x} 0) scale(${s})" transform-origin="200 340"><path d="M110 360c0-60 40-96 90-96s90 36 90 96z" fill="${shirt}"/><circle cx="200" cy="200" r="46" fill="#7a4a2c"/><path d="M154 192c0-34 22-54 46-54s46 20 46 54c-14-12-28-18-46-18s-32 6-46 18z" fill="#1b1b1b"/><rect x="184" y="238" width="32" height="30" fill="#7a4a2c"/></g>`;
  if (n === 0) return `<svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${base}${bld}<path d="M52 92l28 12v26c0 20-14 32-28 38-14-6-28-18-28-38v-26z" fill="none" stroke="#2f8f63" stroke-width="5"/><path d="M40 134l9 9 17-20" fill="none" stroke="#2f8f63" stroke-width="5" stroke-linecap="round"/><path d="M128 100a22 22 0 0144 0c0 22-22 40-22 40s-22-18-22-40z" fill="none" stroke="#2f8f63" stroke-width="5"/><circle cx="150" cy="100" r="8" fill="none" stroke="#2f8f63" stroke-width="5"/>${person(130, 0.95, "#2f9a4a")}<rect x="236" y="226" width="40" height="64" rx="8" fill="#1f2937" transform="rotate(-18 256 258)"/></svg>`;
  if (n === 1) return `<svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${base}<rect x="40" y="130" width="130" height="210" fill="#f1f5f3"/><rect x="40" y="130" width="130" height="14" fill="#2f8f63"/>${[0, 1, 2, 3, 4].map((r) => `<rect x="${64}" y="${160 + r * 34}" width="26" height="20" fill="#2f8f63" opacity=".85"/><rect x="${112}" y="${160 + r * 34}" width="26" height="20" fill="#2f8f63" opacity=".85"/>`).join("")}<rect x="215" y="62" width="130" height="150" rx="10" fill="#fff" stroke="#2f8f63" stroke-width="4"/><path d="M235 100l12 12 22-26" fill="none" stroke="#2f8f63" stroke-width="6" stroke-linecap="round"/><rect x="278" y="96" width="50" height="8" rx="4" fill="#cfe7db"/><path d="M235 148l12 12 22-26" fill="none" stroke="#2f8f63" stroke-width="6" stroke-linecap="round"/><rect x="278" y="144" width="50" height="8" rx="4" fill="#cfe7db"/>${person(120, 0.8, "#f08a00")}</svg>`;
  return `<svg viewBox="0 0 400 360" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${base}${person(-30, 0.62, "#2f9a4a")}${person(160, 0.62, "#1f2937")}${person(70, 0.8, "#f08a00")}${[60, 200, 320].map((x, i) => `<path d="M${x} 70l7 14 15 2-11 10 3 15-14-8-14 8 3-15-11-10 15-2z" fill="#f59e0b"/>`).join("")}</svg>`;
}

/* ============================ data ============================ */
const LISTINGS = [
  { id: 1, title: "Self Contain", area: "Obio Akpa, Abak", price: 180000, mins: 10, match: 92, beds: 1, showers: 1, rating: 4.6, nrev: 12, landlord: "Mr. Sunday Eno", verified: true, isNew: false, water: "Good", transport: "Easy", security: "High", about: "A student-friendly apartment with steady water supply, good road access and close to campus.", walk: "5 mins to AKSU" },
  { id: 2, title: "Self Contain", area: "Ikot Udo Idem", price: 200000, mins: 3, match: 94, beds: 1, showers: 1, rating: 4.6, nrev: 12, landlord: "Grace Apartments", verified: true, isNew: true, water: "Great", transport: "Very Easy", security: "High", about: "Bright, student-ready apartment with reliable water, easy road access, and just minutes from campus.", walk: "3 mins to AKSU" },
  { id: 3, title: "3 Bedroom Flat", area: "Obio Akpa", price: 450000, mins: 20, match: 93, beds: 3, showers: 2, rating: 4.4, nrev: 8, landlord: "Akpan Houses", verified: false, isNew: false, water: "Good", transport: "Easy", security: "Medium", about: "Spacious three bedroom flat that works well for students sharing the rent, with parking and a quiet compound.", walk: "20 mins to AKSU" },
  { id: 4, title: "Self Contain", area: "Udo Idiong Street", price: 200000, mins: 8, match: 95, beds: 1, showers: 1, rating: 4.7, nrev: 9, landlord: "Mr. Frank Ekong", verified: true, isNew: true, water: "Good", transport: "Easy", security: "High", about: "Neat self contain on a calm street with a gated compound and a short ride to the school gate.", walk: "8 mins to AKSU" },
  { id: 5, title: "Self Contain", area: "Obio Ibiet", price: 180000, mins: 5, match: 92, beds: 1, showers: 1, rating: 4.3, nrev: 6, landlord: "Mr. Ekemini Nyot", verified: false, isNew: false, water: "Good", transport: "Easy", security: "Medium", about: "Affordable self contain close to the campus road, with a tiled bathroom and good ventilation.", walk: "5 mins to AKSU" },
];
const REVIEWS_A = [
  ["Uduak Johnson", "“Perfect for students: clean rooms, strong security, and just a short walk to campus.”", 4.5, "1 Week ago"],
  ["Ubong Akpabio", "“Reliable utilities and friendly management, we never missed a day of water. Great study environment.”", 4.0, "2 Weeks ago"],
  ["Edidiong Ufot", "“Friendly student community, clean facilities, and dependable services — highly recommended.”", 4.7, "1 Week ago"],
  ["Akaninyene Iwok", "“Good value for students: well-maintained, secure, and consistently available utilities.”", 4.6, "3 Weeks ago"],
  ["Udim Johnson", "“Modern rooms, study-friendly atmosphere, and consistent water and Free weekend Wi‑Fi.”", 4.4, "1 Week ago"],
  ["Eduwem Enwongo", "“Well secured, Modern facilities, constant energy supply during weekends and a conducive environment.”", 4.2, "1 month ago"],
  ["Ediomo Akpan", "“I lived here during my second year. the place was always clean, the building felt safe with 24/7 guards.”", 4.8, "4 months ago"],
];
const REVIEWS_B = [
  ["Ime Micah", "“Perfect spot for uni life. I could walk to class in 10 minutes. Constant water supply meant less stress.”", 4.5, "1 Week ago"],
  ["Mfon Eduek", "“Moved in at the start of the semester and haven’t regretted it. Landlord fixes things fast.”", 4.0, "2 Weeks ago"],
  ["Endiong Jumbo", "“No water interruptions, a huge relief for students. Main road outside makes getting to campus simple and quick.”", 4.7, "1 Week ago"],
  ["Mmeyene Usen", "“Affordable, comfortable, and convenient student housing. Dependable water and smooth road access.”", 4.6, "3 Weeks ago"],
  ["Aniefiok Archibong", "“Modern rooms, study-friendly atmosphere, and consistent water.”", 4.4, "1 Week ago"],
  ["Idara Udim", "“Well secured, Modern facilities, constant energy supply during weekends and a conducive environment.”", 4.2, "1 month ago"],
  ["Nyakno Dan", "“I lived here during my second year. the place was always clean, the building felt safe with 24/7 guards.”", 4.8, "4 months ago"],
  ["Ndifreke Ukeme", "“Absolutely loved living here, the water never ran out, which was a lifesaver during exam season. Quick drive to campus. Quiet building, helpful landlord, and great value for students.”", 4.8, "4 months ago"],
];
const reviewsFor = (id) => (id === 1 ? REVIEWS_A : id === 2 ? REVIEWS_B : (id % 2 ? REVIEWS_A : REVIEWS_B).slice(0, 3 + (id % 3)));
const CONTACTS = [
  { id: "sunday", name: "Mr. Sunday Eno", listing: 1, when: "10:32 AM" },
  { id: "grace", name: "Grace Apartments", listing: 2, when: "Yesterday" },
  { id: "akpan", name: "Akpan Houses", listing: 3, when: "Yesterday" },
  { id: "idiong", name: "Mr. Akpakpan Idiong", listing: 1, when: "2 days ago" },
  { id: "nyot", name: "Mr. Ekemini Nyot", listing: 5, when: "2 days ago" },
  { id: "ekong", name: "Mr. Frank Ekong", listing: 4, when: "3 days ago" },
  { id: "alpha", name: "Alpha Apartments", listing: 1, when: "3 days ago" },
];
const SEED_MSGS = () => [
  { f: "me", t: "Hello, I’m interested in this property.", at: "10:30 AM" },
  { f: "them", t: "Hello, it’s still available. Would you like to book an inspection?", at: "10:32 AM" },
  { f: "me", t: "Yes, definitely.", at: "10:30 AM" },
];
const ROLES = [
  { id: "student", title: "Accommodation Seeker", sub: "Find verified homes and avoid scams", art: personSVG("#7a4a2c", "#7bb36b", "#e3f3e8") },
  { id: "landlord", title: "Landlord/ Property owner", sub: "List and manage your properties", art: personSVG("#6b3f26", "#5c7a3a", "#f3efe2") },
  { id: "agent", title: "Agent/Property Manager", sub: "Connect verified listings with seekers", art: personSVG("#7a4a2c", "#23543d", "#dfeee6") },
];
const ISSUES = ["Fake Listing", "Fake Agent", "Wrong Photos", "Already Occupied", "Payment Scam", "Wrong Location"];
const FAQ = [
  ["How are landlords verified?", "Landlords with a green shield have had their identity and property details checked. Always inspect a property before paying anything."],
  ["Should I pay before inspecting?", "No. Never pay before you have physically inspected the property. If someone asks you to, use Report Scam on the listing."],
  ["How do I book an inspection?", "Open a listing, tap Book Inspection, pick a date and time, then confirm. You’ll find it under My Bookings in your profile."],
  ["What happens after I report a scam?", "Our team reviews the report, which can take 12–24 hours, and you’ll be notified once it’s done."],
  ["Can I change my role?", "Yes. Go to Profile → Settings and choose a different role at any time."],
];

/* ============================ state ============================ */
const KEY = "awahome:v1";
const defaults = () => ({
  loggedIn: false, onboarded: false, role: null,
  user: { name: "Iniobong Akpan", email: "" },
  saved: [], bookings: [], reports: [], blocked: [],
  chats: { sunday: SEED_MSGS() }, unread: { sunday: 1 },
  settings: { notifs: true, dark: false }, notifSeen: false,
});
let S;
try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { S = defaults(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
const applyTheme = () => document.documentElement.setAttribute("data-theme", S.settings.dark ? "dark" : "light");
applyTheme();
const firstName = () => S.user.name.split(" ")[0];

let filters = { q: "", price: 500000, dist: 30, type: "All", verified: false, fresh: false, sort: "match" };
let draft = { listing: null, issue: null, files: [], text: "" };

/* ============================ shell: router, toast, sheets ============================ */
const app = $("#app");
const view = document.createElement("div");
const navEl = document.createElement("nav");
navEl.className = "nav"; navEl.setAttribute("aria-label", "Main");
const toastEl = document.createElement("div");
toastEl.id = "toast"; toastEl.setAttribute("role", "status");
app.append(view, toastEl);

let toastT;
function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 2400); }

function overlay(html, { center = false, onMount } = {}) {
  closeOverlay();
  const el = document.createElement("div");
  el.className = "scrim" + (center ? " center" : "");
  el.id = "overlay"; el.innerHTML = html;
  el.addEventListener("click", (e) => { if (e.target === el) closeOverlay(); });
  app.append(el);
  onMount && onMount(el);
  return el;
}
function closeOverlay() { $("#overlay")?.remove(); }
function confirmBox(title, text, okLabel, onOk, danger = true) {
  overlay(`<div class="dialog" role="alertdialog"><h3 class="h3">${esc(title)}</h3><p>${esc(text)}</p><div class="two"><button class="btn ghost" data-x>Cancel</button><button class="btn ${danger ? "danger" : ""}" data-ok>${esc(okLabel)}</button></div></div>`,
    { center: true, onMount: (el) => { $("[data-x]", el).onclick = closeOverlay; $("[data-ok]", el).onclick = () => { closeOverlay(); onOk(); }; } });
}

let stack = [], cleanups = [], goingBack = false;
const go = (path, replace = false) => {
  if (replace) location.replace("#" + path); else location.hash = "#" + path;
};
const back = (fallback = "/home") => { if (stack.length > 1) { goingBack = true; history.back(); } else go(fallback, true); };

function hydrate(root) {
  $$("[data-src]", root).forEach((el) => {
    const im = new Image();
    im.onload = () => { el.style.backgroundImage = `url("${el.dataset.src}")`; el.classList.add("loaded"); };
    im.src = el.dataset.src;
  });
}
function swipe(el, onLeft, onRight) {
  let x0 = null, y0 = 0;
  el.addEventListener("pointerdown", (e) => { x0 = e.clientX; y0 = e.clientY; });
  el.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? onLeft : onRight)();
  });
  el.addEventListener("pointercancel", () => (x0 = null));
}

/* ============================ reusable pieces ============================ */
const photo = (src, svg, cls = "") => `<div class="photo ${cls}" data-src="${src}">${svg}</div>`;
const avatar = (name, src) => `<div class="avatar" style="background-color:${hue(name)}" ${src ? `data-src="${src}"` : ""}><span>${esc(initials(name))}</span></div>`;
const topbar = (title, { green = false, right = "", backTo = "/home" } = {}) =>
  `<header class="topbar ${green ? "green" : ""}"><button class="icon-btn" data-back="${backTo}" aria-label="Back">${ic("back")}</button><h2>${esc(title)}</h2><div>${right}</div></header>`;
const card = (l) => `
  <div class="card" role="button" tabindex="0" data-go="/listing/${l.id}" aria-label="${esc(l.title)}, ${esc(l.area)}">
    ${photo(`assets/p${l.id}-1.jpg`, houseSVG(l.id))}
    <div class="meta" style="padding-right:56px"><b>${esc(l.title)}</b><span class="loc">${esc(l.area)}</span>
      <span class="price">${money(l.price)}<small>/year</small></span><span class="dist">${l.mins} mins to school</span>
      <span class="match" title="Match score">${l.match}%</span></div>
  </div>`;
const emptyState = (icon, title, text) => `<div class="empty">${ic(icon, "", 1.2)}<b>${esc(title)}</b><span class="small">${esc(text)}</span></div>`;
const types = () => ["All", ...new Set(LISTINGS.map((l) => l.title))];
function filtered() {
  const q = filters.q.trim().toLowerCase();
  let r = LISTINGS.filter((l) =>
    (!q || [l.title, l.area, l.landlord, "aksu"].some((s) => s.toLowerCase().includes(q))) &&
    l.price <= filters.price && l.mins <= filters.dist &&
    (filters.type === "All" || l.title === filters.type) && (!filters.verified || l.verified) && (!filters.fresh || l.isNew));
  if (filters.sort === "price") r.sort((a, b) => a.price - b.price);
  else if (filters.sort === "near") r.sort((a, b) => a.mins - b.mins);
  else r.sort((a, b) => b.match - a.match);
  return r;
}
const NAVS = [["home", "/home", "Home"], ["heart", "/saved", "Saved"], ["chat", "/chats", "Chats"], ["user", "/profile", "Profile"]];
function renderNav(active) {
  const unread = Object.values(S.unread).reduce((a, b) => a + b, 0);
  navEl.innerHTML = NAVS.map(([i, p, t]) => `<a href="#${p}" class="${active === p ? "on" : ""}" ${active === p ? 'aria-current="page"' : ""}>${ic(i)}<span>${t}</span>${p === "/chats" && unread ? `<em class="badge">${unread}</em>` : ""}</a>`).join("");
}

/* ============================ screens ============================ */
const screens = {};

screens.splash = () => ({
  cls: "splash",
  html: `<div class="bubble b1"></div><div class="bubble b2"></div>
    <div class="inner">${logo("light")}<h2>Search Smart. Rent Safe.</h2><p>Safe accommodation for students &amp; newcomers around AKSU</p></div>
    <div class="art"><div class="photo" data-src="assets/splash.png" style="height:100%;background-color:transparent;background-size:contain;background-repeat:no-repeat;background-position:bottom"></div></div>
    <div class="dots"><i></i><i></i><i></i></div>`,
  mount() { const t = setTimeout(() => go(S.loggedIn ? "/home" : S.onboarded ? "/signin" : "/onboarding", true), 2300); cleanups.push(() => clearTimeout(t)); },
});

screens.onboarding = () => {
  const slides = [
    ["Find verified accomodation you can trust", "Real listings. Real landlords.<br>Real reviews."],
    ["Inspect before you pay", "Book Inspections and avoid costly mistakes"],
    ["Join a trusted community", "Reviews and ratings from real students."],
  ];
  return {
    cls: "onb",
    html: `<button class="skip green" data-skip aria-label="Skip">Skip</button>
      <div class="track">${slides.map((s, i) => `<section class="slide" aria-label="Step ${i + 1} of 3"><h1>${s[0]}</h1><p>${s[1]}</p><div class="art" data-src="assets/onboarding-${i + 1}.png" style="background-size:contain;background-position:bottom;background-repeat:no-repeat">${sceneSVG(i)}</div></section>`).join("")}</div>
      <div class="ctrl"><div class="pager"><i></i><i></i><i></i></div><button class="btn" data-next>Next</button></div>`,
    mount(root) {
      let i = 0;
      const track = $(".track", root), dots = $$(".pager i", root), next = $("[data-next]", root), skip = $("[data-skip]", root);
      const finish = () => { S.onboarded = true; save(); go("/signin", true); };
      const set = (n) => {
        i = Math.max(0, Math.min(2, n));
        track.style.transform = `translateX(-${i * 33.3333}%)`;
        dots.forEach((d, k) => d.classList.toggle("on", k === i));
        const last = i === 2;
        next.textContent = last ? "Get Started" : "Next"; next.classList.toggle("wide", last);
        skip.style.display = last ? "none" : "";
        $(".pager", root).style.display = last ? "none" : "";
      };
      next.onclick = () => (i === 2 ? finish() : set(i + 1));
      skip.onclick = finish;
      swipe(track, () => set(i + 1), () => set(i - 1));
      set(0);
    },
  };
};

function authScreen(signup) {
  return {
    html: `<div class="pad" style="padding-top:clamp(28px,7vh,60px);display:flex;flex-direction:column;gap:20px;flex:1">
      <div style="display:grid;place-items:center">${logo()}</div>
      <form class="auth" novalidate style="display:flex;flex-direction:column;gap:16px;margin-top:8px">
        ${signup ? `<div class="field"><label for="nm">Full name</label><div class="input"><input id="nm" name="name" autocomplete="name" placeholder="Iniobong Akpan" /></div><div class="errmsg" data-e="name"></div></div>` : ""}
        <div class="field"><label for="em">Email</label><div class="input"><input id="em" name="email" type="email" autocomplete="email" inputmode="email" placeholder="Jennifer@example.com" /></div><div class="errmsg" data-e="email"></div></div>
        <div class="field"><label for="pw">Password</label><div class="input"><input id="pw" name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" placeholder="Insert your password" /><button type="button" class="icon-btn" data-eye aria-label="Show password" style="width:32px;height:32px">${ic("eye")}</button></div><div class="errmsg" data-e="password"></div></div>
        ${signup ? "" : `<div style="text-align:right;margin-top:-8px"><button type="button" class="link" data-forgot>Forget Password?</button></div>`}
        <button class="btn" type="submit">${signup ? "Create account" : "Login"}</button>
      </form>
      <div class="divider">or continue with</div>
      <div class="social"><button class="btn ghost" data-social>${GOOGLE} Google</button><button class="btn ghost" data-social>${APPLE} Apple</button></div>
      <p class="small" style="text-align:center">${signup ? "Already have an account? " : "Don't have an account? "}<a href="#${signup ? "/signin" : "/signup"}" class="link">${signup ? "Log in" : "Sign Up"}</a></p>
      <p class="cap" style="text-align:center;margin-top:auto;padding-bottom:20px;line-height:1.5">By signing in, you agree to our? <a href="#/help">Terms and Conditions.</a><br>Learn how we use your data in our <a href="#/help">Privacy Policy</a></p>
    </div>`,
    mount(root) {
      const f = $(".auth", root), pw = $("#pw", root);
      $("[data-eye]", root).onclick = (e) => { const show = pw.type === "password"; pw.type = show ? "text" : "password"; e.currentTarget.innerHTML = ic(show ? "eyeoff" : "eye"); e.currentTarget.setAttribute("aria-label", show ? "Hide password" : "Show password"); };
      const err = (k, m) => { const e = $(`[data-e=${k}]`, root); if (e) { e.textContent = m || ""; e.parentElement.querySelector(".input")?.classList.toggle("err", !!m); } return !m; };
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(f));
        let ok = true;
        if (signup) ok = err("name", d.name.trim().length < 2 ? "Please enter your name" : "") && ok;
        ok = err("email", /^\S+@\S+\.\S+$/.test(d.email.trim()) ? "" : "Enter a valid email address") && ok;
        ok = err("password", d.password.length >= 6 ? "" : "Password must be at least 6 characters") && ok;
        if (!ok) return;
        S.loggedIn = true; S.user.email = d.email.trim();
        if (signup) S.user.name = d.name.trim();
        save(); go(S.role ? "/home" : "/role", true);
      });
      $$("[data-social]", root).forEach((b) => (b.onclick = () => { S.loggedIn = true; save(); toast("Demo mode: signed in without a real account"); go(S.role ? "/home" : "/role", true); }));
      $("[data-forgot]", root)?.addEventListener("click", () => overlay(`<div class="sheet"><div class="grab"></div><h3>Reset your password</h3><div class="field"><label for="rem">Email</label><div class="input"><input id="rem" type="email" placeholder="Jennifer@example.com" /></div></div><button class="btn" style="margin-top:16px" data-send>Send reset link</button></div>`, { onMount: (el) => ($("[data-send]", el).onclick = () => { if (/^\S+@\S+\.\S+$/.test($("#rem", el).value)) { closeOverlay(); toast("If that email exists, a reset link is on its way"); } else toast("Enter a valid email"); }) }));
    },
  };
}
screens.signin = () => authScreen(false);
screens.signup = () => authScreen(true);

screens.role = () => ({
  html: `<div class="pad" style="padding-top:24px;display:flex;flex-direction:column;flex:1;gap:8px">
    <div style="display:grid;place-items:center;transform:scale(.7);margin:-14px 0 -8px">${logo()}</div>
    <h1 class="h2" style="text-align:center;font-size:clamp(22px,6.5vw,26px);line-height:1.25;font-weight:500">Choose how you want<br>to use AwaHome</h1>
    <p class="cap muted" style="text-align:center;margin-bottom:8px">This helps us personalize your experience</p>
    <div class="role-list" role="radiogroup" aria-label="Role">${ROLES.map((r) => `<button class="role ${S.role === r.id ? "on" : ""}" role="radio" aria-checked="${S.role === r.id}" data-role="${r.id}"><div class="pic">${r.art}</div><div><h3>${r.title}</h3><p>${r.sub}</p></div><span class="radio"></span></button>`).join("")}</div>
    <div class="note" style="margin-top:8px">${ic("shieldok")}<div><b>Your role can be changed anytime</b><span>You can switch roles in your profile settings</span></div></div>
    </div><div class="footer"><button class="btn" data-cont ${S.role ? "" : "disabled"}>Continue</button></div>`,
  mount(root) {
    let pick = S.role;
    $$("[data-role]", root).forEach((b) => (b.onclick = () => { pick = b.dataset.role; $$("[data-role]", root).forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-checked", on); }); $("[data-cont]", root).disabled = false; }));
    $("[data-cont]", root).onclick = () => { S.role = pick; save(); if (pick !== "student") toast("Landlord & agent tools are coming soon — showing the seeker experience"); go("/home", true); };
  },
});

screens.home = () => ({
  cls: "mint has-nav", nav: "/home",
  html: `<div class="home-head"><div><p class="hello">Hello, ${esc(firstName())}</p><h1 class="h1">Find verified homes<br>around AKSU</h1></div>
      <button class="icon-btn bell" data-bell aria-label="Notifications">${ic("bell", "", 1.6)}${S.notifSeen || !S.settings.notifs ? "" : "<i></i>"}</button></div>
    <p class="sub">Search trusted listings before making payments</p>
    <div class="input search"><span class="muted">${ic("search")}</span><input id="q" type="search" placeholder="Search by area, lodge or landmark" aria-label="Search listings" value="${esc(filters.q)}" /><button class="icon-btn" data-filter aria-label="Filters">${ic("filter", "", 1.6)}</button></div>
    <div class="hero"><div class="bg" data-src="assets/hero.jpg" style="background-size:cover;background-position:center">${houseSVG(2, 1)}</div>
      <h3>Find homes you can trust</h3><p>Verified listings. Real reviews. Safer renting.</p><button class="btn" data-explore>Explore Listings</button></div>
    <div class="chips"><button class="chip on" data-chip="rent">For Rent</button><button class="chip ${filters.verified ? "on" : ""}" data-chip="verified">${ic("shield", "", 1.7).replace('width="24" height="24"', 'width="18" height="18"')} Verified Only</button><button class="chip ${filters.fresh ? "on" : ""}" data-chip="new">${ic("tag", "", 1.7).replace('width="24" height="24"', 'width="18" height="18"')} New Listings</button></div>
    <div class="sec" id="rec"><h3>Recommended for you</h3><a class="link" href="#/listings">See all</a></div>
    <div class="list" id="list"></div>`,
  mount(root) {
    const list = $("#list", root);
    const paint = () => {
      const r = filtered();
      list.innerHTML = r.length ? r.map(card).join("") : emptyState("search", "No homes match your search", "Try clearing a filter or searching a different area.");
      hydrate(list);
    };
    paint();
    $("#q", root).addEventListener("input", (e) => { filters.q = e.target.value; paint(); });
    $("[data-explore]", root).onclick = () => $("#rec", root).scrollIntoView({ behavior: "smooth", block: "start" });
    $("[data-bell]", root).onclick = openNotifications;
    $("[data-filter]", root).onclick = () => openFilters(paint, root);
    $$("[data-chip]", root).forEach((c) => (c.onclick = () => {
      const k = c.dataset.chip;
      if (k === "rent") return toast("Only rentals are listed around AKSU right now");
      if (k === "verified") filters.verified = !filters.verified; else filters.fresh = !filters.fresh;
      c.classList.toggle("on"); paint();
    }));
  },
});

function openFilters(onApply) {
  const f = { ...filters };
  overlay(`<div class="sheet" role="dialog" aria-label="Filters"><div class="grab"></div><h3>Filter listings</h3>
    <div class="group"><label>Max price <b data-v="price">${money(f.price)}/yr</b></label><input type="range" id="fp" min="100000" max="500000" step="10000" value="${f.price}"></div>
    <div class="group"><label>Distance to school <b data-v="dist">${f.dist} mins</b></label><input type="range" id="fd" min="1" max="30" step="1" value="${f.dist}"></div>
    <div class="group"><label>Property type</label><div class="seg">${types().map((t) => `<button class="chip ${f.type === t ? "on" : ""}" data-type="${esc(t)}">${esc(t)}</button>`).join("")}</div></div>
    <div class="set"><div>Verified landlords only<small>Hide listings pending verification</small></div><button class="switch ${f.verified ? "on" : ""}" id="fv" role="switch" aria-checked="${f.verified}" aria-label="Verified only"></button></div>
    <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px;margin-top:20px"><button class="btn ghost" data-reset>Reset</button><button class="btn" data-apply>Show results</button></div></div>`,
    { onMount(el) {
      $("#fp", el).oninput = (e) => { f.price = +e.target.value; $('[data-v=price]', el).textContent = money(f.price) + "/yr"; };
      $("#fd", el).oninput = (e) => { f.dist = +e.target.value; $('[data-v=dist]', el).textContent = f.dist + " mins"; };
      $$("[data-type]", el).forEach((b) => (b.onclick = () => { f.type = b.dataset.type; $$("[data-type]", el).forEach((x) => x.classList.toggle("on", x === b)); }));
      $("#fv", el).onclick = (e) => { f.verified = !f.verified; e.currentTarget.classList.toggle("on", f.verified); e.currentTarget.setAttribute("aria-checked", f.verified); };
      $("[data-reset]", el).onclick = () => { Object.assign(filters, { price: 500000, dist: 30, type: "All", verified: false, fresh: false }); closeOverlay(); onApply(); go(location.hash.slice(1), true); };
      $("[data-apply]", el).onclick = () => { Object.assign(filters, f); closeOverlay(); onApply(); if (location.hash === "#/home") go("/home", true); };
    } });
}

function openNotifications() {
  S.notifSeen = true; save();
  const items = [];
  S.bookings.filter((b) => b.status === "Upcoming").slice(-2).forEach((b) => { const l = LISTINGS.find((x) => x.id === b.listing); items.push(["cal", `Inspection booked: ${l.title}, ${l.area}`, `${prettyDate(b.date)} · ${b.time}`]); });
  if (S.unread.sunday) items.push(["chat", "Mr. Sunday Eno is typing…", "Tap Chats to reply"]);
  items.push(["tag", "2 new listings near AKSU", "Ikot Udo Idem and Udo Idiong Street"], ["shieldok", "Tip: never pay before you inspect", "Use Report Scam if anyone asks you to"]);
  overlay(`<div class="sheet" role="dialog" aria-label="Notifications"><div class="grab"></div><h3>Notifications</h3>${S.settings.notifs ? items.map(([i, t, s]) => `<div class="notif"><div class="dot">${ic(i)}</div><div><b>${esc(t)}</b><small>${esc(s)}</small></div></div>`).join("") : emptyState("bell", "Notifications are off", "Turn them on in Settings.")}</div>`);
  $(".bell i")?.remove();
}

screens.listings = () => ({
  html: `${topbar("All listings", { backTo: "/home" })}
    <div class="chips" style="padding-top:4px">${[["match", "Best match"], ["price", "Lowest price"], ["near", "Closest"]].map(([k, t]) => `<button class="chip ${filters.sort === k ? "on" : ""}" data-sort="${k}">${t}</button>`).join("")}</div>
    <div class="list" id="list" style="padding-top:12px"></div>`,
  mount(root) {
    const list = $("#list", root);
    const paint = () => { const r = filtered(); list.innerHTML = r.length ? r.map(card).join("") : emptyState("search", "Nothing here yet", "Adjust your filters on the Home screen."); hydrate(list); };
    paint();
    $$("[data-sort]", root).forEach((b) => (b.onclick = () => { filters.sort = b.dataset.sort; $$("[data-sort]", root).forEach((x) => x.classList.toggle("on", x === b)); paint(); }));
  },
});

screens.listing = (id) => {
  const l = LISTINGS.find((x) => x.id === +id);
  if (!l) return { html: emptyState("search", "Listing not found", "It may have been removed."), mount() {} };
  const liked = S.saved.includes(l.id);
  return {
    html: `<div class="gallery"><div class="slides">${[0, 1, 2].map((v) => photo(`assets/p${l.id}-${v + 1}.jpg`, houseSVG(l.id, v))).join("")}</div>
        <button class="icon-btn abs l" data-back="/home" aria-label="Back">${ic("back")}</button>
        <button class="icon-btn abs r ${liked ? "liked" : ""}" data-like aria-label="Save listing" aria-pressed="${liked}">${ic("heart")}</button>
        <div class="dots"><i class="on"></i><i></i><i></i></div></div>
      <div class="d-title"><div><h2>${esc(l.title)}</h2><p class="muted small">${esc(l.area)}</p><div class="rating" style="margin-top:6px">${ic("star")} ${l.rating.toFixed(1)} (${l.nrev} reviews)</div></div>
        <div class="price" style="display:flex;flex-direction:column;align-items:flex-end;gap:10px"><span><span class="amt">${money(l.price)}</span><small>/year</small></span>${l.verified ? `<span class="verified">${ic("shieldok", "", 1.8).replace('width="24" height="24"', 'width="20" height="20"')} Verified Landlord</span>` : `<span class="verified pending">${ic("shield", "", 1.8).replace('width="24" height="24"', 'width="20" height="20"')} Verification pending</span>`}</div></div>
      <div class="feats"><span class="feat">${ic("bed")} ${l.beds} Bed</span><span class="feat">${ic("shower")} ${l.showers} Shower</span><span class="feat">${ic("pin")} ${esc(l.walk)}</span><span class="feat">${ic("water")} Constant water</span></div>
      <hr><div class="block"><h3>About this property</h3><p>${esc(l.about)}</p></div><hr>
      <div class="block"><h3>Area Insights</h3><div class="insights"><div class="insight">${ic("water")}<div>Water<b>${l.water}</b></div></div><div class="insight">${ic("bus")}<div>Transport<b>${l.transport}</b></div></div><div class="insight">${ic("shieldok")}<div>Security<b>${l.security}</b></div></div></div>
      <div style="text-align:right;margin-top:12px"><a class="link" href="#/reviews/${l.id}">See all reviews</a></div></div>
      <div class="actions"><button class="btn" data-go="/book/${l.id}">Book<small>Inspection</small></button><button class="btn outline" data-chat>Chat With Landlord</button><button class="btn danger" data-go="/report/${l.id}">Report<small>Scam</small></button></div>`,
    mount(root) {
      const slides = $(".slides", root), dots = $$(".dots i", root); let i = 0;
      const set = (n) => { i = (n + 3) % 3; slides.style.transform = `translateX(-${i * 100}%)`; dots.forEach((d, k) => d.classList.toggle("on", k === i)); };
      swipe($(".gallery", root), () => set(i + 1), () => set(i - 1));
      $("[data-like]", root).onclick = (e) => {
        const b = e.currentTarget, idx = S.saved.indexOf(l.id);
        if (idx > -1) S.saved.splice(idx, 1); else S.saved.push(l.id);
        save(); const on = idx === -1; b.classList.toggle("liked", on); b.setAttribute("aria-pressed", on); toast(on ? "Saved to your list" : "Removed from saved");
      };
      $("[data-chat]", root).onclick = () => {
        const c = CONTACTS.find((c) => c.listing === l.id && c.name === l.landlord) || CONTACTS.find((c) => c.listing === l.id) || { id: "l" + l.id };
        go("/chat/" + c.id);
      };
    },
  };
};

screens.reviews = (id) => {
  const l = LISTINGS.find((x) => x.id === +id) || LISTINGS[0], rs = reviewsFor(l.id);
  return {
    html: `${topbar(`Reviews (${rs.length})`, { green: true, backTo: "/listing/" + l.id })}
      ${rs.map((r) => `<article class="review">${avatar(r[0], `assets/avatars/${r[0].split(" ")[0].toLowerCase()}.jpg`)}<div class="who"><b>${esc(r[0])}</b><span>Verified Tenant</span></div><p>${esc(r[1])}<span class="rate">${ic("star")} ${r[2].toFixed(1)}</span></p><span class="when">${esc(r[3])}</span></article>`).join("")}`,
    mount(root) { hydrate(root); },
  };
};

screens.book = (id) => {
  const l = LISTINGS.find((x) => x.id === +id) || LISTINGS[0];
  const now = new Date(); const today = isoDate(now.getFullYear(), now.getMonth(), now.getDate());
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"];
  return {
    html: `${topbar("Book Inspection", { backTo: "/listing/" + l.id })}
      <div class="cal-wrap"><h3>Select Date</h3><div class="cal-head"><button class="icon-btn" data-prev aria-label="Previous month">${ic("back")}</button><b data-month></b><button class="icon-btn" data-nextm aria-label="Next month">${ic("chev")}</button></div>
        <div class="dow">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<span>${d}</span>`).join("")}</div><div class="days" data-days></div>
        <h3 style="margin-top:20px">Select Time</h3><div class="times" data-times>${times.map((t) => `<button class="time" data-t="${t}">${t}</button>`).join("")}</div>
        <p class="cap muted" style="margin-top:12px">Inspecting <b>${esc(l.title)}</b>, ${esc(l.area)} — please don’t pay anything before you’ve seen the property.</p></div>
      <div class="footer"><button class="btn ok" data-confirm disabled>Confirm Booking</button></div>`,
    mount(root) {
      let y = now.getFullYear(), m = now.getMonth(), sel = null, st = null;
      const days = $("[data-days]", root), btn = $("[data-confirm]", root);
      const paint = () => {
        $("[data-month]", root).textContent = new Date(y, m, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
        $("[data-prev]", root).disabled = y === now.getFullYear() && m === now.getMonth();
        const first = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate();
        days.innerHTML = '<i class="blank"></i>'.repeat(first) + Array.from({ length: n }, (_, k) => { const iso = isoDate(y, m, k + 1); return `<button class="day ${iso === today ? "today" : ""} ${iso === sel ? "on" : ""}" data-d="${iso}" ${iso < today ? "disabled" : ""} aria-pressed="${iso === sel}">${k + 1}</button>`; }).join("");
        $$("[data-d]", days).forEach((b) => (b.onclick = () => { sel = b.dataset.d; paint(); check(); }));
      };
      const check = () => (btn.disabled = !(sel && st));
      $("[data-prev]", root).onclick = () => { m--; if (m < 0) { m = 11; y--; } paint(); };
      $("[data-nextm]", root).onclick = () => { m++; if (m > 11) { m = 0; y++; } paint(); };
      $$("[data-t]", root).forEach((b) => (b.onclick = () => { st = b.dataset.t; $$("[data-t]", root).forEach((x) => x.classList.toggle("on", x === b)); check(); }));
      btn.onclick = () => {
        const b = { id: "b" + Date.now(), listing: l.id, date: sel, time: st, status: "Upcoming" };
        S.bookings.push(b); save(); go("/booked/" + b.id, true);
      };
      paint();
    },
  };
};

screens.booked = (id) => {
  const b = S.bookings.find((x) => x.id === id);
  return {
    cls: "success",
    html: `<div class="ripple"><i></i><i></i><i></i><div class="tick">${ic("check", "", 3)}</div></div>
      <p class="h3" style="font-weight:500;margin-top:20px">Appointment</p><h1 class="h2">Booking Confirmed!</h1>
      <p class="small muted" style="max-width:230px">Your inspection is saved in My Bookings.</p>
      ${b ? `<div class="sum">${prettyDate(b.date)} · ${esc(b.time)}</div>` : ""}
      <button class="btn" data-go="/home">Back</button><button class="link" style="margin-top:8px" data-go="/bookings">View my bookings</button>`,
    mount() {},
  };
};

screens.bookings = () => {
  const up = S.bookings.filter((b) => b.status === "Upcoming").sort((a, b) => a.date.localeCompare(b.date));
  return {
    html: `${topbar("My Bookings", { backTo: "/profile" })}<div class="stack">${up.length ? up.map((b) => bookingItem(b, true)).join("") : emptyState("cal", "No upcoming inspections", "Book an inspection from any listing.")}</div>`,
    mount(root) {
      hydrate(root);
      $$("[data-cancel]", root).forEach((x) => (x.onclick = () => confirmBox("Cancel this inspection?", "You can always book another time.", "Cancel booking", () => { const b = S.bookings.find((k) => k.id === x.dataset.cancel); b.status = "Cancelled"; save(); toast("Booking cancelled"); go("/bookings", true); })));
    },
  };
};
function bookingItem(b, cancel) {
  const l = LISTINGS.find((x) => x.id === b.listing);
  return `<div class="item">${photo(`assets/p${l.id}-1.jpg`, houseSVG(l.id))}<div><b>${esc(l.title)} · ${esc(l.area)}</b><small>${prettyDate(b.date)} · ${esc(b.time)}</small><div class="row2"><span class="tag ${b.status === "Cancelled" ? "red" : ""}">${b.status}</span>${cancel ? `<button class="linkbtn" data-cancel="${b.id}">Cancel</button>` : ""}</div></div></div>`;
}
screens.history = () => {
  const past = S.bookings.filter((b) => b.status !== "Upcoming");
  return { html: `${topbar("Inspection History", { backTo: "/profile" })}<div class="stack">${past.length ? past.map((b) => bookingItem(b, false)).join("") : emptyState("history", "No past inspections", "Cancelled and completed inspections show up here.")}</div>`, mount(r) { hydrate(r); } };
};

screens.saved = () => {
  const r = LISTINGS.filter((l) => S.saved.includes(l.id));
  return { cls: "has-nav", nav: "/saved", html: `<header class="topbar"><div></div><h2>Saved Listings</h2><div></div></header><div class="list">${r.length ? r.map(card).join("") : emptyState("heart", "Nothing saved yet", "Tap the heart on a listing to keep it here.")}</div>`, mount(root) { hydrate(root); } };
};

/* ----- report flow ----- */
screens.report = (id) => {
  if (id) draft.listing = +id;
  return {
    html: `${topbar("", { backTo: draft.listing ? "/listing/" + draft.listing : "/profile" })}
      <div class="rp-head">${WARN}<h2>Report a Scam</h2><p class="cap muted">Help keep the community safe</p></div>
      <h3 class="h3" style="padding:28px var(--pad) 8px;font-weight:600;font-size:18px">What’s the issue?</h3>
      <div class="opts" role="radiogroup">${ISSUES.map((t) => `<button class="opt ${draft.issue === t ? "on" : ""}" role="radio" aria-checked="${draft.issue === t}" data-i="${t}"><span class="radio"></span>${t}</button>`).join("")}</div>
      <div class="footer"><button class="btn danger" data-cont ${draft.issue ? "" : "disabled"}>Continue</button></div>`,
    mount(root) {
      $$("[data-i]", root).forEach((b) => (b.onclick = () => { draft.issue = b.dataset.i; $$("[data-i]", root).forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-checked", on); }); $("[data-cont]", root).disabled = false; }));
      $("[data-cont]", root).onclick = () => go("/report/evidence");
    },
  };
};
screens.evidence = () => ({
  html: `${topbar("Upload Evidence (optional)", { backTo: "/report" })}
    <p class="small" style="text-align:center;padding:0 40px">Add screenshots, photos or chats that support your report.</p>
    <label class="upload" tabindex="0">${ic("plus", "", 1.4)}<span class="small">Add Photos</span><input class="sr" type="file" accept="image/*" multiple /></label>
    <div class="thumbs" data-thumbs></div>
    <p class="small" style="text-align:center;margin-top:16px" data-count></p>
    <div class="footer" style="margin-top:auto"><button class="btn danger" data-next style="max-width:230px;margin:0 auto">Next</button></div>`,
  mount(root) {
    const inp = $("input[type=file]", root), th = $("[data-thumbs]", root);
    const paint = () => {
      th.innerHTML = draft.files.map((f, i) => `<div class="thumb" style="background-image:url('${f.url}')"><button data-rm="${i}" aria-label="Remove photo">${ic("close", "", 2.4)}</button></div>`).join("");
      $("[data-count]", root).textContent = `You can upload up to 5 images${draft.files.length ? ` · ${draft.files.length} added` : ""}`;
      $$("[data-rm]", th).forEach((b) => (b.onclick = () => { URL.revokeObjectURL(draft.files[+b.dataset.rm].url); draft.files.splice(+b.dataset.rm, 1); paint(); }));
    };
    inp.onchange = () => {
      for (const f of inp.files) { if (draft.files.length >= 5) { toast("You can add up to 5 images"); break; } if (f.type.startsWith("image/")) draft.files.push({ name: f.name, url: URL.createObjectURL(f) }); }
      inp.value = ""; paint();
    };
    $(".upload", root).addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && inp.click());
    $("[data-next]", root).onclick = () => go("/report/describe");
    paint();
  },
});
screens.describe = () => ({
  html: `${topbar("Describe the issue", { backTo: "/report/evidence" })}
    <p class="small" style="text-align:center">Tell us what happened.</p>
    <div class="pad" style="margin-top:24px"><textarea maxlength="500" placeholder="The landlord posted this apartment but it’s not available and he asked for payment before inspection." aria-label="Describe the issue">${esc(draft.text)}</textarea><div class="counter" data-c>${draft.text.length}/500</div></div>
    <div class="footer"><button class="btn danger" data-submit ${draft.text.trim().length < 10 ? "disabled" : ""}>Submit Report</button></div>`,
  mount(root) {
    const ta = $("textarea", root), btn = $("[data-submit]", root);
    ta.oninput = () => { draft.text = ta.value; $("[data-c]", root).textContent = `${ta.value.length}/500`; btn.disabled = ta.value.trim().length < 10; };
    btn.onclick = () => {
      S.reports.push({ id: "r" + Date.now(), listing: draft.listing, issue: draft.issue, text: draft.text.trim(), photos: draft.files.length, at: new Date().toISOString() });
      save(); draft.files.forEach((f) => URL.revokeObjectURL(f.url)); draft = { listing: null, issue: null, files: [], text: "" }; go("/report/done", true);
    };
  },
});
screens.reportdone = () => ({
  cls: "success",
  html: `<div class="ripple"><i></i><i></i><i></i><div class="tick">${ic("check", "", 3)}</div></div>
    <h1 class="h2" style="margin-top:20px">Report Submitted</h1><p class="h3" style="font-size:16px;font-weight:500;max-width:290px">Thank You for helping keep AwaHome safe for everyone.</p>
    <p class="small muted" style="max-width:300px;margin-top:8px">Your report is currently under review and may take 12-24 hours. You’ll be notified once we’re done.</p>
    <button class="btn" data-go="/home">Back</button>`,
  mount() {},
});
screens.reports = () => ({
  html: `${topbar("Reports Submitted", { backTo: "/profile" })}<div class="stack">${S.reports.length ? S.reports.slice().reverse().map((r) => { const l = LISTINGS.find((x) => x.id === r.listing); return `<div class="item" style="grid-template-columns:1fr"><div><b>${esc(r.issue)}${l ? ` · ${esc(l.title)}, ${esc(l.area)}` : ""}</b><small>${new Date(r.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · ${r.photos} photo${r.photos === 1 ? "" : "s"}</small><p class="small" style="margin-top:6px">${esc(r.text)}</p><div class="row2"><span class="tag amber">Under review</span></div></div></div>`; }).join("") : emptyState("flag", "No reports yet", "If something looks suspicious, use Report Scam on a listing.")}</div>`,
  mount() {},
});

/* ----- chats ----- */
screens.chats = () => {
  const list = CONTACTS.filter((c) => !S.blocked.includes(c.id));
  return {
    cls: "has-nav", nav: "/chats",
    html: `<header class="topbar"><div></div><h2>Messages</h2><div></div></header>
      ${list.length ? list.map((c) => { const l = LISTINGS.find((x) => x.id === c.listing), u = S.unread[c.id], msgs = S.chats[c.id], last = msgs?.[msgs.length - 1];
        return `<button class="thread" data-go="/chat/${c.id}">${avatar(c.name, `assets/avatars/${c.id}.jpg`)}<b>${esc(c.name)}</b><span class="time">${last && msgs.length > 3 ? last.at : c.when}</span><span class="sub2">${esc(l.title)}. ${esc(l.area.split(",")[0])}${u ? `<br><span class="typing">typing....</span>` : ""}</span>${u ? `<span class="unread">${u}</span>` : "<span></span>"}</button>`; }).join("") : emptyState("chat", "No conversations", "Chat with a landlord from any listing.")}`,
    mount(root) { hydrate(root); },
  };
};

const AUTOREPLY = (t, l) => {
  t = t.toLowerCase();
  if (/inspect|visit|see (it|the)|book/.test(t)) return "Sure! Use “Schedule Inspection” in the menu above to pick a date and time that works for you.";
  if (/price|rent|cost|how much|negotiat/.test(t)) return `The rent is ${money(l.price)} per year, as listed.`;
  if (/water|light|power|electric|wifi|wi-fi|security/.test(t)) return "Yes, utilities are reliable here. You can check the Area Insights on the listing, and you’re welcome to confirm everything when you inspect.";
  if (/available|still/.test(t)) return "Yes, it’s still available.";
  return "Thanks for your message. I’ll get back to you shortly.";
};
screens.chat = (cid) => {
  const c = CONTACTS.find((x) => x.id === cid) || { id: cid, name: "Landlord", listing: +String(cid).replace(/\D/g, "") || 1 };
  const l = LISTINGS.find((x) => x.id === c.listing) || LISTINGS[0];
  if (!S.chats[c.id]) S.chats[c.id] = [{ f: "me", t: "Hello, I’m interested in this property.", at: clock() }];
  delete S.unread[c.id]; save();
  const bubble = (m) => `<div class="bubble ${m.f}">${esc(m.t)}<small>${esc(m.at)}</small></div>`;
  return {
    cls: "chat",
    html: `<div class="chat-head"><button class="icon-btn" data-back="/chats" aria-label="Back" style="margin-left:-10px">${ic("back")}</button>${avatar(c.name, `assets/avatars/${c.id}.jpg`)}<div class="grow"><b>${esc(c.name)}</b><small>Online</small></div><button class="icon-btn" data-menu aria-label="More options" aria-haspopup="menu">${ic("more", "", 3)}</button></div>
      <div class="mini"><div class="card" role="button" tabindex="0" data-go="/listing/${l.id}" style="grid-template-columns:104px 1fr;min-height:84px">${photo(`assets/p${l.id}-1.jpg`, houseSVG(l.id))}<div class="meta" style="padding-right:52px"><b>${esc(l.title)}</b><span class="loc">${esc(l.area)}</span><span class="price">${money(l.price)}<small>/year</small></span><span class="match">${l.match}%</span></div></div></div>
      <div class="msgs" data-msgs>${S.chats[c.id].map(bubble).join("")}</div>
      <form class="composer" data-form><button type="button" class="icon-btn" data-sticker aria-label="Emoji">${ic("smile", "", 1.6)}</button><input name="m" autocomplete="off" placeholder="Type a message..." aria-label="Type a message" /><button type="button" class="icon-btn" data-attach aria-label="Attach">${ic("clip", "", 1.6)}</button><button class="send" aria-label="Send">${ic("send", "", 2)}</button></form>`,
    mount(root) {
      hydrate(root);
      const box = $("[data-msgs]", root), form = $("[data-form]", root), inp = $("input[name=m]", root);
      const bottom = () => (box.scrollTop = box.scrollHeight);
      const add = (m, persist = true) => { if (persist) { S.chats[c.id].push(m); save(); } box.insertAdjacentHTML("beforeend", bubble(m)); bottom(); };
      bottom();
      let t1, t2;
      cleanups.push(() => { clearTimeout(t1); clearTimeout(t2); });
      form.addEventListener("submit", (e) => {
        e.preventDefault(); const t = inp.value.trim(); if (!t) return;
        inp.value = ""; add({ f: "me", t, at: clock() });
        if (/pay|transfer|account number|deposit/.test(t.toLowerCase())) box.insertAdjacentHTML("beforeend", `<div class="small muted" style="text-align:center;padding:6px 16px;background:var(--s2);border-radius:12px">🛡️ Tip: never pay before you’ve inspected the property.</div>`);
        const typing = document.createElement("div"); typing.className = "bubble them typing"; typing.innerHTML = "<i></i><i></i><i></i>";
        t1 = setTimeout(() => { box.append(typing); bottom(); }, 500);
        t2 = setTimeout(() => { typing.remove(); add({ f: "them", t: AUTOREPLY(t, l), at: clock() }); }, 1800);
      });
      $("[data-sticker]", root).onclick = () => { inp.value += "👍"; inp.focus(); };
      $("[data-attach]", root).onclick = () => toast("Attachments are coming soon");
      $("[data-menu]", root).onclick = (e) => {
        e.stopPropagation(); if ($(".menu", root)) return $(".menu", root).remove();
        const m = document.createElement("div"); m.className = "menu"; m.setAttribute("role", "menu");
        m.innerHTML = ["View Property", "Schedule Inspection", "Report User", "Block User"].map((t, i) => `<button role="menuitem" data-m="${i}">${t}</button>`).join("");
        root.append(m);
        const off = () => { m.remove(); document.removeEventListener("click", off); };
        setTimeout(() => document.addEventListener("click", off), 0);
        cleanups.push(() => document.removeEventListener("click", off));
        m.onclick = (ev) => {
          const i = ev.target.dataset.m; if (i === undefined) return; m.remove();
          if (i === "0") go("/listing/" + l.id);
          else if (i === "1") go("/book/" + l.id);
          else if (i === "2") go("/report/" + l.id);
          else confirmBox(`Block ${c.name}?`, "You won’t see this conversation any more. You can reset blocked users in Settings.", "Block", () => { S.blocked.push(c.id); save(); toast(`${c.name} blocked`); go("/chats", true); });
        };
      };
    },
  };
};

/* ----- profile & friends ----- */
screens.profile = () => {
  const rows = [["book", "My Bookings", "/bookings"], ["bookmark", "Saved Listings", "/saved"], ["history", "Inspection History", "/history"], ["flag", "Reports Submitted", "/reports"], ["help", "Help & Support", "/help"], ["settings", "Settings", "/settings"]];
  const roleName = { student: "Student", landlord: "Landlord", agent: "Agent" }[S.role] || "Student";
  return {
    cls: "has-nav", nav: "/profile",
    html: `<div class="profile-head"><button class="icon-btn" data-back="/home" aria-label="Back" style="margin-left:-10px">${ic("back")}</button><div class="grow"><h2>${esc(S.user.name)} ${BADGE}</h2><p class="muted">${roleName}</p></div>${avatar(S.user.name, "assets/avatars/me.jpg")}</div>
      <div class="rows">${rows.map(([i, t, p]) => `<button class="row" data-go="${p}">${ic(i, "", 1.4)}<span>${t}</span>${ic("chev", "chev", 2)}</button>`).join("")}</div>
      <button class="logout" data-logout>${ic("logout")} Logout</button>`,
    mount(root) {
      hydrate(root);
      $("[data-logout]", root).onclick = () => confirmBox("Log out?", "You can log back in any time.", "Logout", () => { S.loggedIn = false; save(); go("/signin", true); });
    },
  };
};
screens.help = () => ({
  html: `${topbar("Help & Support", { backTo: "/profile" })}<div class="stack">${FAQ.map(([q, a]) => `<div class="faq"><button aria-expanded="false"><span>${q}</span>${ic("chev")}</button><div>${a}</div></div>`).join("")}
    <button class="btn danger" data-go="/report" style="margin-top:8px">Report a scam</button></div>`,
  mount(root) { $$(".faq button", root).forEach((b) => (b.onclick = () => { const f = b.parentElement, open = f.classList.toggle("open"); b.setAttribute("aria-expanded", open); })); },
});
screens.settings = () => ({
  html: `${topbar("Settings", { backTo: "/profile" })}<div class="pad">
    <div class="field" style="margin:8px 0 16px"><label for="nm">Your name</label><div class="input"><input id="nm" value="${esc(S.user.name)}" maxlength="40" autocomplete="name" /></div></div>
    <div class="set"><div>Notifications<small>Booking reminders and new listings</small></div><button class="switch ${S.settings.notifs ? "on" : ""}" role="switch" aria-checked="${S.settings.notifs}" data-sw="notifs" aria-label="Notifications"></button></div>
    <div class="set"><div>Dark mode<small>Easier on the eyes at night</small></div><button class="switch ${S.settings.dark ? "on" : ""}" role="switch" aria-checked="${S.settings.dark}" data-sw="dark" aria-label="Dark mode"></button></div>
    <div style="margin-top:16px"><div class="small" style="font-weight:500;margin-bottom:8px">I use AwaHome as</div><div class="seg">${ROLES.map((r) => `<button class="chip ${S.role === r.id ? "on" : ""}" data-r="${r.id}">${r.id === "student" ? "Seeker" : r.id === "landlord" ? "Landlord" : "Agent"}</button>`).join("")}</div></div>
    <div class="set" style="margin-top:12px"><div>Blocked users<small>${S.blocked.length} blocked</small></div><button class="link" data-unblock ${S.blocked.length ? "" : "disabled"}>Unblock all</button></div>
    <button class="btn ghost" style="margin-top:20px;color:var(--red)" data-reset>Reset app data</button></div>`,
  mount(root) {
    const nm = $("#nm", root); nm.onchange = () => { const v = nm.value.trim(); if (v.length > 1) { S.user.name = v; save(); toast("Name updated"); } };
    $$("[data-sw]", root).forEach((b) => (b.onclick = () => { const k = b.dataset.sw; S.settings[k] = !S.settings[k]; b.classList.toggle("on", S.settings[k]); b.setAttribute("aria-checked", S.settings[k]); save(); if (k === "dark") applyTheme(); }));
    $$("[data-r]", root).forEach((b) => (b.onclick = () => { S.role = b.dataset.r; save(); $$("[data-r]", root).forEach((x) => x.classList.toggle("on", x === b)); if (S.role !== "student") toast("Landlord & agent tools are coming soon"); }));
    $("[data-unblock]", root).onclick = () => { S.blocked = []; save(); toast("Unblocked everyone"); go("/settings", true); };
    $("[data-reset]", root).onclick = () => confirmBox("Reset all app data?", "This clears bookings, reports, saved listings and chats on this device.", "Reset", () => { S = defaults(); save(); applyTheme(); go("/splash", true); });
  },
});

/* ============================ routing ============================ */
const routes = [
  [/^\/splash$/, "splash"], [/^\/onboarding$/, "onboarding"], [/^\/signin$/, "signin"], [/^\/signup$/, "signup"], [/^\/role$/, "role"],
  [/^\/home$/, "home"], [/^\/listings$/, "listings"], [/^\/listing\/(\d+)$/, "listing"], [/^\/reviews\/(\d+)$/, "reviews"],
  [/^\/book\/(\d+)$/, "book"], [/^\/booked\/(\w+)$/, "booked"], [/^\/bookings$/, "bookings"], [/^\/history$/, "history"],
  [/^\/report\/(\d+)$/, "report"], [/^\/report$/, "report"], [/^\/report\/evidence$/, "evidence"], [/^\/report\/describe$/, "describe"], [/^\/report\/done$/, "reportdone"], [/^\/reports$/, "reports"],
  [/^\/saved$/, "saved"], [/^\/chats$/, "chats"], [/^\/chat\/(\w+)$/, "chat"], [/^\/profile$/, "profile"], [/^\/help$/, "help"], [/^\/settings$/, "settings"],
];
const PUBLIC = ["splash", "onboarding", "signin", "signup", "help"];

function route() {
  closeOverlay();
  cleanups.splice(0).forEach((f) => f());
  let path = location.hash.slice(1) || "";
  if (!path) { path = S.loggedIn ? "/home" : S.onboarded ? "/signin" : "/splash"; history.replaceState(null, "", "#" + path); }
  let name = null, arg = null;
  for (const [re, n] of routes) { const m = path.match(re); if (m) { name = n; arg = m[1]; break; } }
  if (!name) { path = "/home"; name = "home"; history.replaceState(null, "", "#/home"); }
  if (!S.loggedIn && !PUBLIC.includes(name)) { history.replaceState(null, "", "#/signin"); path = "/signin"; name = "signin"; }
  else if (S.loggedIn && !S.role && !["role", "splash", "help"].includes(name)) { history.replaceState(null, "", "#/role"); path = "/role"; name = "role"; }

  const isBack = goingBack || (stack.length > 1 && stack[stack.length - 2] === path);
  if (isBack) stack.pop(); else if (stack[stack.length - 1] !== path) stack.push(path);
  goingBack = false;

  const sc = screens[name](arg);
  const el = document.createElement("div");
  el.className = `screen ${sc.cls || ""} ${isBack ? "back" : ""}`;
  el.innerHTML = sc.html;
  view.replaceChildren(el);
  if (sc.nav) { renderNav(sc.nav); if (!navEl.isConnected) app.append(navEl); } else navEl.remove();
  sc.mount && sc.mount(el);
  hydrate(el);
  el.scrollTop = 0;
  document.title = "AwaHome";
}

document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-go]");
  if (g && app.contains(g)) { e.preventDefault(); go(g.dataset.go); return; }
  const b = e.target.closest("[data-back]");
  if (b && app.contains(b)) { e.preventDefault(); back(b.dataset.back); }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeOverlay();
  if ((e.key === "Enter" || e.key === " ") && e.target.matches?.('[role=button][data-go]')) { e.preventDefault(); go(e.target.dataset.go); }
});
window.addEventListener("hashchange", route);
window.addEventListener("storage", (e) => { if (e.key === KEY) { try { S = Object.assign(defaults(), JSON.parse(e.newValue || "{}")); applyTheme(); } catch {} } });

/* ============================ PWA ============================ */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

route();
})();
