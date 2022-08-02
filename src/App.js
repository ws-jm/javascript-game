import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'

import "./app.css";
import { Fragment, useEffect, useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

import Logo from './assets/amber-logo.svg';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpandArrowsAlt,
  faMicrophoneSlash
} from "@fortawesome/free-solid-svg-icons";
import {
  faDiscord,
  faTwitter,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";


import getConfig from './config'
const { networkId } = getConfig('production')

// This is the context that Unity will use to communicate with the React app.
const unityContext = new UnityContext({
  productName: "React Unity WebGL Tests",
  companyName: "Jeffrey Lanters",
  // The url's of the Unity WebGL runtime, these paths are public and should be
  // accessible from the internet and relative to the index.html.
  loaderUrl: "https://my-unity-metaverse.ams3.digitaloceanspaces.com/5.loader.js",
  dataUrl: "https://my-unity-metaverse.ams3.digitaloceanspaces.com/5.data",
  frameworkUrl: "https://my-unity-metaverse.ams3.digitaloceanspaces.com/5.framework.js",
  codeUrl: "https://my-unity-metaverse.ams3.digitaloceanspaces.com/5.wasm",
  streamingAssetsUrl: "https://my-unity-metaverse.ams3.digitaloceanspaces.com/StreamingAssets",
  // Additional configuration options.
  webglContextAttributes: {
    preserveDrawingBuffer: true,
  },
});



export default function App() {
  function sendWalletIdToGame() {
    unityContext.send("WalletProvider", "SetWallet", window.accountId);
    console.log('Sending wallet id to game!!!!!!!!!!!')
  }
  // use React Hooks to store greeting in component state
  const [greeting, set_greeting] = React.useState()

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {

        // window.contract is set by initContract in index.js
        window.contract.get_greeting({ account_id: window.accountId })
          .then(greetingFromContract => {
            set_greeting(greetingFromContract)
          })
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  )


  const [isUnityMounted, setIsUnityMounted] = useState(true);
  // const [rotationSpeed, setRotationSpeed] = useState(30);
  const [cubeRotation, setCubeRotation] = useState(0);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [saidMessage, setSaidMessage] = useState("Nothing");
  const [isLoaded, setIsLoaded] = useState(false);
  const [progression, setProgression] = useState(0);

  // When the component is mounted, we'll register some event listener.
  useEffect(() => {
    unityContext.on("canvas", handleOnUnityCanvas);
    unityContext.on("progress", handleOnUnityProgress);
    unityContext.on("loaded", handleOnUnityLoaded);
    // unityContext.on("RotationDidUpdate", handleOnUnityRotationDidUpdate);
    // unityContext.on("ClickedPosition", handleOnUnityClickedPosition);
    // unityContext.on("Say", handleOnUnitySayMessage);
    // When the component is unmounted, we'll unregister the event listener.
    return function () {
      unityContext.removeAllEventListeners();
    };
  }, []);

  // When the rotation speed has been updated, it will be sent to Unity.
  // useEffect(() => {
  //   unityContext.send("MeshCrate", "SetRotationSpeed", rotationSpeed);
  // }, [rotationSpeed]);

  // Built-in event invoked when the Unity canvas is ready to be interacted with.
  function handleOnUnityCanvas(canvas) {
    canvas.setAttribute("role", "unityCanvas");
  }

  // Built-in event invoked when the Unity app's progress has changed.
  function handleOnUnityProgress(progression) {
    setProgression(progression);
  }

  // Built-in event invoked when the Unity app is loaded.
  function handleOnUnityLoaded() {
    setIsLoaded(true);
    setTimeout(function () { sendWalletIdToGame(); }, 5000);
  }

  // Custom event invoked when the Unity app sends a message indicating that the
  // rotation has changed.
  // function handleOnUnityRotationDidUpdate(degrees) {
  //   setCubeRotation(Math.round(degrees));
  // }

  // Custom event invoked when the Unity app sends a message indicating that the
  // mouse click position has changed.
  // function handleOnUnityClickedPosition(x, y) {
  //   setClickPosition({ x, y });
  // }

  // Custom event invoked when the Unity app sends a message including something
  // it said.
  // function handleOnUnitySayMessage(message) {
  //   setSaidMessage(message);
  // }

  // Event invoked when the user clicks the button, the speed will be increased.
  // function handleOnClickIncreaseSpeed() {
  //   setRotationSpeed(rotationSpeed + 15);
  // }

  // Event invoked when the user clicks the button, the speed will be decreased.
  // function handleOnClickDecreaseSpeed() {
  //   setRotationSpeed(rotationSpeed - 15);
  // }

  // Event invoked when the user clicks the button, the unity container will be
  // mounted or unmounted depending on the current mounting state.
  // function handleOnClickUnMountUnity() {
  //   if (isLoaded === true) {
  //     setIsLoaded(false);
  //   }
  //   setIsUnityMounted(isUnityMounted === false);
  // }

  const handle = useFullScreenHandle();


  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (

      <div className='wrapper'>

        <div className='header row'>
          <a href='https://linktr.ee/ambermetaverse' className='about_btn' target="_blank">About</a>
        </div>

        <img className='logo' src={Logo}></img>
        <p className='description'>Free to play NFT-game</p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Login with NEAR</button>
        </p>
        <a href='https://amber.top' target="_blank"><small>Mint your NFT</small></a>

        <div className='footer'>
          <p target="_blank" >Join Us</p>
          <div className='social-links'>
            <a href='https://twitter.com/AMBER_metaverse'><FontAwesomeIcon icon={faTwitter} /></a>
            <a href='https://discord.gg/5ze32SFmmS'><FontAwesomeIcon icon={faDiscord} /></a>
            <a href=''><FontAwesomeIcon icon={faInstagram} /></a>
          </div>
          <small className='copywriter'>© 2022 HustleStacks OÜ - All Rights Reserved.</small>
        </div>

      </div>

    )
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>

      <Fragment>
        <div className="wrapper">

          <div className='header'>
            <img className='logo' src={Logo}></img>
            <button onClick={logout}>Log Out</button>
          </div>
          {/* Introduction text */}
          {/* <h1>React Unity WebGL Tests</h1>
          <p>
            In this React Application we'll explore the possibilities with the
            React Unity WebGL Module. Use the built-in events, custom events,
            mount, unmount, press the buttons and resize the view to see the magic
            in action.
          </p> */}
          {/* Some buttons to interact */}
          {/* <button onClick={handleOnClickUnMountUnity}>(Un)mount Unity</button>
          <button onClick={handleOnClickIncreaseSpeed}>Increase speed</button>
          <button onClick={handleOnClickDecreaseSpeed}>Decrease speed</button> */}
          {/* The Unity container */}
          {isUnityMounted === true && (
            <Fragment>
              <div className="unity-container">

                {/* The Unity app will be rendered here. */}
                <FullScreen handle={handle}>

                  {/* The loading screen will be displayed here. */}

                  {isLoaded === false && (
                    <div className="loading-overlay">
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: progression * 100 + "%" }}
                        />
                      </div>
                    </div>
                  )}

                  <Unity className="unity-canvas" unityContext={unityContext} />
                </FullScreen>
              </div>
              {/* Displaying some output values */}
              {/* <p>
                The cube is rotated <b>{cubeRotation}</b> degrees
                <br />
                The Unity app said <b>"{saidMessage}"</b>!
                <br />
                Clicked at <b>x{clickPosition.x}</b>, <b>y{clickPosition.y}</b>
              </p>
              <button onClick={sendWalletIdToGame}>
                Send wallet id to game
              </button> */}
              <div className='game_footer'>
                <div className='game_version'>
                  <p>Alpha 0.1</p>
                </div>
                <div className='features'>
                  <button className='btn_voice'>
                    <FontAwesomeIcon icon={faMicrophoneSlash} />
                  </button>
                  &nbsp;&nbsp;&nbsp;
                  <button className='btn_expand' onClick={handle.enter}>
                    <FontAwesomeIcon icon={faExpandArrowsAlt} />
                  </button>
                </div>
              </div>
            </Fragment>

          )}
        </div>
      </Fragment>

      {showNotification && <Notification />}
    </>
  )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
        {window.accountId}
      </a>
      {' '/* React trims whitespace around tags; insert literal space character when needed */}
      called method: 'set_greeting' in contract:
      {' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
