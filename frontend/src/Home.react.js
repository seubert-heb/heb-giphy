import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class Home extends Component {
  checkLogin() {
    const { history } = this.props;
    let token = localStorage.getItem('token');
    if (token === '') {
      history.push('/');
    }

    fetch(`${process.env.REACT_APP_API_HOST}/login`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log(response);
      if (response.status === 200) {
        history.push('/gifs-search')
      } else {
        history.push('/login')
      }
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        {this.checkLogin()}
      </div>
    )
  }
}

export default withRouter(Home);
