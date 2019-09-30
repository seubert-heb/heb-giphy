import React, { Component } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: null,
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    const { history } = this.props;
    let props = this.props

    event.preventDefault();

    fetch(`${process.env.REACT_APP_API_HOST}/${this.props.path}`, {
      method: 'post',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 404) {
        throw new Error("user not found");
      }
      if (response.status !== 200) {
        throw new Error("login failed")
      }
      return response.json();
    }).then(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', data.user);
      history.push('/gifs-search');
      props.onLogin(data.user);
    }).catch(err => {
      console.log(err);
      this.setState({'error': err.message})
    });
  }

  render() {
    let isLogin = this.props.path === 'login';
    return (
      <div className="Login">
        <Container>
          <Row>
            {this.state.error !== null &&
             <div className="errorMsg">
               {this.state.error}
             </div>
            }
            <h2>Log in now</h2>
          </Row>
          <Row>
            <form onSubmit={this.handleSubmit}>
              <Form.Group controlId="email" >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              {isLogin &&
              <Form.Text className="text-muted">Use the email you registered with</Form.Text>}
              </Form.Group>
              <Form.Group controlId="password" >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                />
              </Form.Group>
              <Button
                block
                size="lg"
                disabled={!this.validateForm()}
                type="submit"
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>
              {isLogin &&
               <div>Need to register? <Link to='/register'>Click here</Link></div>
              }
            </form>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Login);
