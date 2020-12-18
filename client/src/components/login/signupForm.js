import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'

//redux
import {connect} from 'react-redux'
import {addUser} from '../../store/actions/userActions'

const signupFormSchema = Yup.object().shape({
    firstName: Yup.string().required('This is required'),
    lastName: Yup.string().required('This is required'),
    email: Yup.string().email('Please enter a valid email address').required('This is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('This is required'),
    passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('This is required'),
    city: Yup.string().required('This is required')
})

class SignUpForm extends Component {

    state = {
        email: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: '',
        city: '',
        signupFailed: false
    }

    handleSignup = (values) => {
        const body = {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            password: values.password.trim(),
            city: values.city.trim()
        }

        this.props.dispatch(addUser(body))
        .then(res => {

            //signup failed
            if (!this.props.user.success) {
                this.setState({signupFailed: true})

            //signup succeeded -- call parent method to push home page
            } else {
                this.props.handleSuccess()
            }
        })
    }

    render() {
        return(
            <Formik
                validationSchema = {signupFormSchema}
                initialValues = {{
                    email: this.state.email,
                    password: this.state.password,
                    passwordConfirm: this.state.passwordConfirm,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    city: this.state.city
                }}
                onSubmit = {values => this.handleSignup(values)}
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
                                name='firstName'
                                value={values.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='First Name'
                                className='form-control'
                            />
                            {errors.firstName && touched.firstName ? 
                                <div className='text-danger'>
                                    {errors.firstName}
                                </div>
                            :null}
                        </div>
                        
                        <div className='form-group'>
                            <input
                                type='text'
                                name='lastName'
                                value={values.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='Last Name'
                                className='form-control'
                            />
                            {errors.lastName && touched.lastName ? 
                                <div className='text-danger'>
                                    {errors.lastName}
                                </div>
                            :null}
                        </div>

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

                        
                        <div className='form-group'>
                            <input
                                type='password'
                                name='passwordConfirm'
                                value={values.passwordConfirm}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='Confirm your password'
                                className='form-control'
                            />
                            {errors.passwordConfirm && touched.passwordConfirm ? 
                                <div className='text-danger'>
                                    {errors.passwordConfirm}
                                </div>
                            :null}
                        </div>


                        <div className='form-group'>
                            <input
                                type='text'
                                name='city'
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='City'
                                className='form-control'
                            />
                            {errors.city && touched.city ? 
                                <div className='text-danger'>
                                    {errors.city}
                                </div>
                            :null}
                        </div>

                        <button type='submit' className='btn btn-primary'>
                            Sign Up
                        </button>
                        {this.state.signupFailed ? 
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

export default connect(mapStateToProps)(SignUpForm)