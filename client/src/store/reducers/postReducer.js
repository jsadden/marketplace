import {
    POST_GET_BY_CITY,
    POST_ADD,
    POST_GET_BY_USER,
    POST_EDIT,
    POST_DELETE
} from '../types'

export default function posts(state = {}, action) {
    switch (action.type) {

        case POST_GET_BY_CITY:
            return {
                ...state,
                posts: action.payload.posts,
                message: action.payload.message,
                success: action.payload.success
            }

        case POST_GET_BY_USER:
            return {
                ...state,
                posts: action.payload.posts,
                message: action.payload.message,
                success: action.payload.success
            }
        
        case POST_ADD:

            return {
                ...state,
                posts: action.payload.postData ? [action.payload.postData, ...state.posts] : [...state.posts],
                message: action.payload.message,
                success: action.payload.success
            }

        case POST_EDIT:

            //default to current state
            const posts = [...state.posts]

            if (action.payload.postData) {
                //get matching post from array, swap out for updated post
                const [oldPost] = state.posts.filter(post => post._id === action.payload.postData._id)
                const ind = state.posts.indexOf(oldPost)

                if (ind !== -1) {
                    posts[ind] = action.payload.postData
                }
            }

            return {
                ...state,
                posts: posts,
                message: action.payload.message,
                success: action.payload.success
            }

        case POST_DELETE:

            //default to current state
            let posts_delete = [...state.posts]

            if (action.payload.postData) {
                //get matching post from array, remove deleted post
                posts_delete = state.posts.filter(post => post._id !== action.payload.postData._id)
                
            }

            return {
                ...state,
                posts: posts_delete,
                message: action.payload.message,
                success: action.payload.success
            }


        default: 
            return {
                ...state
            }
    }
}