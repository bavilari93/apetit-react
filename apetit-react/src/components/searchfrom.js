import React, { Component } from 'react'
import { Input,Label, Button } from 'semantic-ui-react'

class Search extends Component {

    render() {
        return (

            <form className = "search-restaurant"
                onSubmit = { this.props.submit.bind(this) } 
            >            
            <Input 
                icon='search' 
                placeholder='Search...' 
                type = "text"
                name = "content"
                value = { this.props.searchValue } onChange = {
                            (event) => {
                                this.props.changeValue(event)
                            }
                        }
             /> 
            <input type = "range"
                name = "content"
                ref = "range"
                value = { this.props.range } min = "1"
                max = "11"
                onChange = {
                    (e) => { this.props.changeRange(e) } }
            />
             <Label basic color='grey' pointing='left'>Radious: {this.props.range} mi.</Label>
            <div className= "search-button">
                <Button 
                    
                    type = "submit"
                    value = "submit"
                >
                Search
                </Button>
            </div>
            </form>

        )
    }


}

export default Search;