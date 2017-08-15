import React, { Component } from 'react';
import axios from 'axios';
import {Button, Segment, Form} from 'semantic-ui-react'


class Login extends Component {
  constructor(){
    super();
    // set default state
    this.state = {
      // we have 2 inputs that we will be changing
      inputs: {
        email: '',
        password: ''
      }
    }
  }

  // method to log in
  login(e){
    e.preventDefault(); // prevent default form action
    // send request to make sure the email and password are correct
    axios.post(`${this.props.url}/login`, this.state.inputs)
      .then(res => { // set the user based off of the response
        this.props.setUser(res.data);
      })
  }

  // method to change an input
  changeInput(e, input){
    const val = e.target.value;
    this.setState(prev => { // sets the state for that input to the value
      prev.inputs[input] = val;
      return prev;
    });
  }

  render(){
    return(
      <div className="auth-form">
        <h1>Log In</h1>

        <Segment inverted>
        <Form unstackable onSubmit={this.login.bind(this)}>

          <label htmlFor='email'>Email</label>
          <Form.Input 
                label='Name'  
                placeholder='Name' value={this.state.inputs.email}
                id='email' name='email' type='email'
                onChange={e => this.changeInput(e, 'email')}
          />

          <label htmlFor='password'>Password</label>
          <Form.Input 
                label='Password'  
                placeholder='Password'
                value={this.state.inputs.password}
                id='password' name='password' type='password'
                onChange={e => this.changeInput(e, 'password')}
          />

            <Button primary
            className="login"
             type="submit" 
             >Login</Button>
            <Button secondary 
            onClick={this.props.toggleMode} 
            className="signup">Sign Up</Button>

        </Form>
        </Segment>
      </div>
    )
  }
}
export default Login;
