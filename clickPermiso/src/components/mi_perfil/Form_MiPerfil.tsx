import { useState } from 'react';
import Input_MiPerfil from "./Input_MiPerfil.js"
import { CiCalendarDate } from "react-icons/ci";
import { FaArrowRotateLeft } from "react-icons/fa6";
import Select_MiPerfil from './Select_MiPerfil.js';
import { supabase } from "../../supabaseClient.js";

const Form_MiPerfil = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        ape: '',
        email: '',
        dni: '',
        rel_juridica: '',
        anios_servicio: ''
    });

    const [loading, setLoading] = useState(false);

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

    async function handleSubmit(e: any) {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.from("Usuario").insert([
                {
                    nombre: formData.nombre,
                    ape: formData.ape,
                    email: formData.email,
                    dni: formData.dni,
                    rel_juridica: formData.rel_juridica,
                    anios_servicio: parseInt(formData.anios_servicio), // Aseguramos que sea entero
                },
            ]);

            if (error) throw error;

            alert("Profesor registrado con éxito");
            // Limpiar formulario
            setFormData({
                nombre: "",
                ape: "",
                email: "",
                dni: "",
                rel_juridica: "",
                anios_servicio: "",
            });
        } catch (err: any) {
            alert("Error al insertar: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className='flex justify-between items-center'>
                <h2 className=" flex gap-2 items-center text-xl font-semibold mb-4"><CiCalendarDate /> Editar Mi Perfil </h2>
                <button className='flex gap-2 cursor-pointer items-center font-bold'> <FaArrowRotateLeft /> Volver</button>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-12 mb-8 mt-8">

                    <Input_MiPerfil
                        label="Nombre"
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={manejarCambio}
                        regex={/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/}
                        mensajeError="Nombre invalido"
                    />

                    <Input_MiPerfil
                        label="Apellidos"
                        type="text"
                        name="ape"
                        value={formData.ape}
                        onChange={manejarCambio}
                        regex={/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/}
                        mensajeError="Apellido invalido, debes poner tus dos apellidos."
                    />

                    <Input_MiPerfil
                        label="Correo Electrónico"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={manejarCambio}
                        regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                        mensajeError="Email invalido."
                    />

                    <Input_MiPerfil
                        label="DNI"
                        type="number"
                        name="dni"
                        value={formData.dni}
                        onChange={manejarCambio}
                        regex={/^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i}
                        mensajeError="Telefono invalido."
                    />
                    <Select_MiPerfil
                        label="Relacion Jurídica"
                        name="rel_juridica"
                        value={formData.rel_juridica}
                        onChange={manejarCambio}
                        mensajeError="Debe seleccionar la Relacion Jurídica que tienes actualmente"
                        options={[
                            { label: "Indefinido", value: "Indefinido" },
                            { label: "Temporal", value: "Temporal" },
                            { label: "Otro", value: "Otro" },
                        ]}
                        regex={/^(Otro|Indefinido|Temporal)$/}
                    />

                    <Input_MiPerfil
                        label="Años de Servicio"
                        type="number"
                        name="anios_servicio"
                        value={formData.anios_servicio}
                        onChange={manejarCambio}
                        regex={/^(?:[1-9]|[1-4][0-9])$/}
                        mensajeError="Debe ser un numero entre 1 y 49."
                    />

                </div>
                <div className='mt-4 mb-4 font-bold'>
                    <input type="checkbox" className='mr-2 ' />
                    Hace sustitución
                </div>
                <hr />
                <div className='flex justify-end gap-4 mt-2 '>
                    <button className='bg-gray-200 cursor-pointer rounded-xl h-12 w-30'>Cancelar</button>
                    <button type="submit" disabled={loading} className='bg-indigo-800 font-bold w-50  cursor-pointer text-white rounded-xl '>
                        {loading ? "Guardando..." : "Registrar Usuario"}
                    </button>
                </div>
            </form>
        </>
    );
};

export default Form_MiPerfil