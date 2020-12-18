import React, { useEffect, useState } from 'react';

import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../../services/restClient';

const generos = [{ key: 'F', text: 'F' }, { key: 'M', text: 'M' }];

export const ProfesorForm = ({ fetchProfesores, profesorSeleccionado, acccion, onDismiss }) => {
    const [profesor, setProfesor] = useState({
        id: acccion === 'Edit' ? profesorSeleccionado.id : 0,
        nombre: acccion === 'Edit' ? profesorSeleccionado.nombre : '',
        sexo: acccion === 'Edit' ? profesorSeleccionado.sexo : '',
        correo: acccion === 'Edit' ? profesorSeleccionado.correo : '',
        edad: acccion === 'Edit' ? profesorSeleccionado.edad : 0,
        paisId: acccion === 'Edit' ? profesorSeleccionado.paisId : 0,
        materiaId: acccion === 'Edit' ? profesorSeleccionado.materiaId : 0
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        nombre: '',
        sexo: '',
        correo: '',
        edad: '',
        paisId: '',
        materiaId: ''
    });

    const [materias, setMaterias] = useState([]);
    const [paises, setPaises] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchMaterias = async () => {
            const response = await restClient.httpGet('/materia');

            if (response && response.length) {
                setMaterias(response.map(materia => ({
                    key: materia.id,
                    text: materia.nombre
                })))
            }
        }

        const fetchPaises = async () => {
            const response = await restClient.httpGet('/pais');

            if (response && response.length) {
                setPaises(response.map(pais => ({
                    key: pais.id,
                    text: pais.nombre
                })))
            }
        }

        fetchPaises();
        fetchMaterias();
    }, []);

    const handleTextFieldChange = prop => (event, value) => {
        setProfesor({ ...profesor, [prop]: value })
    }

    const handleSelectedMateriaChange = (event, option) => {
        setProfesor({ ...profesor, materiaId: option.key });
    }

    const handleSelectedPaisChange = (event, option) => {
        setProfesor({ ...profesor, paisId: option.key });
    }

    const handleSelectedSexoChange = (event, option) => {
        setProfesor({ ...profesor, sexo: option.key });
    }

    const validandoCampos = () => {
        let mensaje = {};

        if (!profesor.nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese nombre' };
        }

        if (profesor.edad < 18) {
            mensaje = { ...mensaje, edad: 'Edad debe sera mayor o igual a 18' };
        }

        if (!profesor.sexo) {
            mensaje = { ...mensaje, sexo: 'Seleccione un genero...' };
        }

        if (!profesor.correo) {
            mensaje = { ...mensaje, sexo: 'Ingrese correo' };
        }

        if (!profesor.paisId) {
            mensaje = { ...mensaje, cursoId: 'Seleccione un pais...' };
        }

        if (!profesor.materiaId) {
            mensaje = { ...mensaje, cursoId: 'Seleccione una materia...' };
        }

        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }

    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/Profesor', profesor);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchProfesores();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/Profesor/${profesorSeleccionado.id}`;

        const response = await restClient.httpPut(url, profesor);

        if (response === 'success') {
            setMensajeValidacion('Saved');

            fetchProfesores();
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
                value={profesor.nombre}
                onChange={handleTextFieldChange('nombre')}
                errorMessage={errorCampo.nombre}
            />

            <TextField type="Number" label="Edad"
                value={profesor.edad}
                onChange={handleTextFieldChange('edad')}
                errorMessage={errorCampo.edad}
            />

            <TextField label="Correo"
                value={profesor.correo}
                onChange={handleTextFieldChange('correo')}
                errorMessage={errorCampo.correo}
            />

            <Dropdown label="Seleccione la materia"
                options={materias}
                selectedKey={profesor.materiaId}
                onChange={handleSelectedMateriaChange}
                errorMessage={errorCampo.materiaId}
            />

            <Dropdown label="Seleccione un pais"
                options={paises}
                selectedKey={profesor.paisId}
                onChange={handleSelectedPaisChange}
                errorMessage={errorCampo.paisId}
            />

            <Dropdown label="Seleccione un género"
                options={generos}
                selectedKey={profesor.sexo}
                onChange={handleSelectedSexoChange}
                errorMessage={errorCampo.sexo}
            />

            <br />

            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}