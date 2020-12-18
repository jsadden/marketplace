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

export default function posts(state = {}, action) {
    switch (action.type) {

        case CONVERSATION_ADD:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                conversation: [action.payload.conversation]
            }
        
        case CONVERSATION_GET_ONE: {
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                conversation: [action.payload.conversation]
            }
        }

        case CONVERSATION_GET_BY_ID: {
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                conversation: [action.payload.conversation]
            }
        }

        case CONVERSATION_GET_ALL: {
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                conversation: action.payload.conversation
            }
        }

        case CONVERSATION_ADD_MESSAGE: {
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                conversation: action.payload.conversation ? [action.payload.conversation] : state.conversation
            }
        }

        case CONVERSATION_DELETE_PATCH: {

            //default to current state
            let deleted = [...state.conversation]

            if (action.payload.conversation) {
                //get matching post from array, remove deleted post
                deleted = state.conversation.filter(con => con._id !== action.payload.conversation._id)
                
            }

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                conversation: deleted
            }
        }

        case CONVERSATION_DELETE_GET: {

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                deleteMe: action.payload.deleteMe 
            }
        }

        case CONVERSATION_DELETE: {

            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
            }
        }


        default: 
            return {
                ...state
            }
    }
}