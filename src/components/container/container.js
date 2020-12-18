import { Nav } from '@fluentui/react';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './container.css';
import { Estudiante } from './estudiante/estudiante';
import { Curso } from './curso/curso';
import { Pais } from './pais/pais';
import { Header } from '../header/header';
import { Materia } from './materia/materia';
import { Profesor } from './profesor/profesor';

export const ContainerMain = () => {

    const handleNavClick = () => {

    }

    return (
        <div className="container">
            <Header />
            <Nav
                onLinkClick={handleNavClick}
                selectedKey="key3"
                ariaLabel="Nav basic example"
                styles={{
                    root: {
                        width: 210,
                        height: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #eee',
                        overflowY: 'auto',
                    },
                }}
                groups={[{
                    links: [{
                        name: 'Estudiantes',
                        url: '/containers/estudiantes',
                        icon: 'Group',
                        key: 'estudiantesNav',
                    },
                    {
                        name: 'Profesores',
                        url: '/containers/profesores',
                        icon: 'FrontCamera',
                        key: 'profesoresNav',
                    },
                    {
                        name: 'Cursos',
                        url: '/containers/cursos',
                        icon: 'Education',
                        key: 'cursosNav',
                    },
                    {
                        name: 'Paises',
                        url: '/containers/paises',
                        icon: 'World',
                        key: 'paisesNav',
                    },
                    {
                        name: 'Materias',
                        url: '/containers/materias',
                        icon: 'ReadingMode',
                        key: 'materiasNav',
                    }]
                }]}
            />
            <Router>
                <Switch>
                    <Route exact path="/containers/estudiantes" component={Estudiante} />
                    <Route exact path="/containers/cursos" component={Curso} />
                    <Route exact path="/containers/paises" component={Pais} />
                    <Route exact path="/containers/materias" component={Materia} />
                    <Route exact path="/containers/profesores" component={Profesor} />
                </Switch>
            </Router>
        </div>
    )
}