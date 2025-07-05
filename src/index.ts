import { Player, GameState, StateOfGame, Arena, GameBall, Coord } from './models';

const lineWidth = 2;

function run() {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    initializeCanvas();
    const gameStateInstance = gameState();
    const arenaInstance = arena();
    const p1 = player(1);
    const p2 = player(2);
    const gameBall = ball();
    gameStateInstance.setState({
        arena: arenaInstance,
        p1,
        p2,
        gameBall,
    });

    p1.draw();
    p2.draw();
    gameBall.draw();
    arenaInstance.draw();

    gameLoop();

    // DECLARATIONS START
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

            // draw movement boundary
            drawLine({ x: cx - radius, y: cy }, { x: cx + radius, y: cy });
        };

        return {
            cx,
            cy,
            radius,
            draw,
        };
    }

    function player(playerNumber: number): Player {
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let direction = 0;
        let isRightDown = false;
        let isLeftDown = false;
        const angleDelta = 0.5;
        const updateDelta = 0.02;

        const degrees75 = 5 * Math.PI / 12;
        const degrees255 = 17 * Math.PI / 12;
        let startAngle = playerNumber == 1 ? degrees75 : degrees255;
        let endAngle = startAngle + angleDelta;

        // draw player
        const draw = function () {
            if (!playerNumber) return;

            const { arena } = gameStateInstance.getState();
            if (playerNumber == 1) {
                ctx.beginPath();
                ctx.arc(x, y, arena.radius - 7, startAngle, endAngle);
                ctx.lineWidth = 6;
                ctx.strokeStyle = '#75a743';
                ctx.stroke();
            }

            if (playerNumber == 2) {
                ctx.beginPath();
                ctx.arc(x, y, arena.radius - 7, startAngle, endAngle);
                ctx.lineWidth = 6;
                ctx.strokeStyle = '#75a743';
                ctx.stroke();
            }
        };

        // update player position
        const updatePosition = function () {
            const nextStartAngle = startAngle + updateDelta * direction;
            const nextEndAngle = startAngle + angleDelta;

            if (playerNumber == 1) {
                if (nextStartAngle <= 0 && direction == -1) return;
                if (nextEndAngle >= Math.PI && direction == 1) return;
                if (direction == 0) return;
            }

            if (playerNumber == 2) {
                if (nextEndAngle >= 2 * Math.PI && direction == 1) return;
                if (nextStartAngle <= Math.PI && direction == -1) return;
                if (direction == 0) return;
            }

            startAngle = nextStartAngle;
            endAngle = nextEndAngle;
        }

        document.addEventListener('keydown', function (e) {
            if (playerNumber == 1) {
                if (e.key === 'ArrowRight') {
                    direction = -1;
                    isRightDown = true;
                } else if (e.key === 'ArrowLeft') {
                    direction = 1;
                    isLeftDown = true;
                }
            }

            if (playerNumber == 2) {
                if (e.key === 'd') {
                    direction = 1;
                    isRightDown = true;
                } else if (e.key === 'a') {
                    direction = -1;
                    isLeftDown = true;
                }
            }
        });
        document.addEventListener('keyup', function (e) {
            if (playerNumber == 1) {
                if (e.key === 'ArrowRight') {
                    isRightDown = false;
                    if (isLeftDown) return;
                    direction = 0;
                } else if (e.key === 'ArrowLeft') {
                    isLeftDown = false;
                    if (isRightDown) return;
                    direction = 0;
                }
            }

            if (playerNumber == 2) {
                if (e.key === 'd') {
                    isRightDown = false;
                    if (isLeftDown) return;
                    direction = 0;
                } else if (e.key === 'a') {
                    isLeftDown = false;
                    if (isRightDown) return;
                    direction = 0;
                }
            }
        })

        return {
            x,
            y,
            draw,
            updatePosition,
        };
    }

    function ball() {
        const defaultRadius = 10;

        function draw() {
            const { p1, p2 } = gameStateInstance.getState();
            const x = p1.x;
            const y = p1.y;

            ctx.beginPath();
            ctx.arc(x, y, defaultRadius, 0, Math.PI * 2);
            ctx.lineWidth = 6;
            // ctx.strokeStyle = '#25562e';
            ctx.strokeStyle = 'red';
            ctx.fill();
            ctx.stroke();
        }

        return {
            draw,
        }
    }

    function gameState() {
        let currentState: StateOfGame;

        function setState(state: StateOfGame) {
            currentState = state;
        }

        function getState() {
            return currentState;
        }

        return {
            setState,
            getState,
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // const arenaInstance = arena();
        // const { p1, p2, gameBall } = gameStateInstance.getState();
        arenaInstance.draw();
        p1.draw();
        p1.updatePosition();
        p2.draw();
        p2.updatePosition();
        gameBall.draw();

        requestAnimationFrame(gameLoop);
    }
}

run();
