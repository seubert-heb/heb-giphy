import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Favorites from './Favorites.react.js';
import GifSearch from './GifSearch.react.js';
import Home from './Home.react.js';
import Login from './Login.react.js';
import './app.scss';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gifs: [],
      user: localStorage.getItem('user'),
      isLoggingOut: false
    };
  }

  onNewGifs = newGifs => {
    this.setState({gifs: newGifs});
  }

  onLogin = user => {
    this.setState({user: user, isLoggingOut: false})
  }

  logOut = () => {
    localStorage.clear();
    this.setState({user: '', gifs: [], isLoggingOut: true});
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar bg='dark' >
            <Navbar.Brand><Link to='/'>heb-giphy</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav>
                <Nav.Item className='nav-item'><Link to='/gifs-search'>Gifs</Link></Nav.Item>
                <Nav.Item className='nav-item'><Link to='/faves'>Favorites</Link></Nav.Item>
              </Nav>
            </Navbar.Collapse>
            <Nav className='justify-content-end user-text' activeKey='/home'>
              <Nav.Item>
                {this.state.user}
              </Nav.Item>
              {(this.state.user === '' || this.state.user === null) ?
               <Nav.Item><Button href='/login'>Log in</Button></Nav.Item> :
               <Nav.Item><Button onClick={this.logOut}>Log out</Button></Nav.Item>}
              {this.state.isLoggingOut === true && <Redirect to='/login' />}
            </Nav>
          </Navbar>

          <Switch>
            <Route path='/faves'>
              <Favorites />
            </Route>
            <Route path='/login'>
              <Login onLogin={this.onLogin} path='login' />
            </Route>
            <Route path='/register'>
              <Login onLogin={this.onLogin} path='user' />
            </Route>
            <Route path='/gifs-search'>
              <GifSearch gifs={this.state.gifs} onNewGifs={this.onNewGifs} />
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
