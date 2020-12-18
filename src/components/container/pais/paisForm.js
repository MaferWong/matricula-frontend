import React, { useState } from 'react';

import { PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../../services/restClient';

export const PaisForm = ({ fetchPaises, paisSeleccionado, accion, onDismiss }) => {
    const [pais, setPais] = useState({
        id: accion === 'Edit' ? paisSeleccionado.id : 0,
        nombre: accion === 'Edit' ? paisSeleccionado.nombre : ''
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        nombre: ''
    });

    const [showSpinner, setShowSpinner] = useState(false);

    const handleTextFieldChange = prop => (event, value) => {
        setPais({ ...pais, [prop]: value })
    }

    const validandoCampos = () => {
        let mensaje = {};

        if (!pais.nombre) {
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

        const response = await restClient.httpPost('/pais', pais);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchPaises();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/Pais/${paisSeleccionado.id}`;

        const response = await restClient.httpPut(url, pais);

        if (response === 'success') {
            setMensajeValidacion('Saved');

            fetchPaises();
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
                value={pais.nombre}
                onChange={handleTextFieldChange('nombre')}
                errorMessage={errorCampo.nombre} />

            <br />

            <PrimaryButton text="Guardar" onClick={accion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}