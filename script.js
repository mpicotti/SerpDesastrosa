const PUNT_MIDA = 10;                
const MAX_RAND = 29;                
const MAX_PUNTS = 900;              
const AMPLADA_CANVAS = 300;         
const ALTURA_CANVAS = 300;
const RETARD = 140;                 

let canvas, ctx;                    
let imatgeCap, imatgeCos, imatgePoma; 
let segmentsSerp;                  
let pomaX, pomaY;                

// Variables per controlar la direcció
let direccioEsquerra = false;
let direccioDreta = true;
let direccioAmunt = false;
let direccioAvall = false;

let jocActiu = true;               // Controla si el joc està en marxa o ha acabat

// Arrays per guardar les coordenades de cada segment de la serp
const coordenadesX = new Array(MAX_PUNTS);
const coordenadesY = new Array(MAX_PUNTS);

// Codis de teclat usats per moure la serp
const TECLAT = {
    ESQUERRE: 37,
    DRETA: 39,
    AMUNT: 38,
    AVALL: 40
};

// Inicia el joc un cop carregada la pàgina
window.onload = iniciarJoc;

function iniciarJoc() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');

    // Carrega les imatges de la serp i la poma
    imatgeCap = new Image(); imatgeCap.src = 'head.png';
    imatgeCos = new Image(); imatgeCos.src = 'dot.png';
    imatgePoma = new Image(); imatgePoma.src = 'apple.png';

    // Inicialitza la serp amb 3 segments
    segmentsSerp = 3;
    for (let i = 0; i < segmentsSerp; i++) {
        coordenadesX[i] = 50 - i * PUNT_MIDA;
        coordenadesY[i] = 50;
    }

    // Genera la primera poma
    generaPoma();
    setTimeout(cicleDeJoc, RETARD);
}

// Genera una nova posició aleatòria per a la poma
function generaPoma() {
    pomaX = Math.floor(Math.random() * MAX_RAND) * PUNT_MIDA;
    pomaY = Math.floor(Math.random() * MAX_RAND) * PUNT_MIDA;
}

// Comprova si la serp ha menjat la poma
function comprovaPoma() {
    if (coordenadesX[0] === pomaX && coordenadesY[0] === pomaY) {
        segmentsSerp++;  // La serp creix
        generaPoma();    // Es crea una nova poma
    }
}

// Mostra un missatge al centre del canvas quan el joc acaba
function dibuixaMissatgeFinal() {
    const punts = segmentsSerp - 3;
    const text = punts === 1 ? "1 punt - Game over" : `${punts} punts - Game over`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px serif';
    ctx.fillText(text, AMPLADA_CANVAS / 2, ALTURA_CANVAS / 2);
}

// Mou cada segment de la serp a la posició del segment anterior
function mouSerp() {
    for (let i = segmentsSerp; i > 0; i--) {
        coordenadesX[i] = coordenadesX[i - 1];
        coordenadesY[i] = coordenadesY[i - 1];
    }

    // Mou el cap en la direcció activa
    if (direccioEsquerra) coordenadesX[0] -= PUNT_MIDA;
    if (direccioDreta) coordenadesX[0] += PUNT_MIDA;
    if (direccioAmunt) coordenadesY[0] -= PUNT_MIDA;
    if (direccioAvall) coordenadesY[0] += PUNT_MIDA;
}

// Comprova col·lisions amb les parets i amb si mateixa
function comprovaColisions() {
    // Col·lisió amb el propi cos
    for (let i = segmentsSerp; i > 0; i--) {
        if (i > 4 && coordenadesX[0] === coordenadesX[i] && coordenadesY[0] === coordenadesY[i]) {
            jocActiu = false;
        }
    }

    // Col·lisió amb les vores del canvas
    if (
        coordenadesY[0] >= ALTURA_CANVAS || coordenadesY[0] < 0 ||
        coordenadesX[0] >= AMPLADA_CANVAS || coordenadesX[0] < 0
    ) {
        jocActiu = false;
    }
}

// Dibuixa la poma i tots els segments de la serp
function dibuixaJoc() {
    ctx.clearRect(0, 0, AMPLADA_CANVAS, ALTURA_CANVAS);

    if (jocActiu) {
        ctx.drawImage(imatgePoma, pomaX, pomaY);
        for (let i = 0; i < segmentsSerp; i++) {
            const imatge = i === 0 ? imatgeCap : imatgeCos;
            ctx.drawImage(imatge, coordenadesX[i], coordenadesY[i]);
        }
    } else {
        dibuixaMissatgeFinal();
    }
}

// Cicle principal del joc: comprova poma, col·lisions, mou i dibuixa
function cicleDeJoc() {
    if (jocActiu) {
        comprovaPoma();
        comprovaColisions();
        mouSerp();
        dibuixaJoc();
        setTimeout(cicleDeJoc, RETARD);
    }
}

// Control del teclat per canviar la direcció de la serp
document.onkeydown = function (e) {
    const tecla = e.keyCode;

    // Evita girar en direcció contrària immediatament
    if (tecla === TECLAT.ESQUERRE && !direccioDreta) {
        direccioEsquerra = true; direccioAmunt = direccioAvall = false;
    }
    if (tecla === TECLAT.DRETA && !direccioEsquerra) {
        direccioDreta = true; direccioAmunt = direccioAvall = false;
    }
    if (tecla === TECLAT.AMUNT && !direccioAvall) {
        direccioAmunt = true; direccioEsquerra = direccioDreta = false;
    }
    if (tecla === TECLAT.AVALL && !direccioAmunt) {
        direccioAvall = true; direccioEsquerra = direccioDreta = false;
    }
};
