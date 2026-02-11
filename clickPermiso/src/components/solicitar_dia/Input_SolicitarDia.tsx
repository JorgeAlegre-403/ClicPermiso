import { useState } from 'react';

interface props {
    label: string,
    type: string,
    name: string,
    value: string,
    onChange: any,
    regex: RegExp,
    mensajeError: string,
}

const Input = ({ label, type, name, value, onChange, regex, mensajeError }: props) => {
    const [error, setError] = useState(false);

    const handleBlur = () => {
        if (regex) {
            if (!regex.test(value)) {
                setError(true);
            } else {
                setError(false);
            }
        }
    };

    const handleChangeInternal = (e: any) => {
        setError(false);
        onChange(e);
    };

    return (
        <div>
            <label className="font-bold">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChangeInternal}
                onBlur={handleBlur}
                className="border rounded flex w-11/12 h-8"
            />
            {error && <span className="text-red-500">{mensajeError}</span>}
        </div>
    );
};

export default Input;