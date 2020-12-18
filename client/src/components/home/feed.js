import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'
import {getPostsByCity} from '../../store/actions/postActions'

//components
import EditPost from './editPost'
import DeletePost from './deletePost'
import MessagePoster from './messagePoster'

class Feed extends Component {


    componentDidMount() {
        this.props.dispatch(getPostsByCity(this.props.user.city, 10))
    }



    render() {
        return(
            <div>
                { this.props.posts.posts?
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
                            {post.userEmail === this.props.user.userData.email ? 
                                <div>
                                    <EditPost postId={post._id} />
                                    <DeletePost postId={post._id} />
                                </div>
                            :
                                <div>
                                    <MessagePoster poster={post.userEmail} routeToMessages={this.props.routeToMessages}/>
                                </div>
                            }
                        </div>
                    ))
                :
                    <div>
                        Loading posts...
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

export default connect(mapStateToProps)(Feed)