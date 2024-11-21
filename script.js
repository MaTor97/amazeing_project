const height = 30;
const width = 60;
const brick = '0';
const floor = ' ';
const player = '$';
const target = 'T';
const lava = 'L'
const velocity = 0;
const gravity = [1, 0];
let playerX = 1;
let playerY = 1;
let counter = 0;
let applyGravité = true;
let interval
let place
let lavaFloor
let pointHeight = Math.floor(Math.random()*7);

function screamer(src) {
    let image = document.createElement('img');
    image.src = src; // Chemin de l'image
    image.alt = 'Boo'; // Texte alternatif

    // Ajoute des styles pour la position absolue
    image.style.position = 'absolute';
    image.style.top = '0'; // Positionner l'image au sommet de la page
    image.style.left = '50%'; // Centrer l'image horizontalement
    image.style.transform = 'translate(-50%, -50%)';
    image.style.top = '50%'; // Centrer l'image horizontalement  // Ajuste le centrage pour que l'image soit parfaitement centrée
    image.style.width = '50%'; // Ajuste la taille de l'image à 80% de la largeur de la page
    image.style.height = 'auto'; // Conserve les proportions

    // Ajoute l'image au DOM
    document.body.appendChild(image);
    setTimeout(() => {
        image.style.display = 'none'
     }, 2000)
}
// Créer une ligne de murs
function generateLine(width) {
    const wall = [];
    for (let i = 0; i < width; i++) {
        wall.push(brick);
    }
    return wall;
}

// Créer une grille de labyrinthes
function generateGrid(height, width) {
    const grid = [];
    for (let i = 0; i < height; i++) {
        grid.push(generateLine(width));
    }
    return grid;
}

// Générer un chemin entre deux points
function generatePath(grid, start, end, floor) {
    let [x, y] = start;
    const [endX, endY] = end;

    grid[x][y] = floor;

    while (!(x === endX && y === endY)) {
        const directions = [];
        if (x > 1) directions.push([-1, 0]); // Monter
        if (x < height - 2) directions.push([1, 0]); // Descendre
        if (y > 1) directions.push([0, -1]); // Gauche
        if (y < width - 2) directions.push([0, 1]); // Droite

        const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
        x += dx;
        y += dy;

        grid[x][y] = floor;
    }
    return grid;
}

// Générer 
function generateMaze() {
    // Initialisation du labyrinthe
    playerX = 1;
    playerY = 1;
    place = generateGrid(height, width);
    place = generatePath(place, [1, 1], [pointHeight, width - 2], floor);
    place[pointHeight + 1][1] = brick
    place[pointHeight][1] = player // Placer le joueur
    place[pointHeight][width - 2] = target; // Placer la cible
    lavaFloor = place.slice(-6);
    lavaFloor.forEach(line => {
    line.forEach((cell, index) => {
        if (cell === floor) {
            line[index] = lava; // Remplace 'floor' par 'lava'
        }
    });
    console.log('Grille actuelle :');
    place.forEach(row => {
        console.log(row.join(' '));  // Affiche chaque ligne sous forme de chaîne de caractères
    });

});

}

generateMaze()
// Variables pour la position du joueur


// Met à jour le DOM
function renderMaze() {
    const main = document.getElementById("maze");
    main.innerHTML = ""; 

    place.forEach(row => {
        row.forEach(cell => {
            const div = document.createElement("div");
            if (cell === brick) {
                div.className = "brick";
            } else if (cell === floor) {
                div.className = "floor";
            } else if (cell === player) {
                div.className = "player";
            } else if (cell === target) {
                div.className = "target";
            } else if (cell === lava) {
                div.className = 'lava';
            } else if (cell === startPoint) {
                div.className = 'startPoint'
            }
            main.appendChild(div);
        });
    });
}

// Définir la cible une fois pour toutes (à l'initialisation du labyrinthe)
let newTarget = [pointHeight, width - 2];

function movePlayer(dx, dy) {
    const newX = playerX + dx;
    const newY = playerY + dy;

    // Vérifier les limites
    if (newX < 0 || newY < 0 || newX >= height || newY >= width) {
        return; // Ignore le déplacement si hors limites
    }

    // Vérifier si le mouvement est valide (pas de mur)
    if(place[newX][newY] === lava) {
        screamer('lava.jpg')
    }

    if (place[newX][newY] !== brick) {
        // Met à jour l'ancienne position
        place[playerX][playerY] = floor;
        // Met à jour la nouvelle position
        playerX = newX;
        playerY = newY;
        
        place[playerX][playerY] = player;
        renderMaze();

        // Vérifier si le joueur atteint la cible
        if (playerX === pointHeight && playerY === width-2) {
            counter++
            alert("Félicitations ! Vous avez atteint la cible !"+` Score: ${counter}`);
            if(counter === 1)
                screamer('Anne.jpg')
            generateMaze()
        }
    }
}


setInterval(() => {
   if(applyGravité === true){
    movePlayer(1, 0)
   }
}, 15);

// Gérer les touches du clavier
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp": // Haut
            movePlayer(-1, 0);
            interval = isUp();
            break;
        case "ArrowDown": // Bas
            movePlayer(1, 0);
            break;
        case "ArrowLeft": // Gauche
            movePlayer(0, -1);
            break;
        case "ArrowRight": // Droite
            movePlayer(0, 1);
            break;
    }
});


function isUp() {
    clearInterval(interval)
    applyGravité = false
    return setInterval(() => {
        applyGravité = true
    }, 150)
}

// Afficher le labyrinthe initial
renderMaze();
