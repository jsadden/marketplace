import React, {Component} from 'react'
import Header from '../components/headfoot/header'
import Footer from '../components/headfoot/footer'

class MainLayout extends Component {

    render() {

        return(
            <>
                <Header />
                {this.props.children}
                <Footer/>
            </>
        )
        
    }
 }

export default MainLayout
