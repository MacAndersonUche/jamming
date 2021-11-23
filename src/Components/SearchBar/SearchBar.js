
import React from 'react';
import './SearchBar.css'


class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        //added this.state setting term to and empty string
        this.state = {
            term: ''
        }

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    //onSearch now called like a function rather than using the = assignment operator
    search(term) {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(event) {
        this.setState({ term: event.target.value })
    }
    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />

                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )
    }
}
export default SearchBar;