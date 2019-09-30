import React, { Component } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Favorite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      errorMsg: null,
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  submitCategory = event => {
    event.preventDefault();

    const { history } = this.props;

    let token = localStorage.getItem('token');
    if (token === '') {
      history.push('/login');
    }

    console.log('categorizing', this.props.faveId, 'as', this.state.category);
    let payload = {
      'fave_id': this.props.faveId,
      'category': this.state.category
    }

    fetch(`${process.env.REACT_APP_API_HOST}/category`, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (response.status !== 200) {
        throw new Error('categorizing failed');
      }
      // TODO: Fix bug where calling this.props.onCategoryUpdate breaks everything
    }).catch(err => {
      this.setState({'errorMsg': err});
    });
  }

  validateForm() {
    return this.state.category !== '';
  }

  render() {
    return (
      <span className='favorite'>
        <Row>
          <img className='displayGif' src={this.props.src} alt='favorite gif' />
        </Row>
        <Row><h4>Categories</h4></Row>
        {this.props.categories !== null && this.props.categories.map((cat) =>
          <Row key={cat}>
            <div className='category'>
              {cat}
            </div>
          </Row>
        )}
        <Row>
          <form onSubmit={this.submitCategory}>
            <Form.Group controlId='category' >
              <Form.Label>New Category</Form.Label>
              <Form.Control
                autoFocus
                value={this.state.category}
                onChange={this.handleChange}
              />
            </Form.Group>
            {this.state.errorMsg !== null &&
             this.state.errorMsg}
            <Button
              block
              size="sm"
              disabled={!this.validateForm()}
              type="submit"
            >
              Categorize!
            </Button>
          </form>
        </Row>
      </span>
    )
  }
}

export default withRouter(Favorite);
