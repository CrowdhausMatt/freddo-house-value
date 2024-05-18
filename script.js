// Initialize Matter.js
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.getElementById('freddo-container'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

function calculateFreddos() {
    const houseValue = parseInt(document.getElementById('house-value').value);
    const freddoPrice = 0.25; // Adjust the price as necessary
    const numberOfFreddos = Math.floor(houseValue / freddoPrice);
    
    // Set the total duration to 25 seconds (25000 milliseconds)
    const duration = 25000; // 25 seconds

    createFreddos(numberOfFreddos, duration);
}

function createFreddos(count, duration) {
    const popup = document.getElementById('result-popup');
    const freddoCountElement = document.getElementById('freddo-count');
    
    World.clear(world);
    Engine.clear(engine);
    popup.style.display = 'none'; // Hide the popup initially

    const freddoSize = 45; /* 10% smaller */
    const maxColumns = Math.floor(window.innerWidth / freddoSize);

    // Add ground to prevent Freddos from falling off the screen
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true });
    World.add(world, ground);

    let currentFreddos = 0;

    // Calculate the interval time to generate all Freddos within the specified duration
    const intervalTime = duration / count;
    
    // Fall duration for each Freddo to complete its fall within the total duration
    const fallDuration = duration / 1000; // Convert to seconds

    const interval = setInterval(() => {
        if (currentFreddos >= count) {
            clearInterval(interval);
            return;
        }

        // Random horizontal position
        const x = Math.random() * (window.innerWidth - freddoSize);

        // Create a Freddo bar
        const freddo = Bodies.rectangle(x, -freddoSize, freddoSize, freddoSize, {
            render: {
                sprite: {
                    texture: 'freddo.png',
                    xScale: 1,
                    yScale: 1
                }
            }
        });

        World.add(world, freddo);

        // Set the fall speed to complete within the total fall duration
        Body.setVelocity(freddo, { x: 0, y: (window.innerHeight + freddoSize) / fallDuration });

        currentFreddos++;
    }, intervalTime); // Generate each Freddo within the interval time

    // Display the popup after 20 seconds and hide it after 10 seconds
    setTimeout(() => {
        freddoCountElement.innerHTML = `Your house is worth!<br>${count} Freddos`;
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 10000); // Hide the popup after 10 seconds
    }, 20000); // Show the popup after 20 seconds

    // Update CSS for the tumbling animation dynamically
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`@keyframes tumble {
        0% {
            transform: translateY(-100px) rotate(0deg);
        }
        100% {
            transform: translateY(calc(100vh - ${freddoSize}px)) rotate(360deg);
        }
    }`, styleSheet.cssRules.length);
}
