import React, { Component } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import GifList from "./GifList.react.js";

class GifSearch extends Component {
  constructor(props) {
    super(props);

    const { history } = this.props;

    let token = localStorage.getItem('token');
    if (token === '' || token === null) {
      history.push('/login');
    }

    this.state = {
      searchTerm: '',
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    const { history } = this.props;

    event.preventDefault();
    let token = localStorage.getItem('token');
    if (token === '') {
      history.push('/');
    }

    let url = new URL(`${process.env.REACT_APP_API_HOST}/gifs`),
        params = {search: this.state.searchTerm};
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (response.status === 404) {
        throw new Error("user not found");
      }
      if (response.status !== 200) {
        const myJson = response.json().then(function(d) { return d; });
        console.log("error data");
        console.log(JSON.stringify(myJson));
        throw new Error("login failed");
      }
      return response.json();
    }).then(data => {
      // TODO: Make sure we pass on the array only
      this.props.onNewGifs(data.gifs);
    }).catch(err => {
      console.log(err);
      this.setState({'error': err.message});
      localStorage.clear();
      history.push('/login');
    });
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <form onSubmit={this.handleSubmit}>
              <Form.Group controlId='searchTerm' size='lg'>
                <Form.Label>Gif Search</Form.Label>
                <Form.Control
                  value={this.state.searchTerm}
                  onChange={this.handleChange}
                  type='text'
                />
              </Form.Group>
              <Button
                block
                size='lg'
                type='submit'
              >
                Search
              </Button>
            </form>
          </Row>
          <Row>
            <GifList gifs={this.props.gifs} />
          </Row>
        </Container>
      </div>
    )
  }
}

export default withRouter(GifSearch);
