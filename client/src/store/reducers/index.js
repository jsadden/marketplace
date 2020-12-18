import {combineReducers} from 'redux'
import user from './userReducer'
import posts from './postReducer'
import conversation from './conversationReducer'

const rootReducer = combineReducers({
    user,
    posts,
    conversation
})

export default rootReducer
