const OSM = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap" });
const ESRI = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Esri" });
const TOWNS = [
  { id: "stalbert", name: "St. Albert", center: [53.6306, -113.6254], zoom: 15, streets: [
    { name: "Boudreau Road", line: [[53.6332, -113.632], [53.6330, -113.618]] },
    { name: "McKenney Avenue", line: [[53.6288, -113.632], [53.6286, -113.618]] },
    { name: "Sir Winston Churchill Ave", line: [[53.6355, -113.626], [53.6260, -113.625]] },
    { name: "Poirier Avenue", line: [[53.6312, -113.632], [53.6310, -113.618]] }
  ]},
  { id: "edmonton", name: "Edmonton", center: [53.6308, -113.401], zoom: 15, streets: [
    { name: "Hollick-Kenyon Road", line: [[53.633, -113.408], [53.633, -113.394]] },
    { name: "50 Street", line: [[53.636, -113.401], [53.626, -113.401]] },
    { name: "153 Avenue", line: [[53.6365, -113.408], [53.6365, -113.394]] },
    { name: "144 Avenue", line: [[53.6275, -113.408], [53.6275, -113.394]] }
  ]},
  { id: "calgary", name: "Calgary", center: [51.0915, -114.148], zoom: 15, streets: [
    { name: "Varsity Drive", line: [[51.0935, -114.156], [51.0935, -114.140]] },
    { name: "40 Avenue NW", line: [[51.0892, -114.156], [51.0892, -114.140]] },
    { name: "19 Street NW", line: [[51.096, -114.148], [51.086, -114.148]] }
  ]}
];
const KEY = "curb-claim.walk.collected.v1";
function loadDone() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } }
function saveDone(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
const done = loadDone();
const selected = new Set();
let town = TOWNS[0], layers = [], drawing = false, boxStart = null, boxRect = null;
const map = L.map("map", { preferCanvas: true });
OSM.addTo(map);
OSM.on("tileerror", () => { if (!map.hasLayer(ESRI)) ESRI.addTo(map); });
function sid(street) { return town.id + ":" + street.name; }
function styleFor(street) {
  const key = sid(street);
  if (done[key]) return { color: "#c45c2a", weight: 10, opacity: 0.85 };
  if (selected.has(key)) return { color: "#1a7a58", weight: 10, opacity: 0.9 };
  return { color: "#8fb9a6", weight: 8, opacity: 0.7 };
}
function paint() {
  layers.forEach((l) => map.removeLayer(l)); layers = [];
  town.streets.forEach((street) => {
    const line = L.polyline(street.line, styleFor(street));
    line.addTo(map);
    line.on("click", (e) => {
      L.DomEvent.stop(e); if (drawing) return;
      const key = sid(street); if (done[key]) return;
      if (selected.has(key)) selected.delete(key); else selected.add(key);
      paint();
    });
    layers.push(line);
  });
  status();
}
function status() {
  const n = selected.size;
  document.getElementById("collectBtn").disabled = n === 0;
  const msg = document.getElementById("msg");
  if (drawing) msg.textContent = "Drag a box over the streets you walked.";
  else if (n) msg.textContent = n + " street" + (n === 1 ? "" : "s") + " selected.";
  else msg.textContent = "Tap streets or Draw box, then I picked these up.";
}
function goTown(t) {
  town = t; selected.clear(); map.setView(t.center, t.zoom); paint();
  [...document.querySelectorAll(".towns button")].forEach((b) => b.classList.toggle("on", b.dataset.id === t.id));
}
document.getElementById("towns");
TOWNS.forEach((t) => {
  const b = document.createElement("button"); b.type = "button"; b.dataset.id = t.id; b.textContent = t.name;
  b.onclick = () => goTown(t); document.getElementById("towns").appendChild(b);
});
document.getElementById("collectBtn").onclick = () => {
  selected.forEach((key) => { done[key] = Date.now(); }); saveDone(done); selected.clear(); paint();
};
document.getElementById("drawBtn").onclick = () => {
  drawing = !drawing;
  document.getElementById("drawBtn").textContent = drawing ? "Cancel box" : "Draw box";
  map.dragging[drawing ? "disable" : "enable"](); status();
};
map.on("mousedown", (e) => {
  if (!drawing) return; boxStart = e.latlng;
  if (boxRect) map.removeLayer(boxRect);
  boxRect = L.rectangle([boxStart, boxStart], { color: "#146348", weight: 2, dashArray: "4 3", fillOpacity: 0.08 }).addTo(map);
});
map.on("mousemove", (e) => {
  if (!drawing || !boxStart || !boxRect) return;
  boxRect.setBounds(L.latLngBounds(boxStart, e.latlng));
});
map.on("mouseup", (e) => {
  if (!drawing || !boxStart) return;
  const bounds = L.latLngBounds(boxStart, e.latlng);
  town.streets.forEach((street) => {
    const key = sid(street); if (done[key]) return;
    if (street.line.some((p) => bounds.contains(p))) selected.add(key);
  });
  boxStart = null; if (boxRect) { map.removeLayer(boxRect); boxRect = null; }
  drawing = false; document.getElementById("drawBtn").textContent = "Draw box"; map.dragging.enable(); paint();
});
goTown(TOWNS[0]);
