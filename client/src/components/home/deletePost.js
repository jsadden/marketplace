import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'
import {deletePost} from '../../store/actions/postActions'


class DeletePost extends Component {

    state = {
        postId: this.props.postId,
        deletePending: false,
        deleteError: false
    }

    toggleDeletion = () => {
        this.setState({deletePending: !this.state.deletePending})
    }

    //send deletion to server
    handleDelete = () => {

        const body = {
            id: this.state.postId
        }

        this.props.dispatch(deletePost(body)).then(res => {

            //if unsuccessful, set error
            if (!this.props.posts.success) {
                this.setState({deleteError: true})
            }
        })
        
    }

    render() {
        return(
            <div className='container'>
                {this.state.deletePending ? 
                    <div>
                        <div className='alert alert-danger m-2 text-center' role='alert'> 
                            Are you sure you want to delete this post? 
                        </div>
                        
                        <div className='row justify-content-center'>
                            <button onClick={() => this.handleDelete()} className='btn btn-danger m-2'>
                                Confirm
                            </button>
                            <button onClick={() => this.toggleDeletion()} className='btn btn-secondary m-2'>
                                Cancel
                            </button>
                        </div>
                        {this.state.deleteError ? 
                            <div className='text-danger'>
                                {this.props.posts.message}
                            </div>
                        :null}
                    </div>
                :   
                    <div className='row justify-content-center'>
                        <button onClick={() => this.toggleDeletion()} className='btn btn-danger'>
                            Delete this post
                        </button>
                    </div>
                    
                }
                
            </div>
        )
    }
 }

function mapStateToProps(storeState) {
    return {
        user: storeState.user,
        posts: storeState.posts
    }
}

export default connect(mapStateToProps)(DeletePost)