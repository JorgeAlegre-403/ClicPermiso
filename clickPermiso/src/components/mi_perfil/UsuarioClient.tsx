import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export function UsuarioList() {
    const [usuarios, setProfesores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    async function fetchUsuarios() {
        setLoading(true);
        try {
            let { data, error } = await supabase.from("Usuario").select("id_usuario, nombre, ape, email, dni, rel_juridica, anios_servicio");
            if (error) throw error;
            setProfesores(data);

        } catch (err) {
            setError(err.message);
            console.error("Error al obtener tareas:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <ul className="todo-list">
            {usuarios.map((usuario) => (
                <>
                    <strong><u><h2>Usuario:</h2></u></strong>
                    <li key={usuario.id_usuario}>Nombre: {usuario.nombre}</li>
                    <li key={usuario.id_usuario}>Apellidos: {usuario.ape}</li>
                    <li key={usuario.id_usuario}>Email: {usuario.email}</li>
                    <li key={usuario.id_usuario}>DNI: {usuario.dni}</li>
                    <li key={usuario.id_usuario}>Relacion Juridica: {usuario.rel_juridica}</li>
                    <li key={usuario.id_usuario}>Años de servicio: {usuario.anios_servicio}</li>
                    <hr />
                </>

            ))}
        </ul>
    );
}

export default UsuarioList;
