function registrarHabitosDiarios() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hojaInterfaz = ss.getSheetByName("Interfaz Diaria");
  var hojaDatos = ss.getSheetByName("Datos");

  var filaInicio = 4; // los hábitos empiezan aquí
  var fechaHoy = new Date();
  fechaHoy.setHours(0,0,0,0); // ignorar horas

  // Detectar hábitos en la interfaz
  var ultimaFilaInterfaz = hojaInterfaz.getLastRow();
  var numFilas = ultimaFilaInterfaz - filaInicio + 1;

  if (numFilas < 1) {
    SpreadsheetApp.getUi().alert(
      "No hay hábitos para registrar en la Interfaz Diaria."
    );
    return;
  }

  // ===============================
  // VERIFICAR DUPLICADOS DEL DÍA
  // ===============================

  var lastRowDatos = hojaDatos.getLastRow();
  var registrosHoy = 0;

  if (lastRowDatos > 1) { // hay datos reales
    var fechas = hojaDatos
      .getRange(2, 1, lastRowDatos - 1, 1)
      .getValues();

    registrosHoy = fechas.filter(function(fila) {
      if (!fila[0]) return false;
      var f = new Date(fila[0]);
      f.setHours(0,0,0,0);
      return f.getTime() === fechaHoy.getTime();
    }).length;
  }

  if (registrosHoy >= numFilas) {
    SpreadsheetApp.getUi().alert(
      "Los hábitos de hoy ya fueron registrados."
    );
    return;
  }

  // ===============================
  // LEER INTERFAZ Y REGISTRAR
  // ===============================

  var interfaz = hojaInterfaz
    .getRange(filaInicio, 1, numFilas, 2)
    .getValues();

  interfaz.forEach(function(fila) {
    var habito = fila[0];
    if (!habito) return; // ignorar filas vacías

    var cumplido = fila[1] ? "SI" : "NO";

    hojaDatos.appendRow([
      fechaHoy,
      habito,
      cumplido
    ]);
  });

  // ===============================
  // LIMPIAR CHECKBOXES
  // ===============================

  hojaInterfaz
    .getRange(filaInicio, 2, numFilas, 1)
    .clearContent();

  SpreadsheetApp.getUi().alert(
    "Registro diario completado correctamente."
  );
}
