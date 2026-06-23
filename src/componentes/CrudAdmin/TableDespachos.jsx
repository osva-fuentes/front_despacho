import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);

  const despacho = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/despachos`);
      setDespachos(response.data);
    } catch (error) {
      console.error("Error al cargar despachos:", error);
    }
  };

  useEffect(() => {
    despacho();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
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
                {Array.isArray(despachos) && despachos.map((d) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => { setOpenModal(false); despacho(); }}
          />
        )}
      </Modal>
    </>
  );
};