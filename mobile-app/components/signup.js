import React, { Component } from 'react';
import { Container, Content, Text, Card, Header, Body, Button, Title, CardItem, Input, Toast } from 'native-base';
import { setUserInfo } from '../actions/index.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Config from "react-native-config";
import Helpers from './helpers.js';
class Signup extends Component{
  state = {
    username: 'Username',
    password: 'Password',
    busy: false
  }
  gotoLogin() {
    this.props.navigation.navigate('Login')
  }
  signup() {
    this.setState({
      busy: true
    })
    fetch('http://' + Config.API_HOST + ':' + Config.API_PORT + '/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        usertype: 'USER',
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.code == 200) {
        this.gotoLogin()
      } else {
        Helpers.showFetchError(responseJson.errors)
        this.setState({
          busy: false
        })
      }
    })
    .catch((e) => {
      Helpers.showFetchError('Cannot reach the server')
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
            <Title>Signup</Title>
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
            <Button disabled={this.state.busy} blue style={{justifyContent: 'center'}} onPress={() => this.signup()}>
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
export default connect(mapStateToProps, matchDispatchToProps)(Signup);
