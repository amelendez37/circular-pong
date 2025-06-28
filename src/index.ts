import { Player } from './models';

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

    function player(initialX: number, initialY: number): Player {
        let x = initialX;
        let y = initialY;
        let isMovingLeft = false;
        let isMovingRight = false;

        const draw = function () {
            ctx.beginPath();
            ctx.arc(x, y, 240, 1.309, 1.8326); // x, y, radius, 75deg, 105deg
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'green';
            ctx.stroke();
        };

        const updatePosition = function () {
            // need to move x and y in a way that is consistent with circle boundaries
            if (isMovingLeft) {
                x -= 1;
            } else if (isMovingRight) {
                x += 1;
            }
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {
                isMovingRight = true;
                isMovingLeft = false;
            } else if (e.key === 'ArrowLeft') {
                isMovingLeft = true;
                isMovingRight = false;
            }
        });
        document.addEventListener('keyup', function (e) {
            if (e.key === 'ArrowRight') {
                isMovingRight = false;
            } else if (e.key === 'ArrowLeft') {
                isMovingLeft = false;
            }
        })

        return {
            x,
            y,
            draw,
            updatePosition,
        };
    }

    function gameState(p1: Player) {
        return {
            p1
        };
    }

    function gameLoop(ctx: CanvasRenderingContext2D, gameStateInstance: any) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        drawArena();
        const { p1 } = gameStateInstance;
        p1.draw();
        p1.updatePosition();

        requestAnimationFrame(() => gameLoop(ctx, gameStateInstance));
    }

    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    initializeCanvas();
    drawArena();
    const p1 = player(canvas.width / 2, canvas.height / 2 - 7);
    p1.draw();
    const gameStateInstance = gameState(p1);

    gameLoop(ctx, gameStateInstance);
}

run();
