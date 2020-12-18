import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'
import {deleteUser} from '../../store/actions/userActions'

class DeleteUser extends Component {

    state = {
        open: false,
        reqFailed: false
    }

    toggleForm = () => {
        this.setState({
            open: !this.state.open
        })
    }

    handleDelete = () => {
        this.props.dispatch(deleteUser()).then(res => {
            if (this.props.user.success) {

                //call parent method to push to login
                this.props.deleteMe()

            } else {
                this.setState({
                    reqFailed: true
                })
            }
        })
    }
  

    render() {
        if (this.state.open) {
            return(
                <div className='container justify-content-center text-center mt-5'>
                    
                    <div className='alert alert-danger m-1' role='alert'>
                        Are you absolutely sure? This is irreversible. If successful, you will be taken to the login page
                    </div>
                    <button onClick={() => this.handleDelete()} className='btn btn-danger m-2 mb-5'>
                        Delete my account
                    </button>
                    <button onClick={() => this.toggleForm()}  className='btn btn-secondary m-2 mb-5'>
                        Cancel
                    </button>
                    
                </div>
            )
        } else {
            return(
                <div className='container justify-content-center text-center mb-5 mt-5'>
                    <button onClick={() => this.toggleForm()}  className='btn btn-danger m-2'>
                        Delete your account
                    </button>
                </div>
            )
        }
    }
 }

function mapStateToProps(storeState) {
    return {
        user: storeState.user
    }
}

export default connect(mapStateToProps)(DeleteUser)