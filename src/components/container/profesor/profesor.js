import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import './profesor.css'
import { restClient } from '../../../services/restClient';
import { ProfesorForm } from './profesorForm';

export const Profesor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [profesores, setProfesores] = useState(undefined); //data.map(item => ({ ...item, nombreCurso: item.curso.nombre }))
    const [filtro, setFiltro] = useState([]);
    const [profesor, setProfesor] = useState();
    const [acccion, setAccion] = useState('New');

    useEffect(() => {
        fetchProfesores();
    }, []);

    const fetchProfesores = async () => {
        const response = await restClient.httpGet('/profesor');

        if (!response.length) {
            return;
        }

        setProfesores(response.map(item => ({ ...item, nombreMateria: item.materia.nombre, nombrePais: item.pais.nombre })));
    }

    const handleRefreshClick = () => {
        setProfesores(undefined);

        fetchProfesores();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoProfesorClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemoveProfesorClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();

            setProfesor(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchProfesor = value => {

        if (!value) {
            setProfesores(undefined);
            setFiltro([]);
            fetchProfesores();

            return;
        }

        const dataFilter = profesores && profesores.filter(item => item.nombre.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditProfesorClick = () => {
        if (!profesor) return 'Selecione un profesor';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverProfesorClick = async () => {
        if (!profesor) return;

        const response = await restClient.httpDelete('/profesor', profesor.id);

        if (response === 'success') {
            handleDismissAlertClick();
            setProfesores(undefined);
            fetchProfesores();
        }
    }

    const handleNoRemoverProfesorClick = () => {
        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditProfesorClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemoveProfesorClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'Profesor', fieldName: 'nombre', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column3', name: 'Edad', fieldName: 'edad', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column4', name: 'Sexo', fieldName: 'sexo', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column5', name: 'Correo', fieldName: 'correo', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column6', name: 'PaisId', fieldName: 'paisId', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column7', name: 'Nombre Pais', fieldName: 'nombrePais', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column8', name: 'MateriaId', fieldName: 'materiaId', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column9', name: 'Nombre Materia', fieldName: 'nombreMateria', minWidth: 100, maxWidth: 200, isResizable: true },
    ]

    const isDisableButton = profesor ? false : true;

    return (
        <div className="profesor">

            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Refresh',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'nuevoProfesor',
                    text: 'New',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoProfesorClick,
                },
                {
                    key: 'removerProfesor',
                    text: 'Remove',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemoveProfesorClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarProfesor',
                    text: 'Editar Profesor',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditProfesorClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
                styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchProfesor} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : profesores}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!profesores}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={acccion === 'New' ? "Nuevo Profesor" : "Editar Profesor"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <ProfesorForm // Este es el formulario que contiene los controles con la información
                    fetchProfesores={fetchProfesores} // Hace un GET a la API
                    profesorSeleccionado={profesor || {}}
                    acccion={acccion}
                    onDismiss={handleDismissClick}
                />
            </Panel>

            <Dialog // Ventana de diálogo que aparece cuándo se desea remover un registro
                hidden={isOpenAlert}
                onDismiss={handleDismissAlertClick}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Remove Profesor',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Remove Profesor?',
                }}
                modalProps={{
                    titleAriaId: '',
                    subtitleAriaId: '',
                    isBlocking: false,
                    styles: { main: { maxWidth: 450 } },
                }}
            >

                <DialogFooter
                // Esto muestra los dos botones en la parte inferior, conultando se desea o no eliminar el registro
                >
                    <PrimaryButton onClick={handleRemoverProfesorClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverProfesorClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}