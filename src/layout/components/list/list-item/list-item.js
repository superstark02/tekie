import React, { Component } from 'react';
import "./list-item.css"

class ListItem extends Component {
    render() {        
        return (
            <div>
                <div>
                    <img width="100%" alt="ship" src={this.props.data.image} />
                </div>
                <div className="details" >
                    <div>
                        {this.props.data.name}
                    </div>
                    <div>
                        <div>
                            Port: {this.props.data.home_port}
                        </div>
                        <div>
                            {this.props.data.roles}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListItem;