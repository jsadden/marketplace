import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'

//components
import PasswordForm from './passwordForm'
import CityForm from './cityForm'
import NameForm from './nameForm'

class ProfileUserData extends Component {

    render() {
        return(
            <div>
                <h2 className='font-weight-bold'>
                    Edit Your Profile:
                </h2>
                <NameForm/>
                <hr className='m-2'/>
                <CityForm/>
                <hr className='m-2'/>
                <PasswordForm/>
                <hr className='m-2'/>
            </div>
        )
    }
 }

function mapStateToProps(storeState) {
    return {
        user: storeState.user
    }
}

export default connect(mapStateToProps)(ProfileUserData)