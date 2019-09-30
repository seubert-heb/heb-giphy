import React, { Component } from "react";
import { Badge, Button, Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import './GifList.scss';

class GifList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'error': null,
    };
  }

  onFavorite = fave => {
    const { history } = this.props;
    let token = localStorage.getItem('token');
    if (token === '') {
      history.push('/');
    }
    let user = localStorage.getItem('user');

    console.log(fave);
    let payload = {
      'user_email': user,
      'url': fave
    }

    fetch(`${process.env.REACT_APP_API_HOST}/favorites`, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (response.status === 404) {
        throw new Error("user not found");
      }
      if (response.status !== 200) {
        throw new Error("favorite failed")
      }
      return response.json();
    }).then(data => {
      history.push('/gifs-search');
    }).catch(err => {
      console.log(err);
      this.setState({'error': err.message})
    });
  }

  render() {
    return (
      <div>
        <Container className='gifList'>
          {this.props.gifs.map((gif) =>
            <span key={gif.url}>
              <img className='displayGif' src={gif.url} alt="gif result" />
              <Badge>{gif.favorite ? 'Faved!' : 'Not faved'}</Badge>
              <Button
                size='sm'
                variant='info'
                onClick={() => this.onFavorite(gif.url)}
              >
              Favorite
              </Button>
            </span>
          )}
        </Container>
      </div>
    )
  }
}

export default withRouter(GifList);
