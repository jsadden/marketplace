import React, {Component} from 'react'

//redux
import {connect} from 'react-redux'

//components
import BanForm from './banForm'

class AdminHome extends Component {

    state = {
        loading: true
    }

    componentDidMount() {
        this.setState({
            loading: false
        })
    }


    render() {
        if (this.state.loading) {
            return (
                <div>
                    Loading...
                </div>
            )
        }

        return(
            <div className='container min-vh-100'>
                <h2 className='font-weight-bold m-5'>
                    ADMIN HOME
                </h2>
                
                <BanForm />
            </div>
        )
    }
 }

 function mapStateToProps(storeState) {
    return {
        user: storeState.user
    }
}

export default connect(mapStateToProps)(AdminHome)