import React, {Component} from 'react'
import * as Yup from 'yup'
import {Formik} from 'formik'

//redux
import {connect} from 'react-redux'
import {getPostsByCity} from '../../store/actions/postActions'


//validation schemas
const searchSchema = Yup.object().shape({
    city: Yup.string().required('This is required'),
    query: Yup.string()
})


class SearchBar extends Component {

    state = {
        city: this.props.user.userData.city,
        reqFailed: false,
        query: ''
    }

    handleCityChange = (values) => {

        let city = values.city.trim()
        city = city.charAt(0).toUpperCase() + city.slice(1)

        this.props.dispatch(getPostsByCity(city)).then(res => {
            if (!this.props.posts.success) {
                this.setState({reqFailed: true})

            } else {
                this.setState({
                    reqFailed: false,
                    city: city
                })
                this.props.handleSearch(values.query.trim())
            }
        })
    }

    buildCityForm = () => {
        return (
            <Formik
                initialValues={{
                    city: this.state.city,
                    query: this.state.query
                }}
                validationSchema={searchSchema}
                onSubmit = {(values) => this.handleCityChange(values)}
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

                       <div className='row align-items-center justify-content-between mt-2'>
                           <div className='form-group col-4 my-3'>
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

                            <div className='form-group col-6 my-3'>
                                <input
                                    type='text'
                                    name='query'
                                    value={values.query}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder='Search...'
                                    className='form-control'
                                />
                                
                            </div>
                            
                            <div className='col-2 text-right my-3'>
                                <button type='submit' className='btn btn-primary'>
                                    Search
                                </button>
                            </div>
                            
                       </div>
                        
                        
                        
                        
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

    render(){
        return(
            <div>
                
                {this.buildCityForm()}

                <h3 className='font-weight-bold'>
                    Showing results in {this.state.city} 
                </h3>
            </div>
        )
    }
}

function mapStateToProps(storeState) {
    return {
        user: storeState.user,
        posts: storeState.posts
    }
}

export default connect(mapStateToProps)(SearchBar)

