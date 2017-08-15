import React, { Component } from 'react';
import './App.css';
import Restaurants from './components/restaurants'

class App extends Component {

    render() {
        return ( 
        	<div className = "App" >
            <Restaurants/>
            </div>
        );
    }
}

export default App;