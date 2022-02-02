'use strict';

var React = require('react');
var Button = require('./Button.react');
var Modal = require('./Modal.react');
var useState = React.useState,
    useEffect = React.useEffect,
    useMemo = React.useMemo;

var helpers = require('../../utils/helpers');

var isElectron = function isElectron() {
  // return true;
  return window.require != null;
};
if (helpers) {
  isElectron = helpers.isElectron; // HACK to centralize function
  // if possible
}
var remote = null;
if (isElectron()) {
  remote = window.require('electron');
}

var QuitButton = function QuitButton(props) {
  var isInGame = props.isInGame,
      dispatch = props.dispatch;


  if (!isInGame && !isElectron()) return null;

  var buttonStyle = isInGame ? {} : {
    margin: 5,
    borderRadius: 8,
    left: 5
  };
  return React.createElement(
    'div',
    {
      style: buttonStyle
    },
    React.createElement(Button, {
      label: 'Quit',
      onClick: function onClick() {
        if (!isInGame) {
          remote.webFrame.context.close();
        } else {
          quitGameModal(dispatch);
        }
      }
    })
  );
};

var quitGameModal = function quitGameModal(dispatch) {
  dispatch({ type: 'STOP_TICK' });

  var returnToMainMenuButton = {
    label: 'Main Menu',
    onClick: function onClick() {
      dispatch({ type: 'DISMISS_MODAL' });
      dispatch({ type: 'RETURN_TO_LOBBY' });
    }
  };
  var returnToGameButton = {
    label: 'Return to Game',
    onClick: function onClick() {
      dispatch({ type: 'DISMISS_MODAL' });
      dispatch({ type: 'START_TICK' });
    }
  };
  var quitAppButton = {
    label: 'Quit Application',
    onClick: function onClick() {
      remote.webFrame.context.close();
    }
  };
  var buttons = [returnToGameButton, returnToMainMenuButton];
  if (isElectron()) {
    buttons.push(quitAppButton);
  }

  var body = React.createElement('div', null);

  dispatch({ type: 'SET_MODAL',
    modal: React.createElement(Modal, {
      title: 'Quit Game?',
      body: body,
      buttons: buttons
    })
  });
};

module.exports = QuitButton;