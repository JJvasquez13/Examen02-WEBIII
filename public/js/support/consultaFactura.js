document.addEventListener("DOMContentLoaded", async function () {
  const tablaFactura = document.getElementById("tablaFactura");
  const tablaEmpleado = document.getElementById("tablaEmpleado");
  const tablaPrecio = document.getElementById("tablaPrecio");

  const formConsultaFactura = document.getElementById("formConsultaFactura");

  formConsultaFactura.addEventListener("submit", async function (event) {
    event.preventDefault();

    const OrderID = parseInt(document.getElementById("numeroFactura").value);

    var db = firebase.apps[0].firestore();
    try {
      const querySnapshot = await db
        .collection("Orders")
        .where("OrderID", "==", OrderID)
        .get();

      if (!querySnapshot.empty) {
        const datosFactura = querySnapshot.docs[0].data();
        const CustomerID = datosFactura.CustomerID;
        const EmployeeID = datosFactura.EmployeeID;
        const facturada = datosFactura.OrderDate.toDate();
        const requerida = datosFactura.RequiredDate.toDate();
        const diaEnvio = datosFactura.ShippedDate.toDate();

        // Función para formatear la fecha en formato "dd/MMM/yyyy"
        function formatDate(date) {
          const options = { day: "2-digit", month: "short", year: "numeric" };
          return new Date(date).toLocaleDateString("es-ES", options);
        }

        // Formatear las fechas
        const facturadaFormatted = formatDate(facturada);
        const requeridaFormatted = formatDate(requerida);
        const diaEnvioFormatted = formatDate(diaEnvio);

        const customerSnapshot = await db
          .collection("Customers")
          .where("CustomerID", "==", CustomerID)
          .get();

        if (!customerSnapshot.empty) {
          const datosCliente = customerSnapshot.docs[0].data();
          const nombreCliente = datosCliente.ContactName;
          const nombreEmpresa = datosCliente.ContactTitle;
          const numeroEmpresa = datosCliente.Phone;
          const paisCliente = datosCliente.Country;
          const ciudadCliente = datosCliente.City;
          const postalCliente = datosCliente.PostalCode;

          const employeeSnapshot = await db
            .collection("Employees")
            .where("EmployeeID", "==", EmployeeID)
            .get();

          if (!employeeSnapshot.empty) {
            const datosEmpleado = employeeSnapshot.docs[0].data();
            const nombreEmpleado =
              datosEmpleado.FirstName + " " + datosEmpleado.LastName;

            const tablaClienteHTML = `
              <table class="table table-primary table-bordered border-dark">
                <tr>
                  <th>Cliente: </th>
                  <td>${nombreCliente}</td>
                </tr>
                <tr>
                  <th>Contacto: </th>
                  <td>Empresa: ${nombreEmpresa} || Número de Contácto: ${numeroEmpresa}</td>
                </tr>
                <tr>
                  <th>Destino: </th>
                  <td>Pais: ${paisCliente} || Ciudad: ${ciudadCliente} || Codigo Postal: ${postalCliente}</td>
                </tr>
              </table>
            `;
            tablaFactura.innerHTML = tablaClienteHTML;

            const tablaEmpleadoHTML = `
              <table class="table table-success table-bordered border-dark">
                <tr>
                  <th>Facturada: </th>
                  <td>${facturadaFormatted}</td>
                </tr>
                <tr>
                  <th>Requerida: </th>
                  <td>${requeridaFormatted}</td>
                </tr>
                <tr>
                  <th>Despachada: </th>
                  <td>${diaEnvioFormatted}</td>
                </tr>
                <tr>
                  <th>Empleado: </th>
                  <td>${nombreEmpleado}</td>
                </tr>
              </table>
            `;
            tablaEmpleado.innerHTML = tablaEmpleadoHTML;

            const orderDetailsSnapshot = await db
              .collection("OrderDetails")
              .where("OrderID", "==", OrderID)
              .get();

            if (!orderDetailsSnapshot.empty) {
              let tablaPrecioHTML = `
                <table class="table table-info table-bordered border-dark mt-4">
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Descuento</th>
                    <th>Total</th>
                  </tr>
              `;

              let totalDescuento = 0;
              let totalGeneral = 0;

              for (const doc of orderDetailsSnapshot.docs) {
                const orderDetail = doc.data();
                const ProductID = orderDetail.ProductID;

                const productSnapshot = await db
                  .collection("Products")
                  .where("ProductID", "==", ProductID)
                  .get();

                if (!productSnapshot.empty) {
                  const productName =
                    productSnapshot.docs[0].data().ProductName;

                  const descuento = orderDetail.Discount;
                  const totalProducto =
                    orderDetail.Quantity * orderDetail.UnitPrice;
                  totalDescuento += descuento;
                  totalGeneral += totalProducto;

                  tablaPrecioHTML += `
                    <tr>
                      <td>${orderDetail.ProductID}</td>
                      <td>${productName}</td>
                      <td>${orderDetail.Quantity}</td>
                      <td>${orderDetail.UnitPrice}</td>
                      <td>${descuento}</td>
                      <td>${totalProducto}</td>
                    </tr>
                  `;
                } else {
                  console.log(
                    "No se encontró ningún producto con el ID proporcionado."
                  );
                }
              }

              tablaPrecioHTML += `
                <tr>
                  <td colspan="4">Totales: </td>
                  <td>${totalDescuento}</td>
                  <td>${totalGeneral}</td>
                </tr>
              `;

              tablaPrecioHTML += "</table>";
              tablaPrecio.innerHTML = tablaPrecioHTML;
            } else {
              tablaPrecio.innerHTML = "<p>No hay detalles de la orden.</p>";
            }
          } else {
            console.log(
              "No se encontró ningún empleado con el ID proporcionado."
            );
            tablaEmpleado.innerHTML =
              "<p>No se encontró información del empleado.</p>";
          }
        } else {
          console.log("No se encontró ningún cliente con el ID proporcionado.");
          tablaFactura.innerHTML =
            "<p>No se encontró información del cliente.</p>";
        }
      } else {
        console.log("No se encontró ningún documento con el ID proporcionado.");
        tablaFactura.innerHTML =
          "<p>No se encontró ninguna factura con el ID proporcionado.</p>";
      }
    } catch (error) {
      console.log("Error:", error);
      tablaFactura.innerHTML =
        "<p>Ocurrió un error. Por favor, inténtalo de nuevo más tarde.</p>";
    }
  });
});
