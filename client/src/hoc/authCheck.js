import React, {Component} from 'react'
import {authenticateUser} from '../store/actions/userActions'
import {connect} from 'react-redux'

export default function authCheck(ComposedClass, shouldPushHome, adminOnly) {
    class AuthCheck extends Component {
        
        state = {
            loading: true
        }

        componentDidMount() {

            //api authentication check
            this.props.dispatch(authenticateUser())
            .then(res => {
                let auth = this.props.user.auth
                let isAdmin = this.props.user.userData ? this.props.user.userData.isAdmin : false

                //admin only routes
                if (adminOnly) {

                    //if admin continue
                    if (isAdmin) {
                        this.setState({loading: false})
                    
                    //if not admin push a 404
                    } else {
                        this.props.history.push('/404')
                        this.setState({loading: false})
                    }
                }

                //no user auth
                if (!auth) {
                    //push login page
                    this.props.history.push('/login')
                    this.setState({loading: false})

                } else {
                    this.setState({loading: false})

                    if (shouldPushHome) {
                        //push the home page
                        this.props.history.push('/')
                    }
                }
            })

        }

        render() {
            if (this.state.loading) {
                return(
                    <div>
                        LOADING
                    </div>
                )
            }

            return(
                <ComposedClass {...this.props} user={this.props.user}/>
            )
        }
    }

    function mapStateToProps(storeState) {
        return {
            user: storeState.user
        }
    }

    return connect(mapStateToProps)(AuthCheck)
}
