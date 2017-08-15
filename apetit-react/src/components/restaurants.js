import React, { Component } from 'react'
import $ from 'jquery'
import axios from 'axios';
import { geolocated } from 'react-geolocated';
import Nav from './nav'
import RestaurantList from './restaurantlist'
import Search from './searchfrom'
import Restaurant from './restaurant'
import Cookies from '../helpers/Cookies';
import UserAuth from './UserAuth';
import Content from './Profile'


class Restaurants extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // later I'm goint to be passing latitude , longitud and also other parameters
            // restaurants that is cearched
            restaurant: "",
            // search ranged 
            range: 2,
            data: [],
            // result from api
            results: [],
            // saved in sata base table restaurants 
            saved:[],
            // modes to control what to display
            mode: false,
            current: false,
            // maybe to restrict the vote only one 
            user: false,
            // express route--- this change to heroku link
            url: 'http://localhost:8080',
            // current user 
            user_id:'',
            // remove this one from profile and here 
            longitude: 2, 
            // restaurants that is was voted from api search
            votedRestaurantId:'', 
            // user vote counter 
            user_vote: 0,
            // list of existing restaurants in db
            voted_restaurant_id:[],
            // index of the restaurant voted in api search
            votedIndex:'',
            // api restaurant id 
            apiRestaurantId:'', 
            // saves the restaurants saved by user id 
            idUserVoted:[], 
            // most voted restaurants near user 
            mostVoted:[], 
            // render only voted locations 
            renderVCount:[]
        }
    }

// when i loads it shows 
    componentDidMount() {
        this.initUser();
    }

    // user 
     initUser() {
        console.log(this.state.user);
        // get token from cookie 
        const token = Cookies.get('token');

        if (token && token !== ''){
            axios.get(`${this.state.url}/users/validate`, {
                params: { auth_token: token}
            })
            .then(res =>{
                console.log(res)
                // change the mode here to the mode of profile 
                this.setState({user:res.data, mode: 'content' })
            })
            .catch(err =>{
                Cookies.set('token', '')
                this.setState({user:false, mode:'auth'});           
            })

        }else{
            this.setState({mode:'auth'});
        }
    }
// mthod to set up the content for only users 
    setUser(user){
        Cookies.set('token', user.token);
        this.setState({user: user, mode: 'content'})
    }
// log out method 
logout(){
    Cookies.set('token', '');
    this.setState({user:false, mode:'auth'})
}
    // Search form change 
    handleSearchChange(event) {
        this.setState({ restaurant: event.target.value });
    }

    handleRangeChange(event) {
        this.setState({ range: event.target.value })
    }
    // Search Form Submit  for API
    handleSubmit(restaurant) {
        restaurant.preventDefault()
        let params = this.state.restaurant
        let range = this.state.range
        let longitude = this.props.coords.longitude
        let latitude = this.props.coords.latitude
        $.ajax({
            url: 'https://developers.zomato.com/api/v2.1/search?',
            headers: {
                'user-key': "f8e31b39444245028c418f9de012c9a7",
                'Content-Type': 'application/json'
            },
            data: {
                q: params,
                radius: range,
                latitude: latitude,
                longitud: longitude,
                cuisines: ""
            }
        }).done((data) => {
            console.log(data)
            this.setState({ results: this.parsedResults(data['restaurants']) })
        });
    }

    // parsed result from api
    parsedResults(data) {
        return data.filter(restaurant => {
            return restaurant['restaurant'] ? true : false
        }).map(restaurant => {
            return {
                restaurant_id: restaurant['restaurant'].id,
                name: restaurant['restaurant'].name ? restaurant['restaurant'].name : "N/A",
                location: restaurant['restaurant'].location.address ? restaurant['restaurant'].location.address : "N/A",
                latitude: restaurant['restaurant'].location.latitude ? restaurant['restaurant'].location.latitude : 40.7317696,
                longitude: restaurant['restaurant'].location.longitude ? restaurant['restaurant'].location.longitude : -73.9841161,
                averagecost: restaurant['restaurant'].R.average_cost_for_two ? restaurant['restaurant'].R.average_cost_for_two : "N/A",
                pricerange: restaurant['restaurant'].price_range ? restaurant['restaurant'].price_range : "N/A",
                thunmpic: restaurant['restaurant'].featured_image ? restaurant['restaurant'].featured_image : "https://static.pexels.com/photos/54455/cook-food-kitchen-eat-54455.jpeg",
                cuisines: restaurant['restaurant'].cuisines ? restaurant['restaurant'].cuisines : "N/A",
                ratingcolor: restaurant['restaurant'].user_rating.rating_color ? restaurant['restaurant'].user_rating.rating_color : "N/A",
                aggregaterating: restaurant['restaurant'].user_rating.aggregate_rating ? restaurant['restaurant'].user_rating.aggregate_rating : "N/A"
            }
        })
    }

// get restaurants info fron db/ 
// i don't need this one- i will use this one  just to get the new column that I will add to count the votes of that one 
     getRestaurants() {
        let id = this.state.user.id
        console.log(id)
      
        axios.get(` ${this.state.url}/api/${id}`)
            .then(data => {
                console.log(data);
                this.setState({
                    saved: data.data,
                    mode:"restaurants"
                })
            })
    }

// get restaurants count 
getVotedCount(){
    console.log("counting")
    axios.get(`${this.state.url}/votes/votes`)
     .then(data =>{
        this.setState({
            mostVoted:data.data,
        })
        console.log(data.data)
        this.mostVotedSpec()
    })
}


// Compare and get most voted restaurants info
mostVotedSpec(){
    console.log("most voted Specs")
     axios.get(`${this.state.url}/api/2`)
            .then(data =>{ 
                this.voteChecker(data.data) 
               console.log(data.data)
             })
}

// checks index to only display this 
voteChecker(data){
    console.log(data);
    let renderCountArr = []
    let votedData = this.state.mostVoted
    console.log(votedData);
    for(var i = 0; i< votedData.length; i++){
        for(var j=0; j<data.length; j++){

            if(votedData[i].restaurant_id === data[j].restaurant_id){
                let fountIt = data[i]
                renderCountArr.push(data[i])
            }  
         }
    } 
    this.renderVotes(renderCountArr);   
}

    renderVotes(data){
        console.log(data)
        this.setState({
            renderVCount:data
        })
    }
// get restaurant voted from voted table passes user id
getVotedRestaurants(){
    let userId = this.state.user.id
    axios.get(`${this.state.url}/votes/2/${userId}`)
    .then(data =>{
        this.setState({
            idUserVoted:data.data,
            mode:"restaurants"
        })
    })
}
// get the list of existing restaurantt ids on the db
    getvotes( userVoted, user_id,votedRestaurantsid, index){
        let indexPassed = index;
        axios.get(`${this.state.url}/api/1`)
            .then(data =>{ 
                this.setState({voted_restaurant_id:data.data})
                this.DatabaseIdCheck(userVoted, user_id, indexPassed);
             })
    }
// check if the rest id exist 
    DatabaseIdCheck(userVoted, user_id, index){
        let restresult= this.state.results
        // api restaurant id 
        let irestId = parseInt(this.state.apiRestaurantId)
        let restidState = this.state.voted_restaurant_id
        // containts ids of existinfg restautants in our data base 
        let idArray = []
        for(let i = 0; i < restidState.length; i++){
        idArray.push(restidState[i].restaurant_id)
        }
        let indexArray= idArray.indexOf(irestId)
                if(irestId === idArray[indexArray]){
                     this.postVote(userVoted, user_id);
                }else{
                    // now i gotta pass this info to save 
                    this.save(restresult[index])
                }  
                        //have one if that checks if already saved only console, log 
    }
// save the vote 
    postVote(uservoted, user_id){
         fetch(`${this.state.url}/votes`,{
                method:'POST', 
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                 body: JSON.stringify({
                    uservoted:uservoted,
                    user_id:user_id,
                    restaurant_id:this.state.apiRestaurantId
                 })
            }).then((response) => {
                console.log(response);
                return response.json()
            })
            .then((body) => {
                console.log(body)
            })

    }
    // post vote 
    vote(restaurant_id, index, voted= true){ 
        console.log("this is in vote", restaurant_id)
        let indexClicked = index
        this.setState( { user_vote: 1, votedIndex:index, apiRestaurantId:restaurant_id} )
        let user_id = this.state.user.id       
        // this one is going to be the array to update votes
        let userVoted = this.state.user_vote
        // this one updates sate from data base 
        let votedRestaurantsid = this.state.votedRestaurantsid
            this.getvotes(userVoted, user_id, votedRestaurantsid, indexClicked); 
    }
    // save restaurant from api 
    save(data) {
        console.log(data)
        let restaurant_id= data.restaurant_id
        let name = data.name
        let location = data.location
        let latitude =  data.latitude
        let longitude =  data.longitude
        let averagecost = data.averagecost
        let pricerange = data.pricerange
        let thunmpic = data.thunmpic
        let cuisines = data.cuisines
        let ratingcolor = data.ratingcolor
        let aggregaterating = data.aggregaterating
          console.log(cuisines)

        fetch(`${this.state.url}/api`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurant_id: restaurant_id, 
                    name: name,
                    location: location,
                    latitude: latitude,
                    longitude: longitude,
                    averagecost: averagecost,
                    pricerange: pricerange,
                    thunmpic: thunmpic,
                    cuisines: cuisines,
                    ratingcolor: ratingcolor,
                    aggregaterating: aggregaterating, 
                    user_id: this.state.user.id
                })
            })
            .then((response) => {
                console.log(response);
                return response.json()
            })
            .then((body) => {
                this.vote(this.state.apiRestaurantId, this.state.votedIndex)
             
            });
    }

    // delete data
    delete(restaurant, index){
        // the index of the box i want to dissapear 
        let id = this.state.user.id
        console.log(id)
        axios.delete(`${this.state.url}/votes/${restaurant}/${id}`)
            .then(res =>{
                this.setState(prev =>{
                    prev.idUserVoted = prev.idUserVoted.filter( s=> s.restaurant_id !== restaurant);
                    prev.mode = "restaurants";
                    prev.current = false;
                    return prev;
                })
            })
    }

    // mode changes from navbar and when click on one restaurant
    changeMode(mode, current = false) {
        this.setState(prev => {
            prev.mode = mode;
            prev.current = current;
            return prev;
        });
    }
    // sets the move when click on one reataurant 
    setRestaurant(restaurant) {
        console.log(restaurant)
        this.setState(prev => {
            prev.current = restaurant;
            prev.mode = "restaurant"
            return prev
        })
    }

    // view controller - what and what not to display 
    renderView() {
        if (this.state.mode === "search") {
            return ( 
                <div>
                <Nav 
                    saved={()=>{this.getVotedRestaurants()}}
                    changeMode = { this.changeMode.bind(this) }
                    logout={this.logout.bind(this)} 
                    mode={this.state.mode}
                /> 
                <Search 
                    searchValue = { this.state.restaurant } 
                    changeValue = { this.handleSearchChange.bind(this) } 
                    range = { this.state.range } 
                    changeRange = { this.handleRangeChange.bind(this) } 
                    submit = { this.handleSubmit.bind(this) }/> 
                 <RestaurantList 
                    restaurants = { this.state.results } 
                    setRestaurant = {this.setRestaurant.bind(this) } 
                    button = {{
                        onClick: this.vote.bind(this), 
                        text:'Vote'
                    }}
                /> 
                </div>               
            )
        }else if(this.state.mode === "restaurant") {
            return ( 
                <div>
                <Nav 
                    saved={()=>{this.getVotedRestaurants()}}
                    id={this.state.user}
                    changeMode = { this.changeMode.bind(this) }
                    logout={this.logout.bind(this)} 
                    mode={this.state.mode}
                    /> 
                <Restaurant 
                    restaurant= {this.state.current}
                />
                </div>
                ) 
        }else if (this.state.mode === "restaurants"){
            return (
                // this i have to pass the methods that communicate with the backend
                // use search to filter the saved info 
                <div>
                <Nav 
                    saved={()=>{this.getVotedRestaurants()}}
                    changeMode = { this.changeMode.bind(this) }
                    logout={this.logout.bind(this)} 
                    mode={this.state.mode}
                    /> 
                    <h1> Your Preferred Restaurants Nearby</h1>
                <RestaurantList 
                    restaurants = { this.state.idUserVoted} 
                    setRestaurant = { this.setRestaurant.bind(this) }
                    button = {{
                        onClick: this.delete.bind(this),
                        text:"delete"
                        }}
                        /> 
                 
                   
                </div >
            )
        }else if(this.state.mode === 'loading'){
      return(
        <div className="loading">
          <img src="https://s-media-cache-ak0.pinimg.com/originals/8b/a8/ce/8ba8ce24910d7b2f4c147359a82d50ef.gif"
            alt="loading" />
        </div>
      )
    } else if(this.state.mode === 'auth') {
      return (

        <UserAuth
          setUser={this.setUser.bind(this)}
          url={this.state.url}

        />

      )
    } else {
      return (
        <div>
             <Nav 
                saved={()=>{this.getRestaurants()}}
                changeMode = { this.changeMode.bind(this) }
                logout={this.logout.bind(this)} 
                 mode={this.state.mode}
            /> 


            <Content 
            logout={this.logout.bind(this)} 
            getVotedCount={()=>{this.getVotedCount()}}
            user={this.state.user} 
            />
            <div className="most-voted">

            <RestaurantList
            restaurants={this.state.renderVCount}
            setRestaurant = {this.setRestaurant.bind(this) } 
            button = {{
                        text:"Most Voted of the Week"
                        }}
                        /> 
            </div>

        </div>
      )
    }
    }

        // main render
        render() {

            return (

                !this.props.isGeolocationAvailable ?
                    // display input of text
                    <div > We are sorry but your browser does not support Geolocation < /div>
                    :!this.props.isGeolocationEnabled ? 
                    <div> Getting your inner foodie </div> :
                    this.props.coords ?
                    <div>
                    {this.renderView()} 
                    </div>: 
                    <div> Retriving suggestions </div>

            )
        }
    }


    export default geolocated({
        positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    })(Restaurants);