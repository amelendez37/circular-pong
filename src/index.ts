function gameLoop(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    requestAnimationFrame(() => gameLoop(ctx));
}

function run() {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    // gives us methods to draw within our 2d canvas element
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Begin a new path
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke(); // Outline the circle

    // gameLoop(ctx);
}

run();
