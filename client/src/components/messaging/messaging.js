import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'
import {getConversationsByUser, getConversation, getConversationForDelete, deleteConversationForUser, deleteConversation} from '../../store/actions/conversationActions'

//components
import ConversationPreview from './conversationPreview'

class Messaging extends Component {

    state = {
        loading: true,
        empty: false,
    }

    componentDidMount() {
        this.props.dispatch(getConversationsByUser()).then(res => {
            if (this.props.conversation.success) {
                this.setState({loading: false})
            }
        })
    }

    handleConversationClick = (id, user1, user2) => {
        let otherUser = user1
        if (user1 === this.props.user.userData.email) {
            otherUser = user2
        }

        //get specific conversation
        this.props.dispatch(getConversation(otherUser)).then(res => {
            if (this.props.conversation.success) {
                //send to specific conversation route
                this.props.history.push('/messages/' + id)
            }
        })
    }

    handleDelete = (id) => {
        //run delete patch
        this.props.dispatch(deleteConversationForUser({id: id})).then( res => {

            if (this.props.conversation.success) {

                //run full delete check
                this.props.dispatch(getConversationForDelete(id)).then(res => {

                    if (this.props.conversation.success && this.props.conversation.deleteMe) {

                        //run delete if both parties deleted
                        this.props.dispatch(deleteConversation({id:id}))
                    }
                })
            }
        })
        
    }

    

    render() {
        if (this.state.loading) {
            return(
                <div>
                    Loading
                </div>
            )
        } else {
            
            return(
                <div className='container min-vh-100'>
                    {this.props.conversation.conversation.length === 0 ? 
                        <h2 className='text-center mt-5 pt-5'>
                            You have no conversations!
                        </h2>
                    :
                        <div className='mt-5'>
                            <h2 className='font-weight-bold'>
                                Messages:
                            </h2>
                            <hr/>
                            {this.props.conversation.conversation.map(conversation => {
                                return (
                                    <div>
                                        <ConversationPreview key={conversation._id} deleteMe={this.handleDelete} showCon={this.handleConversationClick} conversation={conversation} />
                                        <hr/>
                                    </div>
                                )
                            })}
                        </div>

                        
                    }
                </div>
            )
        }
        
    }
 }

function mapStateToProps(storeState) {
    return {
        conversation: storeState.conversation,
        user: storeState.user
    }
}

export default connect(mapStateToProps)(Messaging)