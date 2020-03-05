import React, { Component } from 'react';
import { Container, Content, Text, Card, Header, Body, Button, Title, CardItem, Input } from 'native-base';
import { setUserInfo } from '../actions/index.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Config from "react-native-config";
import Helpers from './helpers.js';
console.log(Config.API_HOST)
class Login extends Component{
  state = {
    username: 'Username',
    password: 'Password',
    busy: false
  }
  gotoSellers() {
    this.props.navigation.navigate('Sellers')
  }
  componentDidMount() {
    if(this.props.username) {
      // this.gotoSellers()
    }
  }
  login() {
    this.setState({
      busy: true
    })
    fetch('http://' + Config.API_HOST + ':' + Config.API_PORT + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.code == 200) {
        console.log(responseJson.data.token)
        fetch('http://' + Config.API_HOST + ':' + Config.API_PORT + '/users/auth', {
          method: 'POST',
          headers: {
            'Authorization': responseJson.data.token,
          }
        })
        .then((response) => response.json())
        .then((responseJsonUser) => {
          if(responseJsonUser.data.usertype == 'USER') {
            this.props.setUserInfo({
              ...responseJsonUser.data,
              token: responseJson.data.token
            })
            this.gotoSellers()
          } else {
            Helpers.showFetchError('Not a User');
          }
          this.setState({
            busy: false
          })
        })
        .catch(() => {
          this.setState({
            busy: false
          })
        })
      } else {
        Helpers.showFetchError(responseJson.errors)
        this.setState({
          busy: false
        })
      }
    })
    .catch((e) => {
      Helpers.showFetchError(e)
      this.setState({
        busy: false
      })
    })
  }
  render(){
    return(
      <Container style={{}}>
        <Header>
          <Body>
            <Title>Login</Title>
          </Body>
        </Header>
        <Content padder>
            <Input
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 , marginBottom: 20}}
              onChangeText={(text) => this.setState({username: text})}
              value={this.state.username}
            />
            <Input
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 , marginBottom: 20}}
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.password}
            />
            <Button disabled={this.state.busy} blue style={{justifyContent: 'center', marginBottom: 20}} onPress={() => this.login()}>
              <Text>Login</Text>
            </Button>
            <Button disabled={this.state.busy} blue style={{justifyContent: 'center'}} onPress={() => this.props.navigation.navigate('Signup')}>
              <Text>Sign Up</Text>
            </Button>
        </Content>
      </Container>
    );
  }
}
function mapStateToProps(state){
  console.log('mapping', state)
  return{
    username : state.userinfo.username,
    usertype : state.userinfo.usertype,
  };
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setUserInfo: setUserInfo}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Login);
