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

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    currentSlot.push({ x, y });
    redraw();
});

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

function finishSlot() {
    if (currentSlot.length >= 3) {
        slots.push([...currentSlot]);
        currentSlot = [];
        redraw();
    }
}

function undo() {
    currentSlot.pop();
    redraw();
}

function clearAll() {
    slots = [];
    currentSlot = [];
    redraw();
}

function saveSlots() {
    fetch("/save_slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slots)
    }).then(() => alert("Saved!"));
}

// Load on start
fetch("/load_slots")
    .then(r => r.json())
    .then(data => {
        slots = data;
        redraw();
    });
