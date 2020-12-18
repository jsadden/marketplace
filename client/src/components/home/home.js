import React, {Component} from 'react'

//components
import Feed from './feed'
import AddPost from './addPost'


class Home extends Component {

    state= {
        loading: true
    }

    componentDidMount() {
        this.setState({
            loading: false
        })
    }

    //routes to conversation when a message is sent to a poster
    routeToMessages = (id) => {
        this.props.history.push('/messages/' + id)
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    Loading...
                </div>
            )
        }

        return(
            <div className='container min-vh-100'>
                <AddPost/>
                <Feed routeToMessages={this.routeToMessages}/>
            </div>
        )
    }
 }

export default Home