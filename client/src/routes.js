import React from 'react'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'

//components
import Home from './components/home/home'
import Login from './components/login/login'
import Logout from './components/logout/logout'
import Profile from './components/profile/profile'
import Messaging from './components/messaging/messaging'
import Conversation from './components/messaging/conversation'
import AdminHome from './components/adminHome/adminHome'
import NotFound from './components/notFound/notFound'

//hoc
import authCheck from './hoc/authCheck'
import MainLayout from './hoc/mainLayout'

const Routes = () => {
    return (
        <BrowserRouter>
            <MainLayout>
                <Switch>
                    <Route path='/admin' component={authCheck(AdminHome, false, true)}/>
                    <Route path='/messages/:id' component={authCheck(Conversation)}/>
                    <Route path='/messages' component={authCheck(Messaging)}/>
                    <Route path='/profile' component={authCheck(Profile)}/>
                    <Route path='/logout' component={authCheck(Logout)}/>
                    <Route path='/login' component={authCheck(Login, true)}/>
                    <Route path='/' exact component={authCheck(Home)}/>
                    <Route path='/404' exact component={authCheck(NotFound)}/>
                    <Redirect to='/404' component={authCheck(NotFound)}/>
                </Switch>
            </MainLayout>
        </BrowserRouter>
    )
}

export default Routes