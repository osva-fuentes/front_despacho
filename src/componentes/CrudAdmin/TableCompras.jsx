import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { FormDespacho } from "./FormDespacho";
import axios from "axios";

export const TableCompras = () => {
  const [ventas, setVentas] = useState([]);

 const compras = async () => {
    try {
      // CAMBIA ESTO:
      const response = await axios.get(`http://k8s-default-itpcargo-88bda1752a-1431959926.us-east-1.elb.amazonaws.com/api/v1/ventas`);
      
      console.log("Datos recibidos:", response.data);
      const datos = Array.isArray(response.data) ? response.data : [response.data];
      setVentas(datos);
    } catch (error) {
      console.error("Error al cargar:", error);
      setVentas([]);
    }
  };

  useEffect(() => {
    compras();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const handleAbrirModal = (venta) => {
    setVentaSeleccionada(venta);
    setOpenModal(true);
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">
            <table className="table-fixed w-full">
              <thead>
                <tr className="py-10">
                  <th className="pr-10">Orden de compra</th>
                  <th className="pr-10">Dirección</th>
                  <th className="pr-10">Fecha de compra</th>
                  <th className="pr-10">Valor total</th>
                  <th className="pr-10"></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(ventas) && ventas.length > 0 ? (
                  ventas
                    .filter((venta) => venta && !venta.despachoGenerado)
                    .map((venta) => (
                      <tr key={venta.idVenta}>
                        <td className="pr-10 py-10">{venta.idVenta}</td>
                        <td className="pr-10 py-10">{venta.direccionCompra}</td>
                        <td className="pr-10 py-10">{venta.fechaCompra}</td>
                        <td className="pr-10 py-10">${venta.valorCompra}</td>
                        <td>
                          <button
                            onClick={() => handleAbrirModal(venta)}
                            className="py-1 bg-orange-200 px-8 rounded-xl shadow-md hover:bg-orange-300/70 transition-all"
                          >
                            Generar Despacho
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-10 text-slate-500">
                      No hay ventas pendientes de despacho.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        {ventaSeleccionada && (
          <FormDespacho
            venta={ventaSeleccionada}
            onClose={() => { setOpenModal(false); compras(); }}
          />
        )}
      </Modal>
    </>
  );
};
