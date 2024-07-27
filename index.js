// Get elements
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const penSelect = document.getElementById('brushes');
const colorButtons = document.querySelectorAll('.color');
const clearButton = document.getElementById('clearCanvas');
const saveButton = document.getElementById('saveCanvas');
const eraserButton = document.getElementById('eraser');

// Default settings
let currentColor = 'black';
let currentLineWidth = 2; // Default line width
let drawing = false;
let isEraser = false;

// Load canvas state from localStorage on startup
window.onload = loadFromLocalStorage;

// Function to handle pen type change
penSelect.addEventListener('change', (e) => {
    isEraser = false; // Reset eraser when changing pen
    const penType = e.target.value;
    switch (penType) {
        case 'Pen':
            currentLineWidth = 1;
            break;
        case 'Pencil':
            currentLineWidth = 2;
            break;
        case 'Marker':
            currentLineWidth = 5;
            break;
        case 'fill':
            currentLineWidth = 10; // Example for a fill brush
            break;
        default:
            currentLineWidth = 2;
    }
    console.log('Selected pen:', penType, 'with line width:', currentLineWidth);
});

// Function to handle color change
colorButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        currentColor = e.target.style.backgroundColor;
        console.log('Selected color:', currentColor);
        isEraser = false;
    });
});

// Function to start drawing
function startDrawing(x, y) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Function to draw on the canvas
function draw(x, y) {
    if (drawing) {
        ctx.strokeStyle = isEraser ? 'white' : currentColor;
        ctx.lineWidth = currentLineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

// Function to stop drawing
function stopDrawing() {
    drawing = false;
    ctx.closePath();
    saveToLocalStorage(); // Save state after drawing
}

// Mouse events
canvas.addEventListener('mousedown', (e) => startDrawing(e.offsetX, e.offsetY));
canvas.addEventListener('mousemove', (e) => draw(e.offsetX, e.offsetY));
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
});

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Function to clear the canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToLocalStorage(); // Save cleared state
});

// Function to save the canvas to local storage
function saveToLocalStorage() {
    localStorage.setItem('canvasState', canvas.toDataURL());
    console.log('Canvas saved to local storage.');
}

// Function to load the canvas from local storage
function loadFromLocalStorage() {
    const savedState = localStorage.getItem('canvasState');
    if (savedState) {
        const image = new Image();
        image.src = savedState;
        image.onload = function () {
            ctx.drawImage(image, 0, 0);
        };
        console.log('Canvas loaded from local storage.');
    }
}

// Function to use the eraser
eraserButton.addEventListener('click', () => {
    isEraser = true;
    console.log('Eraser selected.');
});

// Function to save the canvas as an image file
saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'canvas-image.png';
    link.href = canvas.toDataURL();
    link.click();
    console.log('Canvas saved as an image.');
});
