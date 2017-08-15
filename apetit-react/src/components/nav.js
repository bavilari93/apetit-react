import React from 'react';
import {Grid, Menu } from 'semantic-ui-react'
const Nav = (props) => {
    let mode = props.mode
    if(mode === 'auth'){
       return(
        <div></div>
        )

    }else if(mode === 'content'){
      return(

     <div className="nav">
      <Grid.Column width={4}>
          <Menu fluid vertical tabular>
            <Menu.Item 
               name='Liked Restaurants' 
               onClick={()=>{props.saved()}}
            />
            <Menu.Item 
               name='Search' 
               onClick={()=>{props.changeMode('search')}}
            />
            <Menu.Item 
                name='Log Out' 
                onClick={props.logout}
            />
          </Menu>
     </Grid.Column>
     </div>
    )
    }else if( mode === 'restaurants'){
      return(

        <div className="nav">
          <Menu fluid vertical tabular>
            <Menu.Item 
                name='Profile'
                onClick={()=>{props.changeMode('content')}}
            />
            <Menu.Item 
                name='Search' 
                onClick={()=>{props.changeMode('search')}}
            />
            <Menu.Item 
                name='Log Out' 
                onClick={props.logout}
            />
           </Menu>
        </div>
        )

    }else{

      return(
        <div className="nav">
          <Menu fluid vertical tabular>
              <Menu.Item
                 name='Profile'  
                 onClick={()=>{props.changeMode('content')}}
              />
              <Menu.Item 
                  name='Liked Restaurants' 
                  onClick={()=>{props.saved()}}
              />
              
              <Menu.Item 
                  name='Log Out' 
                  onClick={props.logout}
              />
          </Menu>
        </div>
    )
    }
  }
	// have soem logic here to when to display what on the nav bar 
 

export default Nav;