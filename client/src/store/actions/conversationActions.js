import axios from 'axios'
import {
    CONVERSATION_ADD,
    CONVERSATION_GET_ONE,
    CONVERSATION_ADD_MESSAGE,
    CONVERSATION_GET_ALL,
    CONVERSATION_GET_BY_ID,
    CONVERSATION_DELETE,
    CONVERSATION_DELETE_GET,
    CONVERSATION_DELETE_PATCH
} from '../types'

export function addConversation(body) {
    const req = axios.post('/api/conversations/add', body)
    .then(res => res.data)

    return {
        type: CONVERSATION_ADD,
        payload: req
    }
}

export function getConversation(email) {
    const req = axios.get('/api/conversations/getConversation', {params: {email: email}})
    .then(res => res.data)

    return {
        type: CONVERSATION_GET_ONE,
        payload: req
    }
}

export function addMessage(body) {
    const req = axios.post('/api/conversations/addMessage', body)
    .then(res => res.data)

    return {
        type: CONVERSATION_ADD_MESSAGE,
        payload: req
    }
}



export function getConversationsByUser() {
    const req = axios.get('/api/conversations/getConversationsByUser')
    .then(res => res.data)

    return {
        type: CONVERSATION_GET_ALL,
        payload: req
    }
}

export function getConversationById(id) {
    const req = axios.get('/api/conversations/getConversationById', {params: {id: id}})
    .then(res => res.data)

    return {
        type: CONVERSATION_GET_BY_ID,
        payload: req
    }
}

export function deleteConversationForUser(body) {
    const req = axios.patch('/api/conversations/delete', body)
    .then(res => res.data)

    return {
        type: CONVERSATION_DELETE_PATCH,
        payload: req
    }
}

export function getConversationForDelete(id) {
    const req = axios.get('/api/conversations/delete', {params: {id: id}})
    .then(res => res.data)

    return {
        type: CONVERSATION_DELETE_GET,
        payload: req
    }
}

export function deleteConversation(body) {
    const req = axios.delete('/api/conversations/delete', {data: body})
    .then(res => res.data)

    return {
        type: CONVERSATION_DELETE,
        payload: req
    }
}
