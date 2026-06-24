import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);

  // Le cambié el nombre a la función para que no se confunda con la variable
  const cargarDespachos = async () => {
    try {
      // CAMBIA LA URL AQUÍ POR TU PUERTO LOCAL 30082
      const response = await axios.get(`http://localhost:30082/api/v1/despachos`);
      
      console.log("Datos recibidos en Despachos:", response.data);
      
      const datos = Array.isArray(response.data) ? response.data : [response.data];
      setDespachos(datos);
    } catch (error) {
      console.error("Error al cargar despachos:", error);
      setDespachos([]);
    }
  };

  useEffect(() => {
    cargarDespachos();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const handleAbrirModal = (d) => {
    setDespachoSeleccionado(d);
    setOpenModal(true);
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">
            <table className="table-fixed w-full">
              <thead>
                <tr>
                  <th className="pr-10">Orden de despacho</th>
                  <th className="pr-10">Orden de compra</th>
                  <th className="pr-10">Dirección</th>
                  <th className="pr-10">Fecha despacho</th>
                  <th className="pr-10">Patente</th>
                  <th className="pr-10">Estado</th>
                  <th className="pr-10">Intentos</th>
                  <th className="pr-10"></th>
                </tr>
              </thead>
              <tbody>
                {/* Lógica segura: Si es array y tiene datos, dibuja. Si no, muestra el mensaje */}
                {Array.isArray(despachos) && despachos.length > 0 ? (
                  despachos.map((d) => (
                    <tr key={d.idDespacho}>
                      <td className="py-10">{d.idDespacho}</td>
                      <td className="py-10">{d.idCompra}</td>
                      <td className="py-10">{d.direccionCompra}</td>
                      <td className="py-10">{d.fechaDespacho}</td>
                      <td className="py-10">{d.patenteCamion}</td>
                      <td className="py-10">{d.entregado ? "Entregado" : "Pendiente"}</td>
                      <td className="py-10">{d.intento}</td>
                      <td>
                        <button
                          onClick={() => handleAbrirModal(d)}
                          className="py-1 bg-orange-200 px-8 rounded-xl shadow-md hover:bg-orange-300"
                        >
                          Cerrar despacho
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-10 text-slate-500">
                      No hay órdenes de despacho registradas en el sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => { setOpenModal(false); cargarDespachos(); }}
          />
        )}
      </Modal>
    </>
  );
};