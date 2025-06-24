function run() {
    function initializeCanvas() {
        const style = getComputedStyle(canvas);
        const cssWidth = parseFloat(style.width);
        const cssHeight = parseFloat(style.height);
        canvas.width = cssWidth;
        canvas.height = cssHeight;
    }

    function drawArena() {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 240, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    function drawPlayerOne() {
        console.log(canvas.height)
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2 - 7, 240, 1.309, 1.8326); // x, y, radius, 75deg, 105deg
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'green';
        ctx.stroke();
    }

    function gameLoop(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        requestAnimationFrame(() => gameLoop(ctx));
    }

    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    initializeCanvas();
    drawArena();
    drawPlayerOne();

    // gameLoop(ctx);
}

run();
