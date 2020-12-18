import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import './curso.css'
import { restClient } from '../../../services/restClient';
import { CursoForm } from './cursoForm';

export const Curso = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [cursos, setCursos] = useState(undefined); //data.map(item => ({ ...item, nombreCurso: item.curso.nombre }))
    const [filtro, setFiltro] = useState([]);
    const [curso, setCurso] = useState();
    const [accion, setAccion] = useState('New');

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        const response = await restClient.httpGet('/curso');

        if (!response.length) {
            return;
        }

        setCursos(response.map(item => ({ ...item})));
    }

    const handleRefreshClick = () => {
        setCursos(undefined);

        fetchCursos();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoCursoClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemoveCursoClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();

            setCurso(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchCurso = value => {

        if(!value){
            setCursos(undefined);
            setFiltro([]);
            fetchCursos();

            return;
        }

        const dataFilter = cursos && cursos.filter(item => item.nombre.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditCursoClick = () => {
        if (!curso) return 'Selecione un curso';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverCursoClick = async () => {
        if (!curso) return;

        const response = await restClient.httpDelete('/curso', curso.id);

        if (response === 'success') {
            handleDismissAlertClick();
            setCursos(undefined);
            fetchCursos();
        }
    }

    const handleNoRemoverCursoClick = () => {

        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditCursoClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemoveCursoClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'Nombre del curso', fieldName: 'nombre', minWidth: 100, maxWidth: 200, isResizable: true },
    ]

    const isDisableButton = curso ? false : true;

    return (
        <div className="curso">
            
            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Refresh',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'newCourse',
                    text: 'New',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoCursoClick,
                },
                {
                    key: 'removeCourse',
                    text: 'Remove',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemoveCursoClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarCurso',
                    text: 'Editar Curso',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditCursoClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
            styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchCurso} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : cursos}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!cursos}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={accion === 'New' ? "Nuevo Curso" : "Editar Curso"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <CursoForm // Este es el formulario que contiene los controles con la información
                    fetchCursos={fetchCursos} // Hace un GET a la API
                    cursoSeleccionado={curso || {}}
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
                    <PrimaryButton onClick={handleRemoverCursoClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverCursoClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}