import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'

//redux
import {connect} from 'react-redux'
import {editPost} from '../../store/actions/postActions'


//form validation
const postSchema = Yup.object().shape({
    title: Yup.string().required('This is required'),
    description: Yup.string().required('This is required'),
    city: Yup.string().required('This is required'),
    price: Yup.number().required('This is required'),
    file: Yup.mixed().test('fileformat', 'Must be JPG or PNG', (file) => {
        if (!file) return true
        return ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
    })
})

class EditPost extends Component {

    state = {
        editorOpen: false,
        title: '',
        description: '',
        city: this.props.user.userData.city,
        price: '',
        imagePublicId: null,
        previewSource: null,
        postError: null
    }

    toggleEditor = () => {
        const [post] = this.props.posts.posts.filter(post => post._id === this.props.postId)

        this.setState({
            title: post.title,
            description: post.description,
            city: post.city,
            price: post.price,
            imagePublicId: post.imagePublicId,
            editorOpen: !this.state.editorOpen
        })
    }

    //send form data to server
    handlePost = (values, reset) => {
        values.file = this.state.previewSource

        const body = {
            ...values,
            id: this.props.postId,
            imagePublicId: this.state.imagePublicId
        }

        this.props.dispatch(editPost(body)).then(res => {

            //if successful, close preview and reset the form
            if (this.props.posts.success) {
                this.setState({previewSource: null})
                reset()
                this.toggleEditor()
            
            //if unsuccessful, set error
            } else {
                this.setState({postError: true})
            }
        })
        
    }

    // Show preview of image
    previewFile = (file) => {

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            this.setState({
                previewSource: reader.result, 
            })
        }
    }
    


    // Builds form
    buildEditor = () => {
        return (
            <div>
                <Formik
                    validationSchema={postSchema}
                    initialValues = {{
                        title: this.state.title,
                        description: this.state.description,
                        city: this.state.city,
                        price: this.state.price
                    }}
                    onSubmit = {(values, {resetForm}) => this.handlePost(values, resetForm)}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue
                    }) => (
                        <form onSubmit={handleSubmit}>

                            <div className='form-group'>
                                <label>Title of Post</label>
                                <input
                                    type='text'
                                    name='title'
                                    placeholder='Title'
                                    value={values.title}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    className='form-control'
                                />
                                {errors.title && touched.title ? 
                                    <div className='text-danger'>
                                        {errors.title}
                                    </div>
                                :null}
                            </div>
                            
                            <div className='form-group'>
                                <label>Description of item</label>
                                <textarea
                                    type='textarea'
                                    name='description'
                                    placeholder='Description of item'
                                    value={values.description}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    className='form-control'
                                />
                                {errors.description && touched.description ? 
                                    <div className='text-danger'>
                                        {errors.description}
                                    </div>
                                :null}   
                            </div>
                            
                            <div className='form-group'>
                                <label>Price of Item</label>
                                <input
                                    type='text'
                                    name='price'
                                    placeholder='Price'
                                    value={values.price}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    className='form-control'
                                />
                                {errors.price && touched.price ? 
                                    <div className='text-danger'>
                                        {errors.price}
                                    </div>
                                :null}  
                            </div>
                            
                            <div className='form-group'>
                                <label>Location</label>
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
                            
                            <div className='form-group'>
                                <label>Replace the Image</label>

                                <div className='row'>
                                    <input
                                        type='file'
                                        name='file'
                                        onBlur={handleBlur}
                                        accept='.png, .jpeg, .jpg'
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            if (!file) return

                                            setFieldValue('file', file)
                                            this.previewFile(file)
                                        }}
                                        className='form-control-file col-8'
                                    />
                                    
                                    {this.state.previewSource? 
                                        <img src={this.state.previewSource} alt='' className='col-4'>
                                        </img>
                                        
                                    :null}
                                </div>
                                
                                {errors.file && touched.file ? 
                                    <div className='text-danger'>
                                        {errors.file}
                                    </div>
                                :null}
                            </div>
                            
                            <div className='row justify-content-center'>
                                <button type='submit' className='btn btn-primary m-2'>
                                    Submit
                                </button>
                                <button onClick={()=>this.toggleEditor()} className='btn btn-secondary m-2'>
                                    Cancel
                                </button>
                            </div>
                            
                            {this.state.postError ? 
                                <div className='text-danger'>
                                    {this.props.posts.message}
                                </div>
                            :null}
                        </form>
                    )}
                    
                    
                </Formik>

                
            </div>
        )
    }


    render() {
        return(
            <div className='container'>
                
                {this.state.editorOpen?
                    <div className='row'>
                        <div className='col'>
                            {this.buildEditor()}
                        </div>
                    </div>
                    
                :
                
                    <div className='row justify-content-center'>
                        <button onClick={() => this.toggleEditor()} className='btn btn-primary m-3'>
                            Edit Post
                        </button>
                    </div>
                }
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

export default connect(mapStateToProps)(EditPost)