import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = { token: '', backend: '', backend2: '' };
  }

  async componentDidMount() {
    try {
      const request = await fetch('/.auth/me');
      const response = await request.json();
      const jsonString = JSON.stringify(response)
      console.log('String: ' + jsonString);
      const jsonArray = JSON.parse(jsonString)
      console.log('Array: '+ jsonArray);
      var id_token =jsonArray[0].id_token;  // or jsonArray[0].access_token
      console.log('Token: '+ id_token);
      this.setState({ token: jsonArray[0].id_token });
      if (jsonArray !== undefined) {

        axios({
          method: 'get',
          url: 'https://adamlashapim.azure-api.net/alnodejs/helloWorld',
          headers: {'Authorization': "Bearer " + id_token, 'Accept' : 'application/json', 'Content-Type': 'application/json'},
          cancelToken: new axios.CancelToken((token) => {
          this.cancelToken = token;
          })
        })
        .then((res) => {
          this.cancelToken = null;
          this.setState({ backend2: JSON.stringify(res.data), init:1 });
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          Token from Azure AD: { this.state.token }
        </p>
        <p className="App-intro">
          Values from Backend using axios: { this.state.init ? this.state.backend2 : <div>loading</div> }
        </p>
      </div>
    );
  }

}

export default App;
