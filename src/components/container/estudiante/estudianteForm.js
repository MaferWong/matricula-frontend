import React, { useEffect, useState } from 'react';

import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../../services/restClient';

const generos = [{ key: 'F', text: 'F' }, { key: 'M', text: 'M' }];

export const EstudianteForm = ({ fetchEstudiantes, estudianteSeleccionado, acccion, onDismiss }) => {
    const [estudiante, setEstudiante] = useState({
        id: acccion === 'Edit' ? estudianteSeleccionado.id : 0,
        nombre: acccion === 'Edit' ? estudianteSeleccionado.nombre : '',
        sexo: acccion === 'Edit' ? estudianteSeleccionado.sexo : '',
        correo: acccion === 'Edit' ? estudianteSeleccionado.correo : '',
        edad: acccion === 'Edit' ? estudianteSeleccionado.edad : 0,
        paisId: acccion === 'Edit' ? estudianteSeleccionado.paisId : 0,
        cursoId: acccion === 'Edit' ? estudianteSeleccionado.cursoId : 0
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        nombre: '',
        sexo: '',
        edad: '',
        cursoId: ''
    });

    const [cursos, setCursos] = useState([]);
    const [paises, setPaises] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchCursos = async () => {
            const response = await restClient.httpGet('/curso');

            if (response && response.length) {
                setCursos(response.map(curso => ({
                    key: curso.id,
                    text: curso.nombre
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
        fetchCursos();
    }, []);

    const handleTextFieldChange = prop => (event, value) => {
        setEstudiante({ ...estudiante, [prop]: value })
    }

    const handleSelectedCursoChange = (event, option) => {
        setEstudiante({ ...estudiante, cursoId: option.key });
    }

    const handleSelectedPaisChange = (event, option) => {
        setEstudiante({ ...estudiante, paisId: option.key });
    }

    const handleSelectedSexoChange = (event, option) => {
        setEstudiante({ ...estudiante, sexo: option.key });
    }

    const validandoCampos = () => {
        let mensaje = {};

        if (!estudiante.nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese nombre' };
        }

        if (estudiante.edad < 18) {
            mensaje = { ...mensaje, edad: 'Edad debe sera mayor o igual a 18' };
        }

        if (!estudiante.correo) {
            mensaje = { ...mensaje, nombre: 'Ingrese correo' };
        }

        if (!estudiante.sexo) {
            mensaje = { ...mensaje, sexo: 'Seleccione un genero...' };
        }

        if (!estudiante.paisId) {
            mensaje = { ...mensaje, cursoId: 'Seleccione un pais...' };
        }

        if (!estudiante.cursoId) {
            mensaje = { ...mensaje, cursoId: 'Seleccione un curso...' };
        }

        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }


    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/Estudiante', estudiante);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchEstudiantes();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/Estudiante/${estudianteSeleccionado.id}`;

        const response = await restClient.httpPut(url, estudiante);

        if (response === 'success') {
            setMensajeValidacion('Saved');

            fetchEstudiantes();
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
                value={estudiante.nombre}
                onChange={handleTextFieldChange('nombre')}
                errorMessage={errorCampo.nombre} />

            <TextField type="Number" label="Edad"
                value={estudiante.edad}
                onChange={handleTextFieldChange('edad')}
                errorMessage={errorCampo.edad} />

            <TextField label="Correo"
                value={estudiante.correo}
                onChange={handleTextFieldChange('correo')}
                errorMessage={errorCampo.nombre} />

            <Dropdown label="Seleccione un curso"
                options={cursos}
                selectedKey={estudiante.cursoId}
                onChange={handleSelectedCursoChange}
                errorMessage={errorCampo.cursoId} />

            <Dropdown label="Seleccione un pais"
                options={paises}
                selectedKey={estudiante.paisId}
                onChange={handleSelectedPaisChange}
                errorMessage={errorCampo.paisId} />

            <Dropdown label="Seleccione un género"
                options={generos}
                selectedKey={estudiante.sexo}
                onChange={handleSelectedSexoChange}
                errorMessage={errorCampo.sexo} />

            <br />

            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}
