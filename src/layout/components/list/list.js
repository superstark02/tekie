import React, { Component } from 'react';
import ListItem from './list-item/list-item';
import "./list.css"

var filteredList = null

class MyList extends Component {
    
    state = {
        search: null
    }

    render() {

        filteredList = this.props.data
        
        if (this.state.search !== null) {
            filteredList = this.props.data.filter(
                item =>
                    item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1 
            )
        }

        return (
            <div className="wrap" >
                <div style={{width:"600px"}} >
                    <div className="input-ctn" >
                        <input onChange={(e)=>{this.setState({search:e.target.value})}} placeholder="Search" className="search-input" />
                        <img width="20px" alt="search" src="https://img.icons8.com/windows/50/000000/search--v1.png"/>
                    </div>

                    <div style={{margin:"20px 0px"}} >
                        TOTAL COUNT: {filteredList.length}
                    </div>

                    {
                        filteredList&&
                        filteredList.map(item=>{
                            return(
                                <div>
                                    <ListItem data={item} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default MyList;