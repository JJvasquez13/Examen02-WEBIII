// validate that user is log-in
var auth = firebase.apps[0].auth();
var inactivityTimer;

function validar() {
  var uid = -1;
  //const user = auth.currentUser;
  auth.onAuthStateChanged((user) => {
    if (user) {
      uid = user.uid;
      // Reiniciar el temporizador de inactividad cuando el usuario está autenticado
      reiniciarTemporizador();
    } else {
      document.location.href = "login.html";
    }
  });
  return uid;
}

// close current session
function salir() {
  auth
    .signOut()
    .then(() => {
      document.location.href = "login.html";
    })
    .catch((error) => {
      alert("Error al cerrar la sesión: " + error.message);
    });
}

// Función para reiniciar el temporizador de inactividad
function reiniciarTemporizador() {
  // Reiniciar el temporizador y configurarlo para que se ejecute después de 3 minutos
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(function () {
    alert("Tu sesión ha expirado debido a inactividad.");
    salir();
  }, 1 * 60 * 1000); // 3 minutos en milisegundos
}

// Configurar eventos para reiniciar el temporizador de inactividad cuando haya interacción del usuario
document.addEventListener("mousemove", reiniciarTemporizador);
document.addEventListener("keypress", reiniciarTemporizador);
