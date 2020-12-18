import React, {Component} from 'react'
import { Formik } from "formik";
import * as Yup from "yup";

//redux
import {loginUser} from '../../store/actions/userActions'
import {connect} from 'react-redux'

const loginSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email address').required('This is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('This is required'),
})

class LoginForm extends Component {

    state = {
        email: '',
        password: '',
        loginFailed: null
    }

    handleLogin = (values) => {
        values.email = values.email.trim()
        values.password = values.password.trim()

        this.props.dispatch(loginUser(values)).then(res => {
            if (!this.props.user.success) {
                this.setState({loginFailed: true})
            } else {

                //if successful, call parent method to push home page
                this.props.handleSuccess()
            }
        })
        
    }


    render() {
        return(
            <Formik
                validationSchema = {loginSchema}
                initialValues = {{
                    email: this.state.email,
                    password: this.state.password
                }}
                onSubmit = {values => this.handleLogin(values)}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <input
                                type='text'
                                name='email'
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='Email'
                                className='form-control'
                            />
                            {errors.email && touched.email ? 
                                <div className='text-danger'>
                                    {errors.email}
                                </div>
                            :null}
                        </div>
                        

                        <div className='form-group'>
                            <input
                                type='password'
                                name='password'
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='Password'
                                className='form-control'
                            />
                            {errors.password && touched.password ? 
                                <div className='text-danger'>
                                    {errors.password}
                                </div>
                            :null}
                        </div>


                        <button type='submit' className='btn btn-primary'>
                            Login
                        </button>
                        {this.state.loginFailed ? 
                            <div className='text-danger'>
                                {this.props.user.message}
                            </div>
                        :null}

                    </form>
                )}

            </Formik>
        )
    }
 }


function mapStateToProps(storeState) {
    return {
        user: storeState.user
    }
}

export default connect(mapStateToProps)(LoginForm)