import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'


//redux
import {connect} from 'react-redux'
import {changeName} from '../../store/actions/userActions'


//validation schemas
const nameSchema = Yup.object().shape({
    firstName: Yup.string().required('This is required'),
    lastName: Yup.string().required('This is required')
})


class NameForm extends Component {

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

    handleNameChange = (values, reset) => {
        const body = {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim()
        }

        this.props.dispatch(changeName(body)).then(res => {
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

    buildNameForm = () => {
        return (
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: ''
                }}
                validationSchema={nameSchema}
                onSubmit = {(values, {resetForm}) => this.handleNameChange(values, resetForm)}
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
                            <label>New First Name</label>
                            <input
                                type='text'
                                name='firstName'
                                placeholder='First Name'
                                value={values.firstName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className='form-control'
                            />
                            {errors.firstName && touched.firstName ? 
                                <div className='text-danger'>
                                    {errors.firstName}
                                </div>
                            :null}
                        </div>
                        
                        <div className='form-group'>
                            <label>New Last Name</label>
                            <input
                                type='text'
                                name='lastName'
                                placeholder='Last Name'
                                value={values.lastName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className='form-control'
                            />
                            {errors.lastName && touched.lastName ? 
                                <div className='text-danger'>
                                    {errors.lastName}
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
                            {this.buildNameForm()}
                        </div>
                    </div>
                    
                </div>
            )
        } else {
            return(
                <div className='container justify-content-center text-center'>
                    <button onClick={() => this.toggleForm()} className='btn btn-primary m-3'>
                        Change your name
                    </button>
                    {this.state.displaySuccess ? 
                        <div className='alert alert-success m-1' role='alert'>
                            Name changed successfully
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

export default connect(mapStateToProps)(NameForm)