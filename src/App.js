import React, { useEffect, useState } from "react";
import "./styles.css";
import gql from "graphql-tag";
import request from "./utils/request";
import AppBar from "./layout/components/app-bar/appbar";
import MyList from "./layout/components/list/list";

export default function App() {

  const [data, setData] = useState(null)
  
  const fetchShips = async () => {
    const response = await request(gql`
      {
        ships {
          name
          home_port
          image
        }
      }
    `);
    console.log(response.data.ships);
    setData(response.data.ships);
  };

  useEffect(() => {
    fetchShips();
  }, []);

  return (
    <div className="App">
      <AppBar />
      {
        data ? (
          <MyList data={data} /> 
        ) : (
          <div style={{color:"white", textAlign:"center"}} >Loading....</div>
        )
      }
    </div>
  );
}
