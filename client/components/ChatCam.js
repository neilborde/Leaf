import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions, StatusBar } from 'react-native'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { NavigationEvents } from 'react-navigation'
import CameraTimer from './CameraTimer'
import Axios from 'axios'
import { AUTH_TOKEN } from './LoginRegister'
Axios.defaults.headers.common['auth-token'] = AUTH_TOKEN
import { FontAwesomeIcon as Icon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faImages } from '@fortawesome/free-solid-svg-icons'
import { Ionicons } from '@expo/vector-icons'
import styles from '../styles/styles'
const { width: winWidth, height: winHeight } = Dimensions.get('window')
const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants

export default class ChatCam extends Component {
    camera = null
    state = {
        capturing: false,
        hasCameraPermission: null,
        cameraType: Camera.Constants.Type.back,
        flashMode: Camera.Constants.FlashMode.off,
        blurred: false
    }

    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA)
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted')
        this.setState({ hasCameraPermission })
    }

    setFlashMode = flashMode => this.setState({ flashMode })
    setCameraType = cameraType => this.setState({ cameraType })

    handleCapture = async () => {
        if (this.state.capturing) {
            this.setState({ capturing: false })
            this.camera.stopRecording()
        } else {
            this.setState({ capturing: true })
            await this.camera.recordAsync({ maxDuration: 10 })
                .then(file => this.props.postMessage(file.uri))
                .catch(err => console.log('OH NO: ' + err))
        }
    }

    fromCameraRoll = async () => {
        const roll = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (roll.status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                aspect: [18, 9],
            })
            if (!result.cancelled) this.props.navigation.push('Preview', { uri: result.uri })
        }
    }

    renderCamera = (cameraType, flashMode) => {
        if (this.state.blurred) return null
        return (
            <Camera
                type={cameraType}
                flashMode={flashMode}
                style={{ backgroundColor: 'transparent', height: winHeight, width: winWidth, left: 0, right: 0, top: 0, position: 'absolute' }}
                ref={camera => this.camera = camera}
                ratio={'18:9'}
            />
        )
    }

    render() {
        const { hasCameraPermission, flashMode, cameraType, capturing } = this.state

        if (hasCameraPermission === null) return <View />
        if (hasCameraPermission === false) return <Text>Access to camera has been denied.</Text>
        return (
            <View style={{height: winHeight-100}}>
                <NavigationEvents
                    onWillFocus={() => this.setState({ blurred: false })}
                    onDidBlur={() => this.setState({ blurred: true })}
                />
                <StatusBar hidden />
                <View style={[styles.inline, { zIndex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end' }]}>
                    <TouchableOpacity onPress={() => this.setFlashMode(flashMode === CameraFlashModes.torch ? CameraFlashModes.off : CameraFlashModes.torch)}>
                        <Ionicons name={flashMode == CameraFlashModes.torch ? "md-flash" : 'md-flash-off'} color="white" size={30} />
                    </TouchableOpacity>
                </View>

                {this.renderCamera(cameraType, flashMode)}

                <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.8)', 'rgba(0,0,0,1)']}
                    style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', bottom: 0, width: winWidth, height: 70, alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={this.fromCameraRoll}>
                        <Icon icon={faImages} style={{ color: 'white' }} size={30} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this.handleCapture}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                            <View style={styles.captureBtn}>
                                {capturing && <View style={styles.captureBtnInternal} />}
                            </View>
                            <View style={{ position: 'absolute' }}>
                                {capturing && <CameraTimer seconds={10} />}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableOpacity onPress={() => this.setCameraType(cameraType === CameraTypes.back ? CameraTypes.front : CameraTypes.back)}>
                        <Ionicons name="md-reverse-camera" color="white" size={30} />
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )
    }
}