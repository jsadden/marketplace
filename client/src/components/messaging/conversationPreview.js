import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'


class ConversationPreview extends Component {

    state = {
        deletePending: false
    }

    toggleDelete = () => {
        this.setState({
            deletePending: !this.state.deletePending
        })
    }


    render() {
        let displayMessage = this.props.conversation.messages[this.props.conversation.messages.length - 1].message
        if (displayMessage.length > 50) {
            displayMessage = displayMessage.slice(0, 50) + '...'
        }

        return(

            <div key={this.props.conversation._id} className='row'>
                
                <div onClick={() => this.props.showCon(this.props.conversation._id, this.props.conversation.user1, this.props.conversation.user2)} className = 'col-10'>
                    
                    {this.props.conversation.user1 === this.props.user.userData.email ? 
                        <h5 className = 'col-9 font-weight-bold'>
                            {this.props.conversation.user2}
                        </h5>
                    :
                        <h5 className = 'col-9 font-weight-bold'>
                            {this.props.conversation.user1}
                        </h5>
                    }
                    <div >
                        {displayMessage}
                    </div>
                </div>

                <div className='col justify-content-right text-right'>
                    { this.state.deletePending ? 
                        <div className='row '>
                            Delete conversation?
                            <button onClick={() => this.props.deleteMe(this.props.conversation._id)} className='btn btn-primary m-1'>
                                Confirm
                            </button>
                            <button onClick={() => this.toggleDelete()} className='btn btn-secondary m-1'>
                                Cancel
                            </button>
                        </div>
                        
                    :
                        <button onClick={() => this.toggleDelete()} className='btn btn-primary'>
                            X
                        </button>
                    }
                    
                </div>
                
            </div>
        )
        
    }
 }

 function mapStateToProps(storeState) {
    return {
        user: storeState.user
    }
}

export default connect(mapStateToProps) (ConversationPreview)