import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import './materia.css'
import { restClient } from '../../../services/restClient';
import { MateriaForm } from './materiaForm';


export const Materia = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [materias, setMaterias] = useState(undefined);
    const [filtro, setFiltro] = useState([]);
    const [materia, setMateria] = useState();
    const [accion, setAccion] = useState('New');

    useEffect(() => {
        fetchMaterias();
    }, []);

    const fetchMaterias = async () => {
        const response = await restClient.httpGet('/materia');

        if (!response.length) {
            return;
        }

        setMaterias(response.map(item => ({ ...item, nombreCurso: item.curso.nombre })));
    }

    const handleRefreshClick = () => {
        setMaterias(undefined);

        fetchMaterias();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoMateriaClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemoveMateriaClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();

            setMateria(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchMateria = value => {

        if (!value) {
            setMaterias(undefined);
            setFiltro([]);
            fetchMaterias();

            return;
        }

        const dataFilter = materias && materias.filter(item => item.nombre.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditMateriaClick = () => {
        if (!materia) return 'Selecione un materia';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverMateriaClick = async () => {
        if (!materia) return;

        const response = await restClient.httpDelete('/materia', materia.id);

        if (response === 'success') {
            handleDismissAlertClick();
            setMaterias(undefined);
            fetchMaterias();
        }
    }

    const handleNoRemoverMateriaClick = () => {
        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditMateriaClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemoveMateriaClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'Codigo Materia', fieldName: 'codigo', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column3', name: 'Nombre Materia', fieldName: 'nombre', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column4', name: 'CursoId', fieldName: 'cursoId', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column5', name: 'Nombre Curso', fieldName: 'nombreCurso', minWidth: 100, maxWidth: 200, isResizable: true },
    ]

    const isDisableButton = materia ? false : true;

    return (
        <div className="materia">

            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Refresh',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'nuevaMateria',
                    text: 'New',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoMateriaClick,
                },
                {
                    key: 'removerMateria',
                    text: 'Remove',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemoveMateriaClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarMateria',
                    text: 'Editar Materia',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditMateriaClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
                styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchMateria} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : materias}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!materias}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={accion === 'New' ? "Nuevo Materia" : "Editar Materia"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <MateriaForm // Este es el formulario que contiene los controles con la información
                    fetchMaterias={fetchMaterias} // Hace un GET a la API
                    materiaSeleccionada={materia || {}}
                    accion={accion}
                    onDismiss={handleDismissClick}
                />
            </Panel>

            <Dialog // Ventana de diálogo que aparece cuándo se desea remover un registro
                hidden={isOpenAlert}
                onDismiss={handleDismissAlertClick}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Remove Course',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Remove Course?',
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
                    <PrimaryButton onClick={handleRemoverMateriaClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverMateriaClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}