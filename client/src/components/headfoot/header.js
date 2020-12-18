import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'

//redux
import {connect} from 'react-redux'

class Header extends Component {

    render () {
        if (this.props.user.auth && window.location.pathname !== '/logout') {
            return (
                <div className="header p-3 w-100">
                    <div className="row justify-content-between align-items-center">
                        <div className='col'>
                            <h1 className='font-weight-bold light-text'>
                                Marketplace
                            </h1>
                            
                        </div>
                        <div className='col-sm-7  text-right'>
                            <nav >
                                <NavLink exact to={{pathname: '/'}} className='p-2 light-text' activeClassName='m-2 active'>Home</NavLink>
                                <NavLink to={{pathname: '/profile'}} className='p-2 light-text'>Profile</NavLink>
                                <NavLink to={{pathname: '/messages'}} className='p-2 light-text'>Messages</NavLink>
                                <NavLink to={{pathname: '/logout'}} className='p-2 light-text'>Logout</NavLink>
                                {this.props.user.userData.isAdmin ? 
                                    <NavLink to={{pathname: '/admin'}} className='p-2 light-text'>Dashboard</NavLink>
                                :null}
                            </nav>
                        </div>
                    </div>

                </div>
            )
        } else {
            return (
                <div className="header p-3 vw-100">
                    <div className="row">
                        <div className='col-4 '>
                            <h1 className='font-weight-bold light-text'>
                                Marketplace
                            </h1>
                        </div>
                    </div>
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

export default connect(mapStateToProps) (Header)