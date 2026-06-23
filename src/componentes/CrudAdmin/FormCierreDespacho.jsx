import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

export const FormCierreDespacho = ({ despacho, onClose }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const jsonData = {
      intento: parseInt(data.intento),
      despachado: data.despachado === "true" // Esto convierte el string a boolean
    };

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/despachos/${despacho.idDespacho}`, jsonData);
      Swal.fire("Despacho modificado!", "Éxito", "success");
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-10">
      <div className="mb-5">
        <label>Intentos de entrega</label>
        <input type="number" {...register("intento", { required: true })} className="border w-full p-1" defaultValue={despacho.intento} />
      </div>
      <div className="mb-5">
        <label>Estado del despacho</label>
        <select {...register("despachado")} className="border w-full p-1">
          <option value="false">Despacho abierto</option>
          <option value="true">Cerrar despacho</option>
        </select>
      </div>
      <button type="submit" className="bg-teal-600 text-white p-2 rounded">Modificar Despacho</button>
    </form>
  );
};