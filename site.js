/* ============================================================
   hotel/site.js — render konten dari content.json + interaksi.
   ES module. Fondasi dari ./shared/.
   ============================================================ */
import {
  waLink,
  loadContent,
  initFaq,
  initMobileNav,
  initCopyButtons,
  setYear,
  esc,
} from "./shared/utils.js";
import { navbarHTML } from "./shared/components/navbar.js";
import { footerHTML } from "./shared/components/footer.js";
import { sectionHeadHTML } from "./shared/components/section-head.js";

/* Cadangan bila content.json gagal dimuat (mis. dibuka tanpa server). */
const FALLBACK = {
  brand: { mark: "S", name: "Samudra Suites", tagline: "Istirahat yang tenang, di tengah kota" },
  nav: {
    cta: { href: "#beranda", label: "Pesan Kamar" },
    links: [
      { href: "#beranda", label: "Beranda" },
      { href: "#kamar", label: "Kamar" },
      { href: "#fasilitas", label: "Fasilitas" },
      { href: "#lokasi", label: "Lokasi" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  hero: {
    badge: "Hotel bintang 3 · Bandung",
    checkNote: "Isi tanggal, kami balas dengan kamar yang tersedia.",
    checkTitle: "Cek ketersediaan kamar",
    guestUnit: "orang",
    labelCheckin: "Check-in",
    labelCheckout: "Check-out",
    labelGuests: "Jumlah tamu",
    submitLabel: "Cek Ketersediaan",
    subtitle:
      "Samudra Suites menawarkan kamar luas, kasur empuk, dan pelayanan ramah untuk liburan maupun perjalanan bisnis Anda. Cek tanggal, pilih kamar, pesan lewat WhatsApp dalam hitungan menit.",
    title: "Bangun pagi dengan tenang, mulai hari dengan nyaman",
  },
  rooms: {
    bookLabel: "Pesan tipe ini",
    desc: "Semua kamar dilengkapi AC, WiFi cepat, dan air hangat. Pilih yang paling pas dengan kebutuhan Anda.",
    eyebrow: "KAMAR",
    from: "mulai dari",
    index: "01",
    items: [
      {
        capacity: "2 tamu · 1 tempat tidur queen",
        features: ["AC individual", "WiFi 50 Mbps", "Smart TV 43 inci", "Kamar mandi shower air hangat", "Kopi & teh gratis", "Brankas kamar"],
        name: "Kamar Deluxe",
        price: "Rp450.000",
        size: "24 m²",
      },
      {
        capacity: "2–3 tamu · 1 tempat tidur king",
        features: ["Semua fasilitas Deluxe", "Bathtub", "Meja kerja & kursi ergonomis", "Minibar", "Sarapan untuk 2 orang", "Balkon pribadi"],
        name: "Kamar Executive",
        price: "Rp725.000",
        size: "36 m²",
      },
      {
        capacity: "4 tamu · 2 kamar tidur",
        features: ["Semua fasilitas Executive", "Ruang tamu terpisah", "Balkon luas menghadap kota", "Sarapan untuk 4 orang", "Check-in prioritas", "Antar-jemput bandara 1x"],
        name: "Suite Samudra",
        price: "Rp1.250.000",
        size: "54 m²",
      },
    ],
    perNight: "/ malam",
    title: "Tiga tipe kamar, satu kenyamanan",
  },
  facilities: {
    desc: "Fasilitas kami dirancang supaya Anda betah: santai, bekerja, atau sekadar melepas lelah.",
    eyebrow: "FASILITAS",
    index: "02",
    items: [
      { desc: "Kolam outdoor di lantai 3, buka 07.00–21.00.", icon: "pool", name: "Kolam Renang" },
      { desc: "Internet 100 Mbps di seluruh area hotel.", icon: "wifi", name: "WiFi Cepat" },
      { desc: "Masakan Indonesia & barat, buka 06.30–22.00.", icon: "restaurant", name: "Restoran" },
      { desc: "Area parkir aman untuk 60 mobil.", icon: "parking", name: "Parkir Luas" },
      { desc: "Tim kami siap membantu kapan pun.", icon: "reception", name: "Resepsionis 24 Jam" },
      { desc: "Layanan shuttle ke Bandara Husein Sastranegara.", icon: "shuttle", name: "Antar-Jemput Bandara" },
      { desc: "Treadmill, sepeda statis, dan beban ringan.", icon: "gym", name: "Pusat Kebugaran" },
      { desc: "Kapasitas 20 orang, cocok untuk acara kantor.", icon: "meeting", name: "Ruang Rapat" },
    ],
    title: "Semua yang Anda butuhkan, tanpa repot",
  },
  location: {
    desc: "Lokasi strategis di pusat kota Bandung. Berikut perkiraan waktu tempuh dari hotel kami.",
    disclaimer: "Waktu tempuh adalah perkiraan pada kondisi lalu lintas normal.",
    eyebrow: "LOKASI",
    index: "03",
    places: [
      { name: "Bandara Husein Sastranegara", time: "± 15 menit berkendara" },
      { name: "Stasiun Bandung", time: "± 10 menit berkendara" },
      { name: "Gedung Sate", time: "± 12 menit berkendara" },
      { name: "Jalan Asia-Afrika", time: "± 10 menit berkendara" },
      { name: "Trans Studio Bandung", time: "± 20 menit berkendara" },
      { name: "Kawah Putih, Ciwidey", time: "± 90 menit berkendara" },
    ],
    title: "Dekat ke mana-mana",
  },
  testimonials: {
    eyebrow: "TESTIMONI",
    index: "04",
    items: [
      { detail: "Tamu bisnis · menginap 2 malam", name: "Ratna W.", quote: "Kamarnya bersih dan luas. Kasurnya nyaman sekali, saya tidur nyenyak dua malam. Stafnya juga ramah." },
      { detail: "Liburan keluarga · menginap 3 malam", name: "Budi H.", quote: "Sarapannya enak, anak-anak suka kolam renangnya. Lokasinya dekat ke mana-mana, jadi hemat waktu jalan-jalan." },
      { detail: "Tamu korporat · menginap 1 malam", name: "Sari P.", quote: "WiFi kencang, meja kerja nyaman, dan ruang rapatnya membantu acara kantor kami. Pasti kembali lagi." },
    ],
    title: "Kata tamu kami",
  },
  faq: {
    eyebrow: "FAQ",
    index: "05",
    items: [
      { a: "Check-in mulai pukul 14.00 dan check-out sampai pukul 12.00. Butuh waktu berbeda? Hubungi kami, kami usahakan membantu selama kamar tersedia.", q: "Jam berapa check-in dan check-out?" },
      { a: "Tipe Executive dan Suite Samudra sudah termasuk sarapan. Untuk Kamar Deluxe, sarapan bisa ditambah seharga Rp75.000 per orang.", q: "Apakah sarapan sudah termasuk harga kamar?" },
      { a: "Mohon maaf, hewan peliharaan belum diperbolehkan di area hotel demi kenyamanan semua tamu.", q: "Apakah hewan peliharaan diperbolehkan?" },
      { a: "Pembatalan gratis sampai H-2 sebelum tanggal check-in. Pembatalan di bawah H-2 dikenakan biaya satu malam pertama.", q: "Bagaimana kebijakan pembatalan?" },
      { a: "Area parkir kami menampung mobil pribadi hingga minibus. Untuk bus besar, hubungi kami dulu agar kami siapkan tempatnya.", q: "Apakah tersedia parkir untuk kendaraan besar?" },
    ],
    title: "Pertanyaan yang sering ditanyakan",
  },
  contact: {
    address: "Jl. Pangrango No. 21, Bandung, Jawa Barat 40115",
    desc: "Resepsionis kami buka 24 jam. Untuk reservasi tercepat, kirim pesan WhatsApp.",
    eyebrow: "KONTAK & LOKASI",
    hours: "Resepsionis buka 24 jam setiap hari",
    index: "06",
    mapsLabel: "Buka di Google Maps",
    mapsQuery: "Samudra Suites Bandung",
    phoneDisplay: "(022) 123-4567",
    title: "Hubungi kami kapan saja",
    whatsappLabel: "Chat WhatsApp",
    whatsappNumber: "6281234567890",
  },
  footer: {
    note: "TODO: ganti nomor WhatsApp 6281234567890 dengan nomor asli hotel sebelum dipublikasikan.",
    socials: [
      { href: "https://instagram.com/", label: "Instagram" },
      { href: "https://facebook.com/", label: "Facebook" },
      { href: "https://tiktok.com/", label: "TikTok" },
    ],
  },
  jsonld: { checkinTime: "14:00", checkoutTime: "12:00", priceRange: "Rp450.000 - Rp1.250.000" },
};

/* Ikon SVG inline (stroke) untuk fasilitas — dekoratif, disembunyikan dari AT. */
const ICONS = {
  pool: '<path d="M2 15c2 0 2-1.6 4-1.6s2 1.6 4 1.6 2-1.6 4-1.6 2 1.6 4 1.6 2-1.6 4-1.6"/><path d="M2 20c2 0 2-1.6 4-1.6s2 1.6 4 1.6 2-1.6 4-1.6 2 1.6 4 1.6 2-1.6 4-1.6"/><path d="M7 9V5a2 2 0 1 1 4 0"/>',
  wifi: '<path d="M4 11a11 11 0 0 1 16 0"/><path d="M7.5 14.5a6.5 6.5 0 0 1 9 0"/><circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none"/>',
  restaurant: '<path d="M6 2v7a3 3 0 0 0 6 0V2"/><path d="M9 2v20"/><path d="M17 2c-2 1.5-3 4.5-3 8h3v12h1.5V10H21c0-3.5-1.5-6.5-4-8z"/>',
  parking: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9.5 17V7.5h3.5a3.25 3.25 0 0 1 0 6.5H9.5"/>',
  reception: '<path d="M3 18h18"/><path d="M5.5 18a6.5 6.5 0 0 1 13 0"/><path d="M12 11.5V7"/><circle cx="12" cy="5" r="1.6"/>',
  shuttle: '<rect x="3" y="4" width="18" height="11" rx="2.5"/><path d="M3 10h18"/><circle cx="7.5" cy="18.5" r="1.8"/><circle cx="16.5" cy="18.5" r="1.8"/>',
  gym: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  meeting: '<path d="M3 8.5h18v4H3z"/><path d="M5.5 12.5V20M18.5 12.5V20"/><path d="M8 4.5h8"/>',
};

const BED_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 18V8"/><path d="M4 12.5h16V18"/><path d="M20 12.5v-1a2 2 0 0 0-2-2h-7v3"/><circle cx="7.5" cy="9" r="1.4"/></svg>';

function iconSVG(key) {
  const paths = ICONS[key] || ICONS.pool;
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
}

function headInto(slotId, titleId, data) {
  const slot = document.getElementById(slotId);
  if (!slot) return;
  slot.innerHTML = sectionHeadHTML(data);
  const h2 = slot.querySelector("h2");
  if (h2) h2.id = titleId;
}

function formatTanggalID(value) {
  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function injectJsonLd(c) {
  const wa = c.contact?.whatsappNumber || "";
  const ld = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: c.brand?.name || "Samudra Suites",
    description: c.hero?.subtitle || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: c.contact?.address || "",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    telephone: wa ? `+${wa}` : "",
    checkinTime: c.jsonld?.checkinTime || "14:00",
    checkoutTime: c.jsonld?.checkoutTime || "12:00",
    priceRange: c.jsonld?.priceRange || "",
    openingHours: "Mo-Su 00:00-23:59",
    amenityFeature: (c.facilities?.items || []).map((f) => ({
      "@type": "LocationFeatureSpecification",
      name: f.name,
    })),
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}

function initBookingForm(c) {
  const form = document.getElementById("booking-form");
  const checkin = document.getElementById("checkin");
  const checkout = document.getElementById("checkout");
  const guests = document.getElementById("guests");
  const error = document.getElementById("booking-error");
  if (!form || !checkin || !checkout || !guests) return;

  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  checkin.min = iso(today);
  checkout.min = iso(tomorrow);
  if (!checkin.value) checkin.value = iso(today);
  if (!checkout.value) checkout.value = iso(tomorrow);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    error.hidden = true;

    const n = parseInt(guests.value, 10);
    if (!checkin.value || !checkout.value) {
      error.textContent = "Pilih tanggal check-in dan check-out dulu.";
      error.hidden = false;
      return;
    }
    if (checkout.value <= checkin.value) {
      error.textContent = "Tanggal check-out harus setelah check-in.";
      error.hidden = false;
      return;
    }
    if (!Number.isFinite(n) || n < 1 || n > 10) {
      error.textContent = "Jumlah tamu harus antara 1 sampai 10 orang.";
      error.hidden = false;
      return;
    }

    const msg =
      `Halo ${c.brand.name}! Saya ingin menanyakan ketersediaan kamar.\n` +
      `Check-in: ${formatTanggalID(checkin.value)}\n` +
      `Check-out: ${formatTanggalID(checkout.value)}\n` +
      `Jumlah tamu: ${n} orang\n\n` +
      `Mohon info kamar yang tersedia. Terima kasih.`;
    window.open(waLink(c.contact.whatsappNumber, msg), "_blank", "noopener");
  });
}

function render(c) {
  const wa = c.contact.whatsappNumber;

  /* Navbar & footer */
  document.getElementById("site-header").innerHTML = navbarHTML({
    brand: c.brand,
    links: c.nav.links,
    cta: c.nav.cta,
  });
  document.getElementById("site-footer").innerHTML = footerHTML({
    brand: c.brand,
    contact: {
      address: c.contact.address,
      hours: c.contact.hours,
      phone: c.contact.phoneDisplay,
    },
    socials: c.footer.socials,
    note: c.footer.note,
  });

  /* Hero */
  document.querySelector("[data-hero-badge]").textContent = c.hero.badge;
  document.querySelector("[data-hero-title]").textContent = c.hero.title;
  document.querySelector("[data-hero-sub]").textContent = c.hero.subtitle;
  document.querySelector("[data-hero-actions]").innerHTML =
    `<a class="btn btn-primary" href="${waLink(wa, `Halo ${c.brand.name}! Saya ingin bertanya tentang reservasi kamar.`)}" target="_blank" rel="noopener noreferrer">Pesan lewat WhatsApp</a>` +
    `<a class="btn btn-outline" href="#kamar">Lihat Tipe Kamar</a>`;
  document.querySelector("[data-check-title]").textContent = c.hero.checkTitle;
  document.querySelector("[data-label-checkin]").textContent = c.hero.labelCheckin;
  document.querySelector("[data-label-checkout]").textContent = c.hero.labelCheckout;
  document.querySelector("[data-label-guests]").textContent = c.hero.labelGuests;
  document.querySelector("[data-guest-unit]").textContent = c.hero.guestUnit;
  document.querySelector("[data-submit-label]").textContent = c.hero.submitLabel;
  document.querySelector("[data-check-note]").textContent = c.hero.checkNote;

  /* Kamar */
  headInto("rooms-head", "rooms-title", {
    index: c.rooms.index,
    eyebrow: c.rooms.eyebrow,
    title: c.rooms.title,
    desc: c.rooms.desc,
  });
  document.getElementById("rooms-grid").innerHTML = c.rooms.items
    .map(
      (r, i) => `
    <article class="room-card${i === 1 ? " room-card-featured" : ""}">
      <div class="room-visual" aria-hidden="true">${BED_ICON}</div>
      <h3 class="room-name">${esc(r.name)}</h3>
      <div class="room-meta"><span>${esc(r.size)}</span><span>${esc(r.capacity)}</span></div>
      <p class="room-price">${esc(c.rooms.from)} <strong>${esc(r.price)}<span style="font-size:1rem;font-weight:400">${esc(c.rooms.perNight)}</span></strong></p>
      <ul class="room-features">${r.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <a class="btn btn-primary" href="${waLink(wa, `Halo ${c.brand.name}! Saya tertarik dengan ${r.name} (${r.price}${c.rooms.perNight}). Mohon info ketersediaan.`)}" target="_blank" rel="noopener noreferrer">${esc(c.rooms.bookLabel)}</a>
    </article>`
    )
    .join("");

  /* Fasilitas */
  headInto("facilities-head", "facilities-title", {
    index: c.facilities.index,
    eyebrow: c.facilities.eyebrow,
    title: c.facilities.title,
    desc: c.facilities.desc,
  });
  document.getElementById("facilities-grid").innerHTML = c.facilities.items
    .map(
      (f) => `
    <article class="facility-card">
      <span class="facility-icon" aria-hidden="true">${iconSVG(f.icon)}</span>
      <h3>${esc(f.name)}</h3>
      <p>${esc(f.desc)}</p>
    </article>`
    )
    .join("");

  /* Lokasi */
  headInto("location-head", "location-title", {
    index: c.location.index,
    eyebrow: c.location.eyebrow,
    title: c.location.title,
    desc: c.location.desc,
  });
  document.getElementById("location-list").innerHTML = c.location.places
    .map((p) => `<li><strong>${esc(p.name)}</strong><span>${esc(p.time)}</span></li>`)
    .join("");
  document.getElementById("location-disclaimer").textContent = c.location.disclaimer;

  /* Testimoni */
  headInto("testimonials-head", "testimonials-title", {
    index: c.testimonials.index,
    eyebrow: c.testimonials.eyebrow,
    title: c.testimonials.title,
  });
  document.getElementById("testimonials-grid").innerHTML = c.testimonials.items
    .map(
      (t) => `
    <article class="testimonial-card">
      <blockquote class="testimonial-quote">${esc(t.quote)}</blockquote>
      <div class="testimonial-meta">
        <p class="testimonial-name">${esc(t.name)}</p>
        <p class="testimonial-detail">${esc(t.detail)}</p>
      </div>
    </article>`
    )
    .join("");

  /* FAQ */
  headInto("faq-head", "faq-title", {
    index: c.faq.index,
    eyebrow: c.faq.eyebrow,
    title: c.faq.title,
  });
  document.getElementById("faq-list").innerHTML = c.faq.items
    .map(
      (f) => `
    <div class="faq-item" data-faq-item>
      <button type="button" data-faq-q><span>${esc(f.q)}</span><span class="faq-sign" aria-hidden="true">+</span></button>
      <div class="faq-answer" data-faq-a><p>${esc(f.a)}</p></div>
    </div>`
    )
    .join("");

  /* Kontak */
  headInto("contact-head", "contact-title", {
    index: c.contact.index,
    eyebrow: c.contact.eyebrow,
    title: c.contact.title,
  });
  document.getElementById("contact-desc").textContent = c.contact.desc;
  document.getElementById("contact-address").innerHTML =
    `<span>${esc(c.contact.address)}</span>` +
    `<span>${esc(c.contact.hours)}</span>` +
    `<a href="tel:${c.contact.phoneDisplay.replace(/\D/g, "")}">${esc(c.contact.phoneDisplay)}</a>`;
  document.getElementById("contact-actions").innerHTML =
    `<a class="btn btn-primary" href="${waLink(wa, `Halo ${c.brand.name}! Saya ingin bertanya tentang reservasi kamar.`)}" target="_blank" rel="noopener noreferrer">${esc(c.contact.whatsappLabel)}</a>` +
    `<a class="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.contact.mapsQuery)}" target="_blank" rel="noopener noreferrer">${esc(c.contact.mapsLabel)}</a>`;

  injectJsonLd(c);
}

async function main() {
  const notice = document.getElementById("content-notice");
  const content = await loadContent("content.json", FALLBACK, notice);
  render(content);
  initMobileNav();
  initFaq();
  initCopyButtons();
  setYear();
  initBookingForm(content);
}

main();
