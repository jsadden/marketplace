import axios from 'axios'
import {
    USER_LOGIN,
    USER_AUTH,
    USER_SIGNUP,
    USER_LOGOUT,
    USER_CHANGECITY,
    USER_CHANGENAME,
    USER_CHANGEPASS,
    USER_DELETE,
    USER_BAN
} from '../types'

export function loginUser({email, password}) {
    const req = axios.post('/api/users/login', {email, password})
    .then(res => res.data)

    return {
        type: USER_LOGIN,
        payload: req
    }
}

export function authenticateUser(){
    const req = axios.get('/api/users/auth')
    .then(res => res.data)

    return {
        type: USER_AUTH,
        payload: req
    }
}

export function addUser(body) {    
    const req = axios.post('/api/users/add', body)
    .then(res => res.data)

    return {
        type: USER_SIGNUP,
        payload: req
    }
}

export function logoutUser(){
    const req = axios.get('/api/users/logout')
    .then(res => res.data)

    return {
        type: USER_LOGOUT,
        payload: req
    }
}

export function changePass(body) {    
    const req = axios.patch('/api/users/changePass', body)
    .then(res => res.data)

    return {
        type: USER_CHANGEPASS,
        payload: req
    }
}


export function changeCity(body) {    
    const req = axios.patch('/api/users/changeCity', body)
    .then(res => res.data)

    return {
        type: USER_CHANGECITY,
        payload: req
    }
}

export function changeName(body) {    
    const req = axios.patch('/api/users/changeName', body)
    .then(res => res.data)

    return {
        type: USER_CHANGENAME,
        payload: req
    }
}

export function deleteUser() {    
    const req = axios.delete('/api/users/delete')
    .then(res => res.data)

    return {
        type: USER_DELETE,
        payload: req
    }
}

export function banUser(body) {    
    const req = axios.post('/api/users/ban', body)
    .then(res => res.data)

    return {
        type: USER_BAN,
        payload: req
    }
}