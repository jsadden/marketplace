import React, {Component} from 'react'
import LoginForm from './loginForm'
import SignUpForm from './signupForm'

class Login extends Component {

    state = {
        signup: false
    }

    //toggles which form to show
    toggleForm = () => {
        this.setState({
            signup: !this.state.signup
        })
    }

    //called when user successfully signs up or logs in -- routes to home
    handleSuccess = () => {
        this.props.history.push('/')
    }

    render() {

        return(
            <div className='container min-vh-100'>
                <div className='row justify-content-center align-items-center '>
                    
                    <div className='pt-5 p-3 mt-5 col-2 d-flex justify-content-center text-center '>
                        <button
                            className='btn btn-secondary'
                            disabled={!this.state.signup}
                            onClick={() => this.toggleForm()}
                        >
                            Log In
                        </button>
                    </div>

                    <div className='pt-5 p-3 mt-5 col-2 d-flex justify-content-center text-center'>
                        <button
                            className='btn btn-secondary'
                            disabled={this.state.signup}
                            onClick={() => this.toggleForm()}
                        >
                            Sign Up
                        </button>
                    </div>
                    {this.state.signup ? 
                        
                            <div className='col-12 pt-5 d-flex justify-content-center text-center'>
                                <SignUpForm handleSuccess = {this.handleSuccess}/>
                            </div>
                        
                    :
                        
                            <div className='col-12 pt-5 d-flex justify-content-center text-center'>
                                <LoginForm handleSuccess = {this.handleSuccess}/>
                            </div>
                        
                    }

                    
                </div>
                
                


                

            </div>
        )
    }
 }

export default Login