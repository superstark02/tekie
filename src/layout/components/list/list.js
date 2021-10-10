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
                    <div>
                        <input placeholder="Search" className="search-input" />

                    </div>

                    <div style={{margin:"20px 0px"}} >
                        TOTAL COUNT: {this.props.data.length}
                    </div>

                    {
                        this.props.data&&
                        this.props.data.map(item=>{
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