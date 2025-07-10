// Game configuration and setup
const canvas = document.getElementById('bubblesCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreCount');

// Beautiful bubble colors
const colors = ['#f78da7', '#84d9d2', '#fce38a', '#95e1d3'];

// Initialize bubbles in different positions so they don't overlap
const circles = [
    { x: 80, y: 80, radius: 30, color: colors[0], hit: false },
    { x: 80, y: 180, radius: 30, color: colors[1], hit: false },
    { x: 220, y: 100, radius: 35, color: colors[2], hit: false },
    { x: 220, y: 200, radius: 35, color: colors[3], hit: false },
];

// Arrow shooters positioned to aim at bubbles
const arrows = [
  { startX: 520, startY: 80, currentX: 520, speed: 4, active: false },
  { startX: 520, startY: 180, currentX: 520, speed: 4, active: false },
  { startX: 520, startY: 100, currentX: 520, speed: 4, active: false },
  { startX: 520, startY: 200, currentX: 520, speed: 4, active: false }
];

let hoverIndex = -1;
let poppedCount = 0;

// Draw all game elements on the canvas
function draw() {
  // Clear the canvas for fresh drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw each bubble with special effects
  circles.forEach((circle, index) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    
    // Change appearance when bubble is popped
    if (circle.hit) {
      ctx.fillStyle = '#e0e0e0';
      // Add a subtle "X" mark for popped bubbles
      ctx.fill();
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(circle.x - 10, circle.y - 10);
      ctx.lineTo(circle.x + 10, circle.y + 10);
      ctx.moveTo(circle.x + 10, circle.y - 10);
      ctx.lineTo(circle.x - 10, circle.y + 10);
      ctx.stroke();
    } else {
      // Create a gradient effect for active bubbles
      const gradient = ctx.createRadialGradient(circle.x - 8, circle.y - 8, 0, circle.x, circle.y, circle.radius);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, circle.color);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Highlight bubble on hover
    if (hoverIndex === index && !circle.hit) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#333';
      ctx.stroke();
      
      // Add a subtle glow effect
      ctx.shadowColor = circle.color;
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.closePath();
  });

  // Draw arrows with better visual appeal
  arrows.forEach((arrow, index) => {
    if (arrow.active || arrow.currentX < arrow.startX) {
      ctx.beginPath();
      // Draw arrow shaft
      ctx.moveTo(arrow.currentX, arrow.startY);
      ctx.lineTo(arrow.currentX - 20, arrow.startY);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#444';
      ctx.stroke();
      
      // Draw arrowhead
      ctx.beginPath();
      ctx.moveTo(arrow.currentX, arrow.startY);
      ctx.lineTo(arrow.currentX - 12, arrow.startY - 8);
      ctx.lineTo(arrow.currentX - 12, arrow.startY + 8);
      ctx.closePath();
      ctx.fillStyle = '#333';
      ctx.fill();
    }
  });
}

// Animate arrows flying towards bubbles
function animate() {
  let needAnimation = false;

  arrows.forEach((arrow, index) => {
    if (arrow.active && arrow.currentX > circles[index].x + circles[index].radius + 5) {
      arrow.currentX -= arrow.speed;
      needAnimation = true;
    } else if (arrow.active && !circles[index].hit) {
      // Bubble gets popped!
      circles[index].hit = true;
      arrow.active = false;
      poppedCount++;
      updateScore();
      
      // Check if all bubbles are popped
      if (poppedCount === circles.length) {
        setTimeout(() => {
          alert('🎉 Congratulations! You popped all the bubbles! 🎉');
        }, 100);
      }
    }
  });

  draw();

  if (needAnimation) {
    requestAnimationFrame(animate);
  }
}

// Update the score display
function updateScore() {
  scoreElement.textContent = poppedCount;
}

// Handle mouse movement for hover effects
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  hoverIndex = -1;
  canvas.style.cursor = 'default';

  circles.forEach((circle, index) => {
    const dist = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
    if (dist < circle.radius && !circle.hit) {
      hoverIndex = index;
      canvas.style.cursor = 'pointer';
    }
  });

  draw();
});

// Handle clicks to shoot arrows at bubbles
canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  circles.forEach((circle, index) => {
    const dist = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
    if (dist < circle.radius && !circle.hit && !arrows[index].active) {
      arrows[index].active = true;
      animate();
    }
  });
});

// Add keyboard support for accessibility
canvas.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    // Shoot arrow at first available bubble
    const availableBubble = circles.findIndex(circle => !circle.hit);
    if (availableBubble !== -1 && !arrows[availableBubble].active) {
      arrows[availableBubble].active = true;
      animate();
    }
    e.preventDefault();
  } else if (e.key === 'r' || e.key === 'R') {
    resetCanvas();
  }
});

// Reset the game to initial state
function resetCanvas() {
  circles.forEach(circle => circle.hit = false);
  arrows.forEach(arrow => {
    arrow.currentX = arrow.startX;
    arrow.active = false;
  });
  poppedCount = 0;
  updateScore();
  hoverIndex = -1;
  draw();
}

// Initialize the game
function initGame() {
  updateScore();
  draw();
  
  // Add helpful instructions
  console.log('🫧 Bubble Pop Game Controls:');
  console.log('• Click on bubbles to pop them');
  console.log('• Press Enter/Space to shoot first available bubble');
  console.log('• Press R to reset the game');
}

// Start the game
initGame();
