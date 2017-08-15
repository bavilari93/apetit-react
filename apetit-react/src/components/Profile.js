import React from 'react';
import { Grid, Segment, Button } from 'semantic-ui-react'

// component that renders content
// this will render when there is a valid user
const Content = (props) => {
  return(
    <div className="profile">
      <Grid.Column stretched width={12}>
        <Segment>
          <h1>Welcome, {props.user.name}</h1>
          <p>Search your restaurants near You</p>
          <p>These are the Restaurants remmended for you:</p>
        </Segment>
      </Grid.Column>

      <Button 
      onClick={()=>{props.getVotedCount()}}>Reveal near</Button>
        </div>
  )
}

export default Content;
