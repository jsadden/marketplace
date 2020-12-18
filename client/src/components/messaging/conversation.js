import React, {Component} from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'

//redux
import {connect} from 'react-redux'
import {getConversationById, addMessage} from '../../store/actions/conversationActions'

//message validation
const messageValidation = Yup.object().shape({
    message: Yup.string().required('This is required')
})

class Conversation extends Component {

    state = {
        loading: true,
        con: null,
        reqFailed: false,
        stamp: null,
        showStampId: null
    }

    componentDidMount() {

        //if there's a conversation in the state object
        if (this.props.conversation.conversation) {
            this.setState({
                con: this.props.conversation.conversation[0],
                loading: false
            })

        } else {
        //get conversation by id and user email
            const url = window.location.pathname
            const urlArr = url.split('/')
            const id = urlArr.pop()
            this.props.dispatch(getConversationById(id)).then(res => {
                if (this.props.conversation.success) {
                    this.setState({
                        con: this.props.conversation.conversation[0],
                        loading: false
                    })
                }
            })
        }
    }

    showStamp = (timestamp, id) => {
        this.setState({
            stamp: timestamp,
            showStampId: id
        })
    }

    hideStamp = () => {
        this.setState({
            stamp: null,
            showStampId: null
        })
    }

    //send message
    handleSend = (values, resetForm) => {
        //add to existing conversation
        let id = this.props.conversation.conversation[0]._id
        const body = {
            id: id,
            message: values.message
        }
        this.props.dispatch(addMessage(body)).then(res => {
            if (this.props.conversation.success) {

                this.setState({
                    reqFailed: false,
                    con: this.props.conversation.conversation[0]
                })
                resetForm()
            } else {
                this.setState({reqFailed: true})
            }
        })
        
    }


    buildMessageBox = () => {
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


                        <button type='submit' className='btn btn-primary'>
                            Send
                        </button>
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
        if (this.state.loading) {
            return(
                <div>
                    Loading...
                </div>
            )
        }
        
        return(
            <div className='container min-vh-100 mt-5'>
                <h3 className='font-weight-bold my-3'>
                    {this.state.con.user1 === this.props.user.userData.email ? 
                        this.state.con.user2
                    : this.state.con.user1}
                </h3>
                {this.state.con.messages.map(message => {
                    
                    if ((message.sentByUser1 && this.state.con.user1 === this.props.user.userData.email) || (!message.sentByUser1 && this.state.con.user2 === this.props.user.userData.email)) {
                        return (
                            <div key={message._id} className = 'row m-2'>
                                
                                <div className='col-3'></div>
                                <div className='col-9 text-right'>
                                    <div 
                                        className='message-to  rounded p-1 px-2 '
                                        onMouseEnter={() => this.showStamp(message.timestamp, message._id)}
                                        onMouseLeave={() => this.hideStamp()}
                                    >
                                        {message.message}
                                    </div>
                                    {this.state.showStampId === message._id ? 
                                        <div className='text-right'>
                                            {this.state.stamp}
                                        </div>
                                    :null}
                                </div>
                                
                            </div>
                        )
                    } else {
                        
                        return (
                            <div key={message._id} className = 'row m-2'>
                                <div className='col-9 text-left'>
                                    <div 
                                        className='message-from  rounded p-1 px-2 ' 
                                        onMouseEnter={() => this.showStamp(message.timestamp, message._id)}
                                        onMouseLeave={() => this.hideStamp()}
                                    >
                                        {message.message}
                                    </div>
                                    {this.state.showStampId === message._id ? 
                                        <div className=''>
                                            {this.state.stamp}
                                        </div>
                                    :null}
                                </div>
                                
                            </div>
                        )
                    }
                    
                })}
                <div className='mt-5'>
                    {this.buildMessageBox()}
                </div>
                
            </div>
        )
    }
 }

function mapStateToProps(storeState) {
    return {
        conversation: storeState.conversation,
        user: storeState.user
    }
}

export default connect(mapStateToProps)(Conversation)