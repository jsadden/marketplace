import React, {Component} from 'react'

//components
import ProfileFeed from './profileFeed'
import ProfileUserData from './profileUserData'
import DeleteUser from './deleteUser'

class Profile extends Component {

    handleDelete = () => {
        this.props.history.push('/login')
    }

    render() {
        return(
            <div className='container min-vh-100'>
                <ProfileFeed/>
                <ProfileUserData/>
                
                <DeleteUser deleteMe={this.handleDelete}/>
            </div>
        )
    }
 }

export default Profile