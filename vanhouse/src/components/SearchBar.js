import { getDefaultNormalizer } from '@testing-library/react';
import { Dropdown ,MenuItem,Input} from 'bootstrap';
import React,{useState}from 'react'
import PropTypes from 'prop-types'
import {InputGroup, Button, FormControl, DropdownButton,ButtonToolbar} from 'react-bootstrap';
import search from '../assets/search.png';
import '../styles/searchbar.css';

function SearchBar({getData, setQuery, userId}){
    const [leftState,setLeftState] = useState(0);
    // const [Click,setClick] = useState({getData, setQuery})


    const [low, setLow] = useState("");
    const [high, setHigh] = useState("");
    const [location, setLocation] = useState("city");
    const [keyword, setKeyword] = useState("");

    const handleSelect = (e) => {
        //   setLocation(Number(e.target.value));
        setLocation(e.target.value);
    }

    function Cancel() {
        setLocation("city");
        setLow("");
        setHigh("");
        setKeyword("");
        setQuery("");
    }

    function searchByCondition() {
        if(low !== "" && high !== "" && Number(low) > Number(high)){
            alert("Incorrect price range");
            return;
        }
        const url = `/search?low=${low}&high=${high}&location=${location}&keyword=${keyword}&userid=${userId}`;
        setQuery(url);
    }

    function searchAll() {
        setLocation("city");
        setLow("");
        setHigh("");
        setKeyword("");
        setQuery(`/posts`);
    }

    return(
        <div className="style row">
            <select onChange={(e)=>handleSelect(e)} value={location} className="citys">
                <option value="city">City</option>
                <option value="Vancouver">Vancouver</option>
                <option value="Burnaby">Burnaby</option>
                <option value="Richmond">Richmond</option>
            </select>
            <InputGroup.Text className="">Price:</InputGroup.Text>
            <FormControl className="price-num" type="text" value={low}
                         onChange={(e) => {
                             setLow(e.target.value);
                         }}
            />
            <InputGroup.Text className="">-</InputGroup.Text>
            <FormControl className="price-num2" type="text" value={high}
                         onChange={(e) => {
                             setHigh(e.target.value);
                         }}
            />
            <FormControl className="col keyword" placeholder="Keyword"  value={keyword}
                         onChange={(e) => {setKeyword(e.target.value);}}/>
            <Button variant="outline-secondary " onClick={() => searchByCondition()}>
                <img src={search} alt="Search" className="imgstyle"/>
            </Button>

            <Button variant="outline-secondary " onClick={() => Cancel()}>
                Cancel
            </Button>

        </div>
    )
}

SearchBar.propTypes = {
    getData: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
};

export default SearchBar;
