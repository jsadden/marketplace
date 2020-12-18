import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'
import {getPostsByUser} from '../../store/actions/postActions'


//components
import DeletePost from '../home/deletePost'
import EditPost from '../home/editPost'


class ProfileFeed extends Component {

    state = {
        loading: true,
        posts: []
    }

    componentDidMount() {
        this.props.dispatch(getPostsByUser()).then(res => {
            if (this.props.posts.success) {
                this.setState({
                    posts: this.props.posts.posts,
                    loading: false
                })
            }
        })
    }


    render() {

        if (this.state.loading) {
            return (
                <div>
                    Loading posts...
                </div>
            )
        }

        return(
            <div className='mt-5'>
                <h2 className='font-weight-bold'>
                    Your Posts:
                </h2>
                { this.props.posts && this.props.posts.posts.length > 0?
                    this.props.posts.posts.map((post) => (
                        <div key={post._id} className='jumbotron'>

                            <h3 className='font-weight-bold text-center'>
                                {post.title}
                            </h3>

                            <h4 className='text-success font-weight-bold text-center'>
                                {'$' + post.price}
                            </h4>
                            

                            <div className='row justify-content-center'>
                                <img src={post.imagePath} alt='' className='col-8 justify-self-center'/>
                            </div>

                            
                            <div className='text-center m-2 p-2'>
                                {post.description}
                            </div>
                            <div>
                                <EditPost postId={post._id}/>
                                <DeletePost postId={post._id} />
                            </div>
                        </div>
                    ))
                :
                    <div className='m-5'>
                        You haven't posted anything yet!
                    </div>
                }
            </div>
        )
    }
 }

function mapStateToProps(storeState) {
    return {
        posts: storeState.posts,
        user: storeState.user
    }
}

export default connect(mapStateToProps)(ProfileFeed)