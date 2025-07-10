const canvas = document.getElementById('bubblesCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const bubbleColors = ['#ffb3d9', '#d9b3ff', '#b3d9ff', '#fff5b3'];
const bubbleBorders = ['#ff80cc', '#cc80ff', '#80ccff', '#ffeb80'];

const bubbles = [
    { x: 120, y: 80, size: 35, color: bubbleColors[0], border: bubbleBorders[0], popped: false },
    { x: 120, y: 160, size: 35, color: bubbleColors[1], border: bubbleBorders[1], popped: false },
    { x: 120, y: 240, size: 35, color: bubbleColors[2], border: bubbleBorders[2], popped: false },
    { x: 120, y: 320, size: 35, color: bubbleColors[3], border: bubbleBorders[3], popped: false }
];

const arrows = [
    { startX: 650, y: 80, currentX: 650, moving: false },
    { startX: 650, y: 160, currentX: 650, moving: false },
    { startX: 650, y: 240, currentX: 650, moving: false },
    { startX: 650, y: 320, currentX: 650, moving: false }
];

let hoveredBubble = -1;

function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        
        if (bubble.popped) {
            ctx.fillStyle = '#999999';
        } else {
            ctx.fillStyle = bubble.color;
        }
        ctx.fill();

        if (!bubble.popped) {
            ctx.strokeStyle = bubble.border;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (hoveredBubble === i && !bubble.popped) {
            ctx.fillStyle = bubble.border;
            ctx.fill();
        }
    }

    for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i];
        
        if (arrow.moving) {
            ctx.beginPath();
            ctx.moveTo(arrow.currentX, arrow.y);
            ctx.lineTo(arrow.currentX - 25, arrow.y);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(arrow.currentX - 25, arrow.y);         
            ctx.lineTo(arrow.currentX - 15, arrow.y - 8);    
            ctx.lineTo(arrow.currentX - 15, arrow.y + 8);    
            ctx.fillStyle = '#333';
            ctx.fill();
        }
    }
}

function moveArrows() {
    let somethingIsMoving = false;

    for (let i = 0; i < arrows.length; i++) {
        const arrow = arrows[i];
        const bubble = bubbles[i];
        
        if (arrow.moving) {
            if (arrow.currentX > bubble.x + bubble.size + 10) {
                arrow.currentX -= 3;
                somethingIsMoving = true;
            } else {
                bubble.popped = true;
                arrow.moving = false;
            }
        }
    }

    drawEverything();

    if (somethingIsMoving) {
        requestAnimationFrame(moveArrows);
    }
}

function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 400 / rect.height;
    
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

canvas.addEventListener('mousemove', function(event) {
    const mousePos = getMousePosition(event);
    hoveredBubble = -1;

    for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        const distance = Math.sqrt((mousePos.x - bubble.x) ** 2 + (mousePos.y - bubble.y) ** 2);
        
        if (distance < bubble.size && !bubble.popped) {
            hoveredBubble = i;
        }
    }

    drawEverything();
});

canvas.addEventListener('click', function(event) {
    const mousePos = getMousePosition(event);

    for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        const arrow = arrows[i];
        const distance = Math.sqrt((mousePos.x - bubble.x) ** 2 + (mousePos.y - bubble.y) ** 2);
        
        if (distance < bubble.size && !bubble.popped && !arrow.moving) {
            arrow.moving = true;
            moveArrows();
        }
    }
});

function resetCanvas() {
    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].popped = false;
    }
    
    for (let i = 0; i < arrows.length; i++) {
        arrows[i].currentX = arrows[i].startX;
        arrows[i].moving = false;
    }
    
    hoveredBubble = -1;
    
    drawEverything();
}

drawEverything();