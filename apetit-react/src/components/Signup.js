import React, { Component } from 'react';
import axios from 'axios';
import {Button, Segment, Form} from 'semantic-ui-react'

// component for sign up
class SignUp extends Component {
  constructor(){
    super();
    this.state = { 
      inputs: {
        name: '',
        email: '',
        location:'',
        password: '',
        password_confirmation: ''
      }
    }
  }

  // method to sign up
  signUp(e){
    e.preventDefault(); 
    axios.post(`${this.props.url}/users`, this.state.inputs)
      .then(res => { 
        this.props.setUser(res.data);
      })
  }

  // method to change one of the inputs
  changeInput(e, input){
    const val = e.target.value;
    this.setState(prev => { 
      prev.inputs[input] = val;
      return prev;
    });
  }

  render(){
    return(
      <div className="auth-form">
        <h1>Sign Up</h1>

        <Segment inverted>
        <Form unstackable onSubmit={this.signUp.bind(this)}>
            <Form.Group widths={2}>
              <Form.Input label='Name'  
                placeholder='Name'
                value={this.state.inputs.name}
                id='name' name='name' type='text'
                onChange={e => this.changeInput(e, 'name')}
              />
              <Form.Input label='Email' 
                placeholder='Email'
                value={this.state.inputs.email}
                id='email' name='email' type='email'
                onChange={e => this.changeInput(e, 'email')}
              />

           </Form.Group>
            <Form.Input label='Location'  
                placeholder='Location' 
                value={this.state.inputs.location}
                id='location' name='Borough' type='text'
                onChange={e => this.changeInput(e, 'location')}
             />
          <Form.Group widths='equal'>

            <Form.Input 
                label='Password'  
                placeholder='Password' 
                value={this.state.inputs.password}
                id='password' name='password' type='password'
                onChange={e => this.changeInput(e, 'password')}
            />
            <Form.Input
                label='Password Confirmation'  
                placeholder='Password Confirmation' 
                value={this.state.inputs.password_confirmation}
                id='password_confirmation'
                name='password_confirmation' type='password'
                onChange={e => this.changeInput(e, 'password_confirmation')}
            />
          </Form.Group>

          
            <Button primary
            className="signup"
            type="submit" 
            >Sign Up</Button>

            <Button secondary 
            className="login"
            onClick={this.props.toggleMode} 
            >Log In</Button>
      

              
          

        </Form>
        </Segment>
      </div>
    )
  }
}

export default SignUp;
