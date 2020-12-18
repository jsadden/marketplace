import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'


//redux
import {connect} from 'react-redux'
import {addConversation, getConversation, addMessage} from '../../store/actions/conversationActions'

//message validation
const messageValidation = Yup.object().shape({
    message: Yup.string().required('This is required')
})


class MessagePoster extends Component {

    state = {
        open: false,
        reqFailed: false
    }

    //check for existing conversation & send message
    handleSend = (values, resetForm) => {

        this.props.dispatch(getConversation(this.props.poster)).then(res => {
            if (this.props.conversation.success) {
                //add to existing conversation
                let id = this.props.conversation.conversation[0]._id
                const body = {
                    id: id,
                    message: values.message
                }
                this.props.dispatch(addMessage(body)).then(res => {
                    if (this.props.conversation.success) {

                        //route to full conversation -- method called in home component
                        this.props.routeToMessages(id)
                    } else {
                        this.setState({reqFailed: true})
                    }
                })

            } else {
                //add a new one
                const body = {
                    user2: this.props.poster,
                    messages: [
                        {sentByUser1: true, message: values.message}
                    ]
                }
                this.props.dispatch(addConversation(body)).then(res => {
                    if (this.props.conversation.success) {
                        let id = this.props.conversation.conversation[0]._id
                        
                        //route to full conversation -- method called in home component
                        this.props.routeToMessages(id)
                    } else {
                        this.setState({reqFailed: true})
                    }
                })
            }
        })
    }

    toggleOpen = () => {
        this.setState({open: !this.state.open})
    }

    //open messager box
    buildDialog = () => {
        return (
            <Formik
                initialValues= {{
                    message: ''
                }}
                validationSchema={messageValidation}
                onSubmit={(values, {resetForm} ) => this.handleSend(values, resetForm)}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched
                }) => (
                    <form onSubmit={handleSubmit}>

                        <div className='form-group'>
                            <textarea
                                type='textarea'
                                name='message'
                                value={values.message}
                                onChange={handleChange}
                                className='form-control'
                                placeholder='Message...'
                            />
                            {errors.message && touched.message ? 
                                <div className='text-danger'>
                                    {errors.message}
                                </div>
                            :null}
                        </div>

                        <div className='row justify-content-center'>
                            <button type='submit' className='btn btn-primary m-2'>
                                Send
                            </button>
                            <button onClick={() => this.toggleOpen()} className='btn btn-secondary m-2'>
                                Cancel
                            </button>
                        </div>
                        
                        {this.state.reqFailed ? 
                            <div className='text-danger'>
                                {this.props.conversation.message}
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
                    {this.buildDialog()}
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <div className='row justify-content-center'>
                        <button onClick={() => this.toggleOpen()} className='btn btn-primary m-2'>
                            Message Poster
                        </button>
                    </div>
                    
                </div>
            )
        }
    }
 }

function mapStateToProps(storeState) {
    return {
        conversation: storeState.conversation,
        user: storeState.user
    }
}

export default connect(mapStateToProps)(MessagePoster)