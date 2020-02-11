/*
Here we've have to define the methods that take place 
upon receipt of these actions.
*/

import axios from 'axios';
import * as actionTypes from './actionTypes';


// returns an object whose type 
// (obligatory) is one of the imported action types
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = token => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    }

}

export const chechAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logaout());
        }, expirationTime * 1000)
    }
}

export const authLogin = (username, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:5000/auth',{
            username: username,
            password: password
        })
        .then(res => {
            const token = res.data.access_token;
            const expirationDate = new Date(newDate().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token));
            dispatch(chechAuthTimeout(3600));
        })
        .catch(err => {
            dispatch(authFail(err))
        })
    }
}

export const authSignup = (username, email, password1, password2) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://127.0.0.1:5000/registration',{
            username: username,
            email: email,
            password1: password1,
            password2: password2,

        })
        .then(res => {
            const token = res.data.access_token;
            const expirationDate = new Date(newDate().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token));
            dispatch(chechAuthTimeout(3600));
        })
        .catch(err => {
            dispatch(authFail(err))
        })
    }
}

// check if a token is actually stored in a localStorage
export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(token == undefined){
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date() ){
                dispatch(logaout());
            } else {
                dispatch(authSuccess(token));
                dispatch(chechAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000) );
            }
        } 
    }
}

