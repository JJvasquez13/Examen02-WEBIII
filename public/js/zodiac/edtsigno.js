let currentId;
const modal = new bootstrap.Modal(document.getElementById("modalModificar"));

function recuperarId(id) {
  currentId = id;
  abrirModal(id);
}

function abrirModal(id) {
  db.collection("datosZodiaco")
    .doc(id)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        const datos = doc.data();

        document.getElementById("txtPosic").value = datos.posic;
        document.getElementById("txtSigno").value = datos.signo;
        document.getElementById("txtRango").value = datos.rango;
        document.getElementById("txtElemento").value = datos.elemento;
        document.getElementById("txtAstro").value = datos.astro;
        document.getElementById("txtPiedra").value = datos.piedra;

        modal.show();
      } else {
        console.error("El documento no existe");
      }
    });
}

function cerrarModal() {
  modal.hide();
}

function modificarSigno() {
  const id = currentId;

  const posicion = document.getElementById("txtPosic").value;
  const signo = document.getElementById("txtSigno").value;
  const rango = document.getElementById("txtRango").value;
  const elemento = document.getElementById("txtElemento").value;
  const astro = document.getElementById("txtAstro").value;
  const piedra = document.getElementById("txtPiedra").value;

  db.collection("datosZodiaco").doc(id).update({
    posic: posicion,
    signo: signo,
    rango: rango,
    elemento: elemento,
    astro: astro,
    piedra: piedra,
  });

  alert("Modificación realizada correctamente");
  cerrarModal();
}
