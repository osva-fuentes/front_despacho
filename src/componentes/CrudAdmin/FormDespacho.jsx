import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const FormDespacho = ({ venta, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    // Estructura limpia para enviar a tu API
    const jsonData = {
      fechaDespacho: data.fechaDespacho,
      patenteCamion: data.patenteCamion,
      intento: 0,
      entregado: false,
      idCompra: venta.idVenta,
      direccionCompra: venta.direccionCompra,
      valorCompra: Number(venta.valorCompra),
    };

    const jsonDataSales = {
      despachoGenerado: true,
    };

    try {
      // 1. Primero actualizamos el estado de la venta (PUERTO 30081)
      await axios.put(`http://localhost:30081/api/v1/ventas/${venta.idVenta}`, jsonDataSales);
      
      // 2. Luego creamos el despacho (PUERTO 30082)
      await axios.post(`http://localhost:30082/api/v1/despachos`, jsonData);
      
      Swal.fire({
        title: "Despacho registrado 🛻!",
        text: "El despacho ha sido generado con éxito",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      onClose(); 
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Swal.fire("Error", "No se pudo registrar el despacho. Revisa la consola.", "error");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center text-center px-24 text-xl">
      <div className="mx-auto text-3xl font-bold mb-10 text-teal-600">Ingreso de orden de despacho</div>
      
      <div className="mb-5">
        <label className="block font-bold mb-2">Fecha de despacho</label>
        <input type="date" className="border rounded-lg w-full p-1" {...register("fechaDespacho", { required: true })} />
      </div>
      
      <div className="mb-5">
        <label className="block font-bold mb-2">Patente de camión</label>
        <input type="text" className="border rounded-lg w-full p-1" {...register("patenteCamion", { required: true })} />
      </div>

      {/* Campos de solo lectura */}
      <div className="mb-5">
        <label className="block font-bold mb-2">ID Compra</label>
        <input type="text" disabled className="border rounded-lg w-full text-slate-400 p-1" value={venta.idVenta} />
      </div>

      <button className="py-4 px-10 rounded-lg bg-teal-600 text-white font-bold" type="submit">
        Asignar despacho
      </button>
    </form>
  );
};