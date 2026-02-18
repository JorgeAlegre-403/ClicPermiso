import { useState } from "react";

interface Option {
    label: string;
    value: string;
}

interface Props {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    mensajeError?: string;
    regex: RegExp,
}

const Select_MiPerfil = ({ label, name, value, onChange, options, mensajeError, }: Props) => {
    const [error, setError] = useState(false);

    const handleBlur = () => {
        if (!value) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const handleChangeInternal = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setError(false);
        onChange(e);
    };

    return (
        <div className="grupo-select flex flex-col mb-4">
            <label className="font-bold mb-1">{label}</label>

            <select
                name={name}
                value={value}
                onChange={handleChangeInternal}
                onBlur={handleBlur}
                className="border rounded w-11/12 h-8 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Seleccione una opción</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && mensajeError && (
                <span className="text-red-500 text-sm mt-1">
                    {mensajeError}
                </span>
            )}
        </div>
    );
};

export default Select_MiPerfil;
