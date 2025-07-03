document.addEventListener("DOMContentLoaded", () => {
    const lanzamientos = 3;
    let jugadores = [];
    let miJugador = null;
    let rivales = [];

    const botonGuardar = document.getElementById("guardarJugadores");
    const contenedorOpciones = document.getElementById("opcionesJugadores");
    const seleccionJugadorDiv = document.getElementById("seleccionJugador");
    const jugadoresCreados = document.getElementById("jugadoresCreados");
    const botonJugar = document.getElementById("botonJugar");

    botonGuardar.addEventListener("click", () => {
        const j1 = document.getElementById("jugador1").value.trim();
        const j2 = document.getElementById("jugador2").value.trim();
        const j3 = document.getElementById("jugador3").value.trim();

        if (!j1 || !j2 || !j3) {
            alert("Por favor, ingresa los nombres de los 3 jugadores.");
            return;
        }

        jugadores = [j1, j2, j3];
        mostrarJugadores();
        crearBotonesSeleccion();
        seleccionJugadorDiv.textContent = '';
        botonJugar.disabled = true;
    });

    function mostrarJugadores() {
        jugadoresCreados.textContent = `Jugadores ingresados: ${jugadores.join(", ")}`;
    }

    function crearBotonesSeleccion() {
        contenedorOpciones.innerHTML = '';
        jugadores.forEach((jugador, index) => {
            const boton = document.createElement("button");
            boton.textContent = jugador;
            boton.classList.add("boton-jugador");
            boton.addEventListener("click", () => seleccionarJugador(index));
            contenedorOpciones.appendChild(boton);
        });
    }

    function seleccionarJugador(indice) {
        miJugador = jugadores[indice];
        rivales = jugadores.filter((_, i) => i !== indice);
        seleccionJugadorDiv.textContent = `Has elegido a ${miJugador}. Los rivales son: ${rivales.join(", ")}`;
        botonJugar.disabled = false;
    }

    function lanzarDado() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function jugar() {
        const puntuaciones = {};

        jugadores.forEach(jugador => {
            puntuaciones[jugador] = 0;
        });

        for (let i = 0; i < lanzamientos; i++) {
            jugadores.forEach(jugador => {
                puntuaciones[jugador] += lanzarDado();
            });
        }

        const ganador = Object.keys(puntuaciones).reduce((a, b) =>
            puntuaciones[a] > puntuaciones[b] ? a : b
        );

        document.getElementById("resultado").textContent =
            `El ganador despues de lanzar 3 dados es ${ganador} con ${puntuaciones[ganador]} puntos.`;
    }

    botonJugar.addEventListener("click", jugar);
});