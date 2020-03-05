import React, { Component } from 'react';
import allReducers from './reducers/index.js';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';
import Login from './components/login.js';
import Sellers from './components/sellers.js';
import Timeslots from './components/timeslots.js';
import Signup from './components/signup.js';
import { PersistGate } from 'redux-persist/integration/react'
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { Root } from 'native-base';

const Stack = createStackNavigator();
const persistConfig = {
  key: 'userinfo',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, allReducers)
const store = createStore(persistedReducer)
const persistor = persistStore(store)
export default class App extends Component{
  render(){
    return(
      <Provider store= {store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
          <NavigationContainer>
            <Stack.Navigator headerMode='none'>
              <Stack.Screen
                name="Login"
                component={Login}
              />
              <Stack.Screen
                name="Sellers"
                component={Sellers}
              />
              <Stack.Screen
                name="Timeslots"
                component={Timeslots}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
              />
            </Stack.Navigator>
          </NavigationContainer>
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}
