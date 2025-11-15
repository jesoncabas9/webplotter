// === Firebase database URL ===
const FIREBASE_URL = "https://plotterdata-default-rtdb.asia-southeast1.firebasedatabase.app/slots.json";

let canvas = document.getElementById("drawCanvas");
let ctx = canvas.getContext("2d");
let slots = [];
let currentSlot = [];

function resizeCanvas() {
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;
    redraw();
}

window.addEventListener("resize", resizeCanvas);
video.addEventListener("loadedmetadata", resizeCanvas);

// === Handle clicks to add points ===
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    currentSlot.push({ x, y });
    redraw();
});

// === Draw everything ===
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw saved slots
    slots.forEach(slot => {
        ctx.fillStyle = "rgba(0,255,0,0.3)";
        ctx.strokeStyle = "rgba(0,255,0,1)";
        ctx.lineWidth = 3;

        ctx.beginPath();
        slot.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    // Draw current slot
    if (currentSlot.length > 0) {
        ctx.strokeStyle = "yellow";
        ctx.fillStyle = "red";
        ctx.lineWidth = 2;

        ctx.beginPath();
        currentSlot.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        currentSlot.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
}

// === Finish a polygon ===
function finishSlot() {
    if (currentSlot.length >= 3) {
        slots.push([...currentSlot]);
        currentSlot = [];
        redraw();
    }
}

// === Undo ===
function undo() {
    currentSlot.pop();
    redraw();
}

// === Clear all ===
function clearAll() {
    slots = [];
    currentSlot = [];
    redraw();
}

// === Save to Firebase ===
function saveSlots() {
    // Auto-finish polygon if still drawing
    if (currentSlot.length >= 3) {
        slots.push([...currentSlot]);
        currentSlot = [];
    }

    // Prevent saving nothing
    if (slots.length === 0) {
        alert("No slots to save!");
        return;
    }

    // 🔍 Debug log to verify what is actually being saved
    console.log("Saving slots to Firebase:", JSON.stringify(slots, null, 2));

    fetch(FIREBASE_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slots)
    })
    .then(() => alert("Saved to Firebase!"))
    .catch(err => console.error("Save error:", err));
}

// === Load from Firebase ===
function loadSlots() {
    fetch(FIREBASE_URL)
        .then(res => res.json())
        .then(data => {
            slots = data || [];
            redraw();
        });
}

// === Load on startup ===
loadSlots();


