import React, { useState} from 'react';
import { PrimaryButton, TextField } from '@fluentui/react';
import { restClient } from '../../../services/restClient';
import './login.css';

export const Login = ({ history }) => {
    const [user, setUser] = useState({
        userId: '',
        password: ''
    });

    const [message, setMessage] = useState();

    const handleUserChange = prop => (event, value) => {
        setUser({ ...user, [prop]: value });
    }

    const handleEnterClick = async () => {
        if (!user.userId && !user.password) {
            return;
        }

        const response = await restClient.httpGet(`/usuario/${user.userId}/${user.password}`);

        if (response === 'success') {
            history.push('/containers/estudiantes');
        }

        setMessage(response);
    }

    return (
        <div className="login">
            <div className="form">
                <h2>Login</h2>
                <TextField
                    label="Usuario"
                    value={user.userId}
                    underlined
                    onChange={handleUserChange('userId')}
                />

                <TextField
                    label="Contraseña"
                    type="password"
                    value={user.password}
                    canRevealPassword
                    underlined
                    onChange={handleUserChange('password')}
                />

                <PrimaryButton text="Enter" onClick={handleEnterClick} />

                <span>{message}</span>
            </div>
        </div>)
}
