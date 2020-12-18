import React, { useState } from 'react';

import { PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../../services/restClient';

export const CursoForm = ({ fetchCursos, cursoSeleccionado, accion, onDismiss }) => {
    const [curso, setCurso] = useState({
        id: accion === 'Edit' ? cursoSeleccionado.id : 0,
        nombre: accion === 'Edit' ? cursoSeleccionado.nombre : ''
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        nombre: ''
    });

    const [showSpinner, setShowSpinner] = useState(false);

    const handleTextFieldChange = prop => (event, value) => {
        setCurso({ ...curso, [prop]: value })
    }

    const validandoCampos = () => {
        let mensaje = {};

        if (!curso.nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese nombre' };
        }

        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }

    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/Curso', curso);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchCursos();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/Curso/${cursoSeleccionado.id}`;

        const response = await restClient.httpPut(url, curso);

        if (response === 'success') {
            setMensajeValidacion('Saved');

            fetchCursos();
        } else {
            setMensajeValidacion(response);
        }

        setShowSpinner(false);
        onDismiss();
    }

    return (
        <div>

            {showSpinner && <ProgressIndicator label="Guardando..." />}

            <TextField label="Nombre"
                value={curso.nombre}
                onChange={handleTextFieldChange('nombre')}
                errorMessage={errorCampo.nombre} />

            <br />

            <PrimaryButton text="Guardar" onClick={accion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}