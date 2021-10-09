import React, { useEffect } from "react";
import "./styles.css";
import gql from "graphql-tag";
import request from "./utils/request";

export default function App() {
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
    console.log(response);
  };

  useEffect(() => {
    fetchShips();
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
