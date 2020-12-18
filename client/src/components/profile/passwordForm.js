import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'


//redux
import {connect} from 'react-redux'
import {changePass} from '../../store/actions/userActions'


//validation schemas
const passwordSchema = Yup.object().shape({
    password: Yup.string().min(8, 'Must be at least 8 characters long').required('This is required'),
    newPass: Yup.string().min(8, 'Must be at least 8 characters long').required('This is required'),
    confirmPass: Yup.string().min(8, 'Must be at least 8 characters long').required('This is required')
})


class PasswordForm extends Component {

    state = {
        open: false,
        reqFailed: false,
        displaySuccess: false
    }

    toggleForm = () => {
        this.setState({
            open: !this.state.open
        })
    }

    handlePassChange = (values, reset) => {
        const body = {
            password: values.password.trim(),
            newPassword: values.newPass.trim()
        }

        this.props.dispatch(changePass(body)).then(res => {
            if (this.props.user.success) {
                reset()
                this.setState({
                    reqFailed: false,
                    open: false,
                    displaySuccess: true
                })

            } else {
                this.setState({
                    reqFailed: true,
                    displaySuccess: false
                })
            }
        })
    }

    buildPassForm = () => {
        return (
            <Formik
                initialValues={{
                    password: '',
                    newPass: '',
                    confirmPass: ''
                }}
                validationSchema={passwordSchema}
                onSubmit = {(values, {resetForm}) => this.handlePassChange(values, resetForm)}
            >
                {({
                    handleBlur,
                    handleChange, 
                    handleSubmit,
                    values,
                    errors,
                    touched
                }) => (
                   <form onSubmit={handleSubmit}>

                        <div className='form-group'>
                            <label>Current password</label>
                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className='form-control'
                            />
                            {errors.password && touched.password ? 
                                <div className='text-danger'>
                                    {errors.password}
                                </div>
                            :null}
                        </div>
                        

                        <div className='form-group'>
                            <label>New password</label>
                            <input
                                type='password'
                                name='newPass'
                                placeholder='New Password'
                                value={values.newPass}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className='form-control'
                            />
                            {errors.newPass && touched.newPass ? 
                                <div className='text-danger'>
                                    {errors.newPass}
                                </div>
                            :null}
                        </div>
                        
                        <div className='form-group'>
                            <label>Confirm new password</label>
                            <input
                                type='password'
                                name='confirmPass'
                                placeholder='Confirm Password'
                                value={values.confirmPass}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className='form-control'
                            />
                            {errors.confirmPass && touched.confirmPass ? 
                                <div className='text-danger'>
                                    {errors.confirmPass}
                                </div>
                            :null}
                        </div>

                        <button type='submit' className='btn btn-primary m-2'>
                            Submit
                        </button>
                        <button onClick={() => this.toggleForm()} className='btn btn-secondary m-2'>
                            Cancel
                        </button>
                        {this.state.reqFailed ? 
                            <div className='text-danger'>
                                {this.props.user.message}
                            </div>
                        :null}

                   </form> 
                )}
            </Formik>
        )
    }

    render() {
        if (this.state.open) {
            return(
                <div className='container'>
                    <div className='row'>
                        <div className='col d-flex justify-content-center text-center'>
                            {this.buildPassForm()}
                        </div>
                    </div>
                </div>
            )
        } else {
            return(
                <div className='container justify-content-center text-center'>
                    <button onClick={() => this.toggleForm()} className='btn btn-primary m-3'>
                        Change your password
                    </button>
                    {this.state.displaySuccess ? 
                        <div className='alert alert-success m-1' role='alert'>
                            Password changed successfully
                        </div>
                    :null}
                </div>
            )
        }
        
    }
 }

function mapStateToProps(storeState) {
    return {
        user: storeState.user
    }
}

export default connect(mapStateToProps)(PasswordForm)