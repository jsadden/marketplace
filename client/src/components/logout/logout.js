import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'
import {logoutUser} from '../../store/actions/userActions'

class Logout extends Component {


    componentDidMount() {
        this.props.dispatch(logoutUser())
        .then(res => {
            if (this.props.user.success) {
                setTimeout(() => {
                    this.props.history.push('/login')
                }, 1000)
                
            }
        })
    }

    render() {

        return(
            <div className='container min-vh-100'>
                <h2 className='font-weight-bold text-center mt-5 pt-5'>
                    Logging out...
                </h2>
                
            </div>
        )
    }
 }

 function mapStateToProps(storeState) {
     return {
         user: storeState.user
     }
 }

export default connect(mapStateToProps) (Logout)