import { useState } from 'react';
import Input from "./Input_SolicitarDia"
import Select from './Select_SolicitarDia';
import { CiCalendarDate } from "react-icons/ci";
import { FaArrowRotateLeft } from "react-icons/fa6";

const Form_SolicitarDia = () => {
  const [formData, setFormData] = useState({
    diaSolicitado: '',
    telefono: '',
    turno: '',
    jornada: '',
    numHoras: '',
    numDias: ''
  });

  const manejarCambio = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnvio = (e: any) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Formulario enviado con éxito");
  };

  return (
    <>
      <div className='flex justify-between items-center'>
        <h2 className=" flex gap-2 items-center text-xl font-semibold mb-4"><CiCalendarDate /> Solicitud día: {formData.diaSolicitado} </h2>
        <button className='flex gap-2 cursor-pointer items-center font-bold'> <FaArrowRotateLeft /> Volver</button>
      </div>
      <hr />
      <form onSubmit={manejarEnvio}>
        <div className="grid grid-cols-2 gap-12 mb-8 mt-8">

          <Input
            label="Dia Solicitado"
            type="datetime-local"
            name="diaSolicitado"
            value={formData.diaSolicitado}
            onChange={manejarCambio}
            regex={/^/}
            mensajeError=""
          />

          <Input
            label="Numero de telefono"
            type="number"
            name="telefono"
            value={formData.telefono}
            onChange={manejarCambio}
            regex={/^[6789]\d{8}$/}
            mensajeError="Telefono invalido."
          />

          <Select
            label="Jornada"
            name="jornada"
            value={formData.jornada}
            onChange={manejarCambio}
            mensajeError="Debe seleccionar una jornada"
            options={[
              { label: "Completa", value: "Completa" },
              { label: "Parcial", value: "Parcial" },
            ]}
          />

          <Select
            label="Turno"
            name="turno"
            value={formData.turno}
            onChange={manejarCambio}
            mensajeError="Debe seleccionar un turno"
            options={[
              { label: "Diurno", value: "Diurno" },
              { label: "Vespertino", value: "Vespertino" },
            ]}
          />

          <Input
            label="Núm de horas de docencia directa y guardias afectadas"
            type="number"
            name="numHoras"
            value={formData.numHoras}
            onChange={manejarCambio}
            regex={/^[1-7]$/}
            mensajeError="Debe ser un numero entre 1 y 7."
          />

          <Input
            label="Núm de dias de permiso solicitados en el centro"
            type="number"
            name="numDias"
            value={formData.numDias}
            onChange={manejarCambio}
            regex={/^[1-7]$/}
            mensajeError="Debe ser un numero entre 1 y 7."
          />
        </div>
        <div className='mt-4 mb-4 font-bold'>
          <input type="checkbox" className='mr-2 ' />
          Estoy solicitando un diía de permiso no retribuido
        </div>
        <hr />
        <div className='flex justify-end gap-4 mt-2 '>
          <button className='bg-gray-200 cursor-pointer rounded-xl h-12 w-30'>Cancelar</button>
          <button type="submit" className='bg-blue-500 w-50 cursor-pointer text-white rounded-xl '>Guardar solicitud</button>
        </div>
      </form>
    </>
  );
};

export default Form_SolicitarDia