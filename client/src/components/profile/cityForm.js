import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'


//redux
import {connect} from 'react-redux'
import {changeCity} from '../../store/actions/userActions'


//validation schemas
const citySchema = Yup.object().shape({
    city: Yup.string().required('This is required')
})


class CityForm extends Component {

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

    handleCityChange = (values, reset) => {
        const body = {
            city: values.city.trim()
        }

        this.props.dispatch(changeCity(body)).then(res => {
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

    buildUserForm = () => {
        return (
            <Formik
                initialValues={{
                    city: ''
                }}
                validationSchema={citySchema}
                onSubmit = {(values, {resetForm}) => this.handleCityChange(values, resetForm)}
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
                            <label>New City</label>
                            <input
                                type='text'
                                name='city'
                                placeholder='City'
                                value={values.city}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className='form-control'
                            />
                            {errors.city && touched.city ? 
                                <div className='text-danger'>
                                    {errors.city}
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
                            {this.buildUserForm()}
                        </div>
                    </div>
                    
                </div>
            )
        } else {
            return(
                <div className='container justify-content-center text-center'>
                    <button onClick={() => this.toggleForm()} className='btn btn-primary m-3'>
                        Change your city
                    </button>
                    {this.state.displaySuccess ? 
                        <div className='alert alert-success m-1' role='alert'>
                            City changed successfully
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

export default connect(mapStateToProps)(CityForm)