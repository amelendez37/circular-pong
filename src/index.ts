import { Player, GameState, StateOfGame, Arena, GameBall, Coord, PlayerLocation } from './models';

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
        state: {
            hasServed: false
        },
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
        let cx = canvas.width / 2;
        let cy = canvas.height / 2;
        let direction = 0;
        let isRightDown = false;
        let isLeftDown = false;
        let playerRadius = 0; // to determine where player will actually be on the circle
        const angleDelta = 0.5;
        const updateDelta = 0.02;
        const degrees75 = 5 * Math.PI / 12;
        const degrees255 = 17 * Math.PI / 12;
        const playerLineWidth = 6;
        let startAngle = playerNumber == 1 ? degrees75 : degrees255;
        let endAngle = startAngle + angleDelta;

        // draw player
        const draw = function () {
            const { arena } = gameStateInstance.getState();
            playerRadius = arena.radius - 7;

            if (!playerNumber) return;

            if (playerNumber == 1) {
                ctx.beginPath();
                ctx.arc(cx, cy, playerRadius, startAngle, endAngle);
                ctx.lineWidth = playerLineWidth;
                ctx.strokeStyle = '#75a743';
                ctx.stroke();
            }

            if (playerNumber == 2) {
                ctx.beginPath();
                ctx.arc(cx, cy, playerRadius, startAngle, endAngle);
                ctx.lineWidth = playerLineWidth;
                ctx.strokeStyle = '#75a743';
                ctx.stroke();
            }
        };

        const getPlayerLoc = function (): PlayerLocation {
            return {
                cx,
                cy,
                x: 1, // todo: get meaningful coordinates of player/hitboxes
                y: 1,
                radius: playerRadius,
                lineWidth,
            }
        }

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
            getPlayerLoc,
            draw,
            updatePosition,
        };
    }

    function ball() {
        const defaultRadius = 8;
        let x;
        let y;

        function draw() {
            const { p1, p2 } = gameStateInstance.getState();
            const { cx: p1cx, cy: p1cy, radius: playerRadius, lineWidth } = p1.getPlayerLoc();
            x = p1cx;
            y = p1cy + playerRadius - defaultRadius - lineWidth;

            ctx.beginPath();
            ctx.arc(x, y, defaultRadius, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.stroke();
        }

        function updatePosition() {
            const { state } = gameStateInstance.getState();
            if (!state.hasServed) {
                // todo: stick to player
            }

            // else check for collisions and update position of ball
        }

        return {
            draw,
            updatePosition,
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
