import { Player, GameState, Arena } from './models';

function run() {
    function initializeCanvas() {
        const style = getComputedStyle(canvas);
        const cssWidth = parseFloat(style.width);
        const cssHeight = parseFloat(style.height);
        canvas.width = cssWidth;
        canvas.height = cssHeight;
    }

    function arena(): Arena {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 240;

        const draw = () => {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
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
            // need to move x and y in a way that is consistent with circle boundaries
            startAngle += updateDelta * direction;
            endAngle = startAngle + angleDelta;
        }

        // TODO: when you switch directions quickly direction is getting set to 0 briefly due to keyup event which is causing stutter of movement 
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {
                direction = -1;
            } else if (e.key === 'ArrowLeft') {
                direction = 1;
            }
        });
        document.addEventListener('keyup', function (e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
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
