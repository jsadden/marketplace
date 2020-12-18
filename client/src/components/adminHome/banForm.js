import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'


//redux
import {connect} from 'react-redux'
import {banUser} from '../../store/actions/userActions'


//validation schemas
const banSchema = Yup.object().shape({
    email: Yup.string().email('Enter a valid email').required('This is required'),
    banDays: Yup.number('Please enter a number').required('This is required')
})


class BanForm extends Component {

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

    handleBan = (values, reset) => {
        const body = {
            email: values.email.trim(),
            banDays: values.banDays.trim()
        }

        this.props.dispatch(banUser(body)).then(res => {
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

    buildBanForm = () => {
        return (
            <Formik
                initialValues={{
                    email: '',
                    banDays: ''
                }}
                validationSchema={banSchema}
                onSubmit = {(values, {resetForm}) => this.handleBan(values, resetForm)}
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
                            <label>Email to ban</label>
                            <input
                                type='text'
                                name='email'
                                placeholder='email'
                                value={values.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className='form-control'
                            />
                            {errors.email && touched.email ? 
                                <div className='text-danger'>
                                    {errors.email}
                                </div>
                            :null}
                        </div>
                        
                        <div className='form-group'>
                            <label>Ban duration in days</label>
                            <input
                                type='text'
                                name='banDays'
                                placeholder='Days'
                                value={values.banDays}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className='form-control'
                            />
                            {errors.banDays && touched.banDays ? 
                                <div className='text-danger'>
                                    {errors.banDays}
                                </div>
                            :null}
                        </div>

                        <button type='submit' className='btn btn-primary m-3'>
                            Submit
                        </button>
                        <button onClick={() => this.toggleForm()} className='btn btn-secondary m-3'>
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
                <div className='container justify-content-center text-center'>
                    <div className='row'>
                        <div className='col d-flex justify-content-center text-center'>
                            {this.buildBanForm()}
                        </div>
                    </div>
                </div>
            )
        } else {
            return(
                <div className='container justify-content-center text-center'>
                    <button onClick={() => this.toggleForm()} className='btn btn-primary'>
                        Ban a user
                    </button>
                    {this.state.displaySuccess ? 
                        <div className='alert alert-success m-3' role='alert'>
                            User banned successfully
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

export default connect(mapStateToProps)(BanForm)