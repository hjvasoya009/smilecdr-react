import React, { Component } from "react";
// import { getPatients } from "./services";
import Table from "./components/Table";
import Practitioner from "./components/Practitioner";

class App extends Component {
  // componentDidMount() {
  //   getPatients().then((res) => {
  //     console.log(res);
  //   });
  // }
  render() {
    return (
      <div>
        {/* <p>
          Check the console!
        </p> */}
        <Table />
        <Practitioner />
      </div>

    );
  }
}

export default App;
