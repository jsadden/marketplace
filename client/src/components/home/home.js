import React, {Component} from 'react'

//components
import Feed from './feed'
import AddPost from './addPost'
import SearchBar from './searchbar'

class Home extends Component {

    state= {
        loading: true,
        query: ''
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

    handleSearch = (query) => {
        this.setState({
            query: query
        })
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
                <SearchBar handleSearch={this.handleSearch}/>
                <AddPost/>
                <Feed routeToMessages={this.routeToMessages} filter={this.state.query}/>
            </div>
        )
    }
 }

export default Home