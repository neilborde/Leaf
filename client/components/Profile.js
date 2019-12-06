import React, { Component } from 'react'
import { View, Image, Text, ActivityIndicator, Dimensions, StatusBar } from 'react-native'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-native-fontawesome'
import { faCog, faBolt, faArrowLeft, faFire } from '@fortawesome/free-solid-svg-icons'
import { faGem } from '@fortawesome/free-regular-svg-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationEvents } from 'react-navigation'
import { Video } from 'expo-av'
import Axios from 'axios'
import { LIGHT, DARK } from '../colorTheme'
const { height: winHeight, width: winWidth } = Dimensions.get('window')
let following = null

// FOR TESTING PURPOSES
const _videos = [
    {
        id: 111,
        liked: null,
        uri: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4',
        caption: 'this is my caption!',
        life: 3
    }, {
        id: 111,
        liked: null,
        uri: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4',
        caption: 'this is my caption!',
        life: 3
    }, {
        id: 111,
        liked: null,
        uri: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4',
        caption: 'this is my caption!',
        life: 3
    }
]
const otherVideos = [
    {
        id: 111,
        liked: false,
        uri: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4',
        caption: 'this is my caption!',
        life: 3
    }, {
        id: 111,
        liked: false,
        uri: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4',
        caption: 'this is my caption!',
        life: 3
    }, {
        id: 111,
        liked: false,
        uri: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4',
        caption: 'this is my caption!',
        life: 3
    }
]

class FullVideo extends Component {
    state = {
        liked: this.props.video.liked
    }

    async componentWillUnmount() {
        if (this.props.video.liked && !this.state.liked) await Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/like', { like: false, id: this.props.video.id, token: this.props.token }).catch(err => console.log(err))
        else if (!this.props.video.liked && this.state.liked) await Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/like', { like: true, id: this.props.video.id, token: this.props.token }).catch(err => console.log(err))
    }

    render() {
        const video = this.props.video
        const boltColor = this.state.liked ? 'yellow' : 'rgba(255, 255, 255, .5)'
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: 'black' }}>
                <Video source={{ uri: video.uri }} resizeMode='cover' isLooping shouldPlay style={{ width: winWidth, height: winHeight, position: 'absolute' }} />
                <View style={{ position: 'absolute', margin: 20, marginTop: 40 }}>
                    <TouchableOpacity onPress={() => this.props.goBack()} >
                        <Icon icon={faArrowLeft} style={{ color: 'white' }} size={40} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', bottom: 0, justifyContent: 'space-between', position: 'absolute', flexDirection: 'row', padding: 20 }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>{video.caption}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>{video.life}</Text>
                        <TouchableOpacity onPress={() => { if (this.state.liked !== null) { this.setState(prev => ({ liked: !prev.liked })); this.props.like(this.props.index) } }}>
                            <Icon icon={faBolt} style={{ color: boltColor }} size={50} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default class Profile extends Component {
    state = {
        profile: '',
        username: '',
        fullname: '',
        points: 0,
        videos: [],
        following: null,
        onVideo: -1,
        isLoading: true,
        theme: this.props.screenProps.theme == 'dark' ? DARK : LIGHT
    }

    async componentDidMount() {
        // FOR TESTING PURPOSES
        // if (this.props.username === undefined) {
        //     this.setState({
        //         profile: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
        //         username: 'andymitch559',
        //         fullname: 'Andrew Mitchell',
        //         points: 1056,
        //         streak: 3,
        //         videos: _videos,
        //         isLoading: false,
        //         following: null
        //     })
        // } else {
        //     this.setState({
        //         profile: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
        //         username: 'BillyBob',
        //         fullname: 'Billy Bob',
        //         points: 103,
        //         videos: otherVideos,
        //         streak: 1,
        //         isLoading: false,
        //         following: false
        //     })
        // }
        const username = this.props.username === undefined ? "" : this.props.username
        console.log(username)
        console.log("AUTH")
        console.log("TEST" + this.props.screenProps.token)
        await Axios.get(`https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/profile?username=${username}&token=${this.props.screenProps.token}`)
            .then(res => {
                console.log(res.data)
                this.setState({
                    profile: res.data.profilepicture,
                    username: res.data.username,
                    fullname: res.data.name,
                    points: res.data.points,
                    streak: res.data.multiplier,
                    videos: res.data.videos,
                    following: res.data.following,
                    isLoading: false
                })
                following = res.data.following
            }).catch(err => console.log(err.response))
        /*
        const username = this.props.username === undefined ? null : this.props.username
        await Axios.get('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/profile', { params: { username: username, token: this.props.screenProps.token } })
            .then(res => {
                this.setState({
                    profile: res.data.profile,
                    username: res.data.username,
                    fullname: res.data.fullname,
                    points: res.data.points,
                    streak: res.data.streak,
                    videos: res.data.videos,
                    following: res.data.following
                })
                following = res.data.following
            }).catch(err => console.log(err))
        */  
    }

    componentWillUnmount() { this.follow() }

    goBack = () => { this.setState({ onVideo: -1 }) }

    like = index => {
        let temp = this.state.videos
        if (temp[index].liked) {
            temp[index].liked = false
            temp[index].likes -= 1
        } else {
            temp[index].liked = true
            temp[index].likes += 1
        }
        this.setState({ videos: temp })
    }

    follow = async () => {
        if (following !== null && following !== this.state.following) {
            await Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/follow', { username: this.state.username, follow: this.state.following, token: this.props.screenProps.token })
                .catch(err => console.log(err))
            following = this.state.following
        }
    }

    renderFollow = () => {
        const followColor = this.state.following ? 'lightgrey' : 'cadetblue'
        const followText = this.state.following ? 'UNFOLLOW' : 'FOLLOW'
        return (
            <TouchableOpacity style={{ backgroundColor: followColor, margin: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }} onPress={() => this.setState(prev => ({ following: !prev.following }))}>
                <Text>{followText}</Text>
            </TouchableOpacity>
        )
    }

    renderStreak = () => {
        if (this.state.streak == 1) return null
        const streak = `x${this.state.streak}`
        return (
            <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ position: 'absolute', zIndex: 1 }}>
                    <Text style={[{ fontWeight: 'bold', bottom: -2, fontSize: 10 }, this.state.theme.text]}>{streak}</Text>
                </View>
                <View style={{ position: 'absolute', zIndex: 0 }}>
                    <Icon icon={faFire} size={20} style={this.state.theme.streak} />
                </View>
            </View>
        )
    }

    renderVideoItem = (video, index) => {
        const boltColor = video.liked ? 'yellow' : 'rgba(255, 255, 255, .5)'
        return (
            <TouchableOpacity key={index} onPress={() => this.setState({ onVideo: index })} style={{ width: (winWidth / 2) - 40, height: (winWidth / 2) - 40, margin: 5, borderRadius: 5 }}>
                <Video source={{ uri: video.uri }} resizeMode='cover' isLooping isMuted shouldPlay style={{ width: (winWidth / 2) - 40, height: (winWidth / 2) - 40, position: 'absolute', borderRadius: 5 }} />
                <View style={{ position: 'absolute', bottom: 0, right: 0, margin: 10, flexDirection: 'row' }}>
                    <Text style={{ color: 'white' }}>{video.life}</Text>
                    <Icon icon={faBolt} style={{ color: boltColor }} />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={[{ alignItems: 'center', justifyContent: 'center', flex: 1 }, this.state.theme.container]}>
                    <StatusBar hidden={false}/>
                    <ActivityIndicator size='large' color='blue' animated />
                </View>
            )
        }
        if (this.state.onVideo + 1) return <FullVideo token={this.props.screenProps.token} index={this.state.onVideo} following={this.state.following} goBack={this.goBack} like={this.like} video={this.state.videos[this.state.onVideo]} />
        return (
            <View style={[{ flex: 1, padding: 20, paddingTop: 40 }, this.state.theme.container]}>
                <NavigationEvents onDidBlur={() => this.follow()}/>
                {this.state.following !== null &&
                    <TouchableOpacity onPress={() => this.props.goBack()}>
                        <Icon icon={faArrowLeft} size={35} style={[{margin: 10, marginTop: 0}, this.state.theme.icon]}/>
                    </TouchableOpacity>
                }
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: this.state.profile }} style={[{ height: 70, width: 70, borderRadius: 35, borderWidth: 1, borderColor: 'black', marginRight: 5 }, this.state.theme.image]} />
                        <View>
                            <Text style={[{ fontSize: 20, fontWeight: 'bold' }, this.state.theme.text]}>{this.state.username}</Text>
                            <Text style={{ fontSize: 15, fontStyle: 'italic', color: 'grey' }}>{this.state.fullname}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {this.renderStreak()}
                                <Icon icon={faGem} size={20} style={this.state.theme.icon}/>
                                <Text style={this.state.theme.text}>{this.state.points}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        {this.state.following !== null && this.renderFollow()}
                        {this.state.following === null &&
                            <TouchableOpacity onPress={() => {console.log('trying to go to settings '); this.props.screenProps.push('Settings')}}>
                                <Icon icon={faCog} size={30} style={this.state.theme.icon}/>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{flexWrap: 'wrap', width: winWidth-60, flexDirection: 'row'}}>
                        {this.state.videos.map((video, index) => this.renderVideoItem(video, index))}
                    </View>
                </View>
            </View>
        )
    }
}
