// Canvas setup with responsive scaling
const canvas = document.getElementById('bubblesCanvas');
const ctx = canvas.getContext('2d');

// Set up canvas for high DPI displays
function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = 800 * dpr;
    canvas.height = 400 * dpr;
    
    canvas.style.width = Math.min(800, window.innerWidth - 40) + 'px';
    canvas.style.height = Math.min(400, (window.innerWidth - 40) * 0.5) + 'px';
    
    ctx.scale(dpr, dpr);
}

// Calculate scale factor for responsive positioning
function getScaleFactor() {
    const displayWidth = parseFloat(canvas.style.width) || 800;
    return displayWidth / 800;
}

setupCanvas();

// Soft pastel bubble colors
const colors = ['#ffb3ba', '#bae1ff', '#ffffba', '#baffc9'];
const borderColors = ['#ff9aaa', '#9ad1ff', '#ffff9a', '#9affb9'];

// Four bigger circles with more spacing
const circles = [
    { x: 120, y: 80, radius: 35, color: colors[0], borderColor: borderColors[0], hit: false },
    { x: 120, y: 160, radius: 35, color: colors[1], borderColor: borderColors[1], hit: false },
    { x: 120, y: 240, radius: 35, color: colors[2], borderColor: borderColors[2], hit: false },
    { x: 120, y: 320, radius: 35, color: colors[3], borderColor: borderColors[3], hit: false }
];

// Simple arrows on the right side
const arrows = [
    { startX: 650, startY: 80, currentX: 650, active: false },
    { startX: 650, startY: 160, currentX: 650, active: false },
    { startX: 650, startY: 240, currentX: 650, active: false },
    { startX: 650, startY: 320, currentX: 650, active: false }
];

let hoverIndex = -1;

// Draw circles and arrows
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw circles with borders
    circles.forEach((circle, index) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.hit ? '#d3d3d3' : circle.color;
        ctx.fill();
        
        // Add border
        ctx.strokeStyle = circle.hit ? '#aaa' : circle.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Simple hover outline
        if (hoverIndex === index && !circle.hit) {
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        ctx.closePath();
    });
    
    // Draw minimal arrows
    arrows.forEach((arrow) => {
        if (arrow.active) {
            ctx.beginPath();
            ctx.moveTo(arrow.currentX, arrow.startY);
            ctx.lineTo(arrow.currentX - 8, arrow.startY - 4);
            ctx.lineTo(arrow.currentX - 8, arrow.startY + 4);
            ctx.closePath();
            ctx.fillStyle = '#555';
            ctx.fill();
        }
    });
}

// Move arrows towards circles
function animate() {
    let animating = false;
    
    arrows.forEach((arrow, index) => {
        if (arrow.active) {
            if (arrow.currentX > circles[index].x + circles[index].radius) {
                arrow.currentX -= 3;
                animating = true;
            } else {
                // Arrow hits circle
                circles[index].hit = true;
                arrow.active = false;
            }
        }
    });
    
    draw();
    
    if (animating) {
        requestAnimationFrame(animate);
    }
}

// Get mouse/touch coordinates relative to canvas
function getEventCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 400 / rect.height;
    
    let clientX, clientY;
    if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// Mouse hover effect
canvas.addEventListener('mousemove', function(e) {
    const coords = getEventCoordinates(e);
    
    hoverIndex = -1;
    
    circles.forEach((circle, index) => {
        const distance = Math.sqrt((coords.x - circle.x) ** 2 + (coords.y - circle.y) ** 2);
        if (distance < circle.radius && !circle.hit) {
            hoverIndex = index;
        }
    });
    
    draw();
});

// Click/touch to shoot arrow
function handleClick(e) {
    e.preventDefault();
    const coords = getEventCoordinates(e);
    
    circles.forEach((circle, index) => {
        const distance = Math.sqrt((coords.x - circle.x) ** 2 + (coords.y - circle.y) ** 2);
        if (distance < circle.radius && !circle.hit && !arrows[index].active) {
            arrows[index].active = true;
            animate();
        }
    });
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('touchstart', handleClick);

// Prevent scrolling on touch
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Reset everything
function resetCanvas() {
    circles.forEach(circle => circle.hit = false);
    arrows.forEach(arrow => {
        arrow.currentX = arrow.startX;
        arrow.active = false;
    });
    hoverIndex = -1;
    draw();
}

// Handle window resize
window.addEventListener('resize', function() {
    setupCanvas();
    draw();
});

// Initialize
draw();
