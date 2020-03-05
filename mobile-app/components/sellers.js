import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Container, Content, Text, Card, Header, Body, Button, Title, CardItem, Input } from 'native-base';
import { setUserInfo } from '../actions/index.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Config from 'react-native-config';

class Sellers extends Component {
  state = {
    sellers: []
  }
  gotoSellerTimeslots(seller_id) {
    this.props.navigation.navigate('Timeslots', {
      seller_id: seller_id
    })
  }
  loadSellers() {
    console.log('using ' + this.props.token)
    fetch('http://' + Config.API_HOST + ':' + Config.API_PORT + '/sellers', {
      headers: {
        'Authorization': this.props.token,
      }
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        sellers: json.data
      })
    })
    .catch((e) => {

    })
  }
  componentDidMount() {
    this.loadSellers()
  }
  render() {
    return (
      <Container style={{}}>
        <Header>
          <Body>
            <Title>Sellers</Title>
          </Body>
        </Header>
        <Content padder>
          <Text>
            Please select a seller from the list below:
          </Text>
          <View style={{backgroundColor: 'black', height: 2}}></View>
          <FlatList
          ItemSeparatorComponent={() => <View style={{
            height: 1,
            width: "100%",
            backgroundColor:"black"
          }} />}
          data={this.state.sellers}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => {
            return <Text onPress={() => {
              this.gotoSellerTimeslots(item._id)
            }} style={styles.item}>
              {item.username}
            </Text>
          }}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

function mapStateToProps(state){
  console.log('mapping', state)
  return{
    token : state.userinfo.token,
  };
}
function matchDispatchToProps(dispatch){
  return bindActionCreators({setUserInfo: setUserInfo}, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Sellers);
