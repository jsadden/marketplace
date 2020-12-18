import axios from 'axios'
import {
    POST_GET_BY_CITY,
    POST_ADD,
    POST_GET_BY_USER,
    POST_EDIT,
    POST_DELETE
} from '../types'

export function getPostsByCity(city, limit) {
    const req = axios.get('/api/posts/getPosts', {params: {limit: limit, city: city}})
    .then(res => res.data)

    return {
        type: POST_GET_BY_CITY,
        payload: req
    }
}

export function getPostsByUser() {
    const req = axios.get('/api/posts/getPostsByUser')
    .then(res => res.data)

    return {
        type: POST_GET_BY_USER,
        payload: req
    }
}

export function addPost(body) {
    const req = axios.post('/api/posts/add', body)
    .then(res => res.data)

    return {
        type: POST_ADD,
        payload: req
    }
}

export function editPost(body) {
    const req = axios.patch('/api/posts/editPost', body)
    .then(res => res.data)

    return {
        type: POST_EDIT,
        payload: req
    }
}

export function deletePost(body) {
    const req = axios.delete('/api/posts/remove', {data: body})
    .then(res => res.data)

    return {
        type: POST_DELETE,
        payload: req
    }
}