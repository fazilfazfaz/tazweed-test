import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Container, Content, Text, Card, Header, Body, Button, Title, CardItem, Input, Toast } from 'native-base';
import { setUserInfo } from '../actions/index.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Config from 'react-native-config';

class Timeslots extends Component {
  state = {
    timeslots: []
  }
  showToast(text) {
    Toast.show({
      text: text
    })
  }
  requestAppointment(item) {
    switch(item.approval_status) {
      case 'APPROVED':
        return this.showToast('Appointment already approved')
      case 'PENDING':
        return this.showToast('Appointment pending')
      case 'NOTREQUESTED':
      case 'REJECTED':
        fetch('http://' + Config.API_HOST + ':' + Config.API_PORT + '/appointments/create_request', {
          method: 'POST',
          headers: {
            'Authorization': this.props.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            seller_id: item.user_id,
            timeslot_id: item._id
          })
        })
        .then((response) => response.json())
        .then((json) => {
          this.loadTimeslots()
          this.setState({
            timeslots: json.data
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
  loadTimeslots() {
    fetch('http://' + Config.API_HOST + ':' + Config.API_PORT + '/timeslots/by_user_id?user_id=' + this.props.route.params.seller_id, {
      headers: {
        'Authorization': this.props.token,
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      this.setState({
        timeslots: json.data
      })
    })
    .catch((e) => {
      console.log(e)
    })
  }
  getStatusText(item) {
    switch(item.approval_status) {
      case 'APPROVED':
        return 'Already Approved';
      case 'REJECTED':
        return 'Once Rejected - Request Again';
      case 'PENDING':
        return 'Pending Approval';
      case 'NOTREQUESTED':
        return 'Request Now';
    }
  }
  componentDidMount() {
    this.loadTimeslots()
  }
  render() {
    return (
      <Container style={{}}>
        <Header>
          <Body>
            <Title>Timeslots</Title>
          </Body>
        </Header>
        <Content padder>
          <Text>
            Please select a timeslot from the list below:
          </Text>
          <View style={{backgroundColor: 'black', height: 2}}></View>
          <FlatList
          ItemSeparatorComponent={() => <View style={{
            height: 1,
            width: "100%",
            backgroundColor:"black"
          }} />}
          data={this.state.timeslots}
          renderItem={({item}) => {
            return <Text onPress={() => {
              this.requestAppointment(item)
            }} style={styles.item}>
              {item.from + ' to ' + item.to + ' --- ' + this.getStatusText(item)}
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
export default connect(mapStateToProps, matchDispatchToProps)(Timeslots);
