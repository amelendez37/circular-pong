import { Player, GameState, Arena, Coord } from './models';

const lineWidth = 2;

function run() {
    function initializeCanvas() {
        const style = getComputedStyle(canvas);
        const cssWidth = parseFloat(style.width);
        const cssHeight = parseFloat(style.height);
        canvas.width = cssWidth;
        canvas.height = cssHeight;
    }

    function drawLine(from: Coord, to: Coord) {
        ctx.beginPath();
        ctx.moveTo(from.x, to.y);
        ctx.lineTo(to.x, to.y);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    function arena(): Arena {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 240;

        const draw = () => {
            // draw arena circle
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = 'black';
            ctx.stroke();

            // draw movement boundaries
            // todo: fix these boundary lines
            drawLine({ x: cx + radius - 7, y: cy }, { x: cx + radius + 7, y: cy });
            drawLine({ x: cx - radius - 7, y: cy }, { x: cx - radius + 7, y: cy });
        };

        return {
            cx,
            cy,
            radius,
            draw,
        };
    }

    function player(initialX: number, initialY: number): Player {
        let x = initialX;
        let y = initialY;
        let direction = 0;
        let isRightDown = false;
        let isLeftDown = false;
        const angleDelta = 0.5236;
        const updateDelta = 0.0349066;

        let startAngle = 1.309;
        let endAngle = startAngle + angleDelta;

        const draw = function (gameState: GameState) {
            ctx.beginPath();
            ctx.arc(x, y, gameState.arena.radius - 7, startAngle, endAngle); // x, y, radius, 75deg, 105deg
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'green';
            ctx.stroke();
        };

        const updatePosition = function () {
            let updatedEndAngle = startAngle + angleDelta;
            if (startAngle <= 0 && direction == -1) return;
            if (updatedEndAngle >= Math.PI && direction == 1) return;

            startAngle += updateDelta * direction;
            endAngle = updatedEndAngle;
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {
                direction = -1;
                isRightDown = true;
            } else if (e.key === 'ArrowLeft') {
                direction = 1;
                isLeftDown = true;
            }
        });
        document.addEventListener('keyup', function (e) {
            if (e.key === 'ArrowRight') {
                isRightDown = false;
                if (isLeftDown) return;
                direction = 0;
            } else if (e.key === 'ArrowLeft') {
                isLeftDown = false;
                if (isRightDown) return;
                direction = 0;
            }
        })

        return {
            x,
            y,
            draw,
            updatePosition,
        };
    }

    function gameState(arena: any, p1: Player) {
        return {
            arena,
            p1,
        };
    }

    function gameLoop(ctx: CanvasRenderingContext2D, gameStateInstance: GameState) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const arenaInstance = arena();
        const { p1 } = gameStateInstance;
        arenaInstance.draw();
        p1.draw(gameStateInstance);
        p1.updatePosition();

        requestAnimationFrame(() => gameLoop(ctx, gameStateInstance));
    }

    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    initializeCanvas();

    const arenaInstance = arena();
    arenaInstance.draw();

    const p1 = player(canvas.width / 2, canvas.height / 2);

    const gameStateInstance = gameState(arenaInstance, p1);
    p1.draw(gameStateInstance);

    gameLoop(ctx, gameStateInstance);
}

run();
