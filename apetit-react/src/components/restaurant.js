import React from 'react'
import { Card, Image, Button } from 'semantic-ui-react'


const Restaurant = ( props)=>{
	console.log(props)
	return(

			<Card  className="search-info" >

					<Image src={props.restaurant.thunmpic} alt={props.restaurant.name}/>
					<h1>
					{props.restaurant.name}
	           		</h1>
	           		<Card.Meta>
								Average Cost: {props.restaurant.averagecost}
								Price Range for Two: {props.restaurant.pricerange}
					</Card.Meta>
					<Card.Description>
						Cusine: {props.restaurant.cuisines}
					</Card.Description>

					<Card.Meta>
						<span>location: {props.restaurant.location}</span>
						</Card.Meta>
			</Card>

		)
}

export default Restaurant;