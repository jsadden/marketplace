import {
    USER_LOGIN,
    USER_AUTH,
    USER_SIGNUP,
    USER_LOGOUT,
    USER_CHANGEPASS,
    USER_CHANGECITY,
    USER_DELETE,
    USER_BAN
} from '../types'

export default function user(state={}, action) {
    switch (action.type) {
        case USER_LOGIN: 
            return {
                ...state,
                userData: action.payload.userData,
                success: action.payload.success,
                message: action.payload.message,
            }

        case USER_LOGOUT: 
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message
            }
        
        case USER_AUTH:
            return {
                ...state,
                auth: action.payload.auth ? action.payload.auth : false,
                userData: action.payload.userData? action.payload.userData : null
            }

        case USER_SIGNUP:
            return {
                ...state,
                userData: action.payload.userData,
                success: action.payload.success,
                message: action.payload.message,
            }

        case USER_CHANGEPASS:
            return {
                ...state,
                userData: action.payload.userData,
                success: action.payload.success,
                message: action.payload.message,
            }

        case USER_CHANGECITY:
            return {
                ...state,
                userData: action.payload.userData,
                success: action.payload.success,
                message: action.payload.message,
            }

        case USER_DELETE:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message
            }

        case USER_BAN:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                bannedUser: action.payload.userData,
            }

        default: 
            return state
    }
}