import React, { Component } from 'react'
import { View, Text, Image, Alert, ActivityIndicator } from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { NavigationEvents } from 'react-navigation'
import Axios from 'axios'
import Profile from './Profile'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-native-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { LIGHT, DARK } from '../colorTheme'


// FOR TESTING PURPOSES
const requests = [
    {
        username: 'Aaron',
        profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
        follow: true,
        accept: false
    }, {
        username: 'Ben',
        profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
        follow: false,
        id: 1
    }, {
        username: 'Charlie',
        profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
        follow: true,
        accept: false
    }
]
const chats = [
    {
        id: 2,
        group: [
            {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
            }, {
                username: 'Ben',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
            }, {
                username: 'Charlie',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
            },
        ],
        messages: [
            {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Charlie',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Ben',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Ben',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            },
        ],
        myIndex: 3
    }, {
        id: 3,
        group: [
            {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
            }, {
                username: 'Ben',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
            },
        ],
        messages: [
            {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Ben',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Ben',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            },
        ],
        myIndex: 4
    }, {
        id: 4,
        group: [
            {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
            }, {
                username: 'Charlie',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
            },
        ],
        messages: [
            {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Charlie',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Charlie',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Aaron',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            }, {
                username: 'Charlie',
                profilepicture: 'https://leaf-video.s3.amazonaws.com/profile-pictures/testProfile.png',
                content: 'https://diwoaedb40lx7.cloudfront.net/video/HIWTC.mp4'
            },
        ],
        myIndex: 2
    }
]

class ChatItem extends Component {
    state = {
        theme: this.props.theme == 'dark' ? DARK : LIGHT
    }

    renderGroup = group => {
        let groupStr = ''
        for (user of group) groupStr += `, ${user.username}`
        groupStr = groupStr.slice(2, groupStr.length)
        return (
            <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: 'rgba(128,128,128,.5)', width: '100%', marginVertical: 5, padding: 10 }}>
                <Image source={{ uri: group[0].profilepicture }} style={[{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, marginRight: 5 }, this.state.theme.image]} />
                <Text style={[{ fontWeight: 'bold' }, this.state.theme.text]}>{groupStr}</Text>
            </View>
        )
    }

    render() {
        return (
            <TouchableOpacity onLongPress={() => Alert.alert(
                'Leave Group Chat',
                'Are you sure you want to leave this group chat?',
                [{ text: 'Cancel', onPress: () => console.log('Cancel leave chat.'), style: 'cancel' },
                { text: 'Leave Chat Group', onPress: () => this.props.leaveChat(this.props.index) }])}
                onPress={() => this.props.goto(this.props.index)}>
                {this.renderGroup(this.props.group)}
            </TouchableOpacity>
        )
    }
}

class ReqItem extends Component {
    state = {
        theme: this.props.theme == 'dark' ? DARK : LIGHT
    }

    action = async () => {
        if (this.props.follow) {
            if (this.props.accept) {
                // follow back
                this.props.clear(this.props.index) // TESTING LINE
                /*
                await Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/follow', { username: this.props.name, follow: true, token: this.props.token })
                    .then(() => this.props.clear(this.props.index))
                    .catch(err => console.log(err))
                */
               console.log('following')
            } else {
                // accept follow
                this.props.acceptFollow(this.props.index) // TESTING LINE
                /*
                await Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/acceptFollow', { username: this.props.name, token: this.props.token })
                    .then(() => this.props.clear(this.props.index))
                    .catch(err => console.log(err))
                */
                console.log('accepted follow')
            }
        } else {
            // join chat group
            this.props.clear(this.props.index) // TESTING LINE
            this.props.get() // TESTING LINE
            /*
            await Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/join', { id: this.props.id, token: this.props.token })
                .then(() => {
                    this.props.clear(this.props.index)
                    this.props.get()
                }).catch(err => console.log(err))
            */
           console.log('joined chat group ' + this.props.id)
        }
    }

    render() {
        const acceptBtn = this.props.accept ? 'FOLLOW' : 'ACCEPT'
        const acceptColor = this.props.accept ? 'cadetblue' : '#00bfff'
        if (this.props.follow) {
            return (
                <View style={[{ width: '100%', alignContent: 'center', flexDirection: 'row', justifyContent: 'space-between' }, this.state.theme.container]}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableWithoutFeedback onPress={() => this.props.goto(this.props.username)}>
                            <Image source={{ uri: this.props.profilepicture }} style={[{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, marginRight: 5 }, this.state.theme.image]} />
                        </TouchableWithoutFeedback>
                        <View>
                            <Text style={[{ fontWeight: 'bold', marginHorizontal: 5 }, this.state.theme.text]}>{this.props.username}</Text>
                            <Text style={this.state.theme.text}>would like to follow you.</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.action()} style={{ backgroundColor: acceptColor, borderRadius: 20, justifyContent: 'center', margin: 5 }}>
                            <Text style={{ marginHorizontal: 10, marginVertical: 5, color: 'white' }}>{acceptBtn}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.clear(this.props.index)}>
                            <Icon icon={faTimesCircle} size={25} style={{ color: '#c6c6c6' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        return (
            <View style={[{ width: '100%', alignContent: 'center', flexDirection: 'row', justifyContent: 'space-between' }, this.state.theme.container]}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: this.props.profilepicture }} style={[{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, marginRight: 5 }, this.state.theme.image]} />
                    <View>
                        <Text style={[{ fontWeight: 'bold', marginHorizontal: 5 }, this.state.theme.text]}>{this.props.username}</Text>
                        <Text style={this.state.theme.text}>invites you to join a chat group.</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.action()} style={{ backgroundColor: acceptColor, borderRadius: 20, justifyContent: 'center', margin: 5 }}>
                        <Text style={{ marginHorizontal: 10, marginVertical: 5, color: 'white' }}>JOIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.clear(this.props.index)}>
                        <Icon icon={faTimesCircle} size={25} style={{ color: '#c6c6c6' }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default class Messages extends Component {
    state = {
        requests: [],
        chats: [],
        gotoProfile: null,
        isLoading: true,
        theme: this.props.screenProps.theme == 'dark' ? DARK : LIGHT
    }

    componentDidMount() {
        this.get()
    }

    get = async () => {
        // FOR TESTING PURPOSES
        this.setState({ requests: requests, chats: chats, isLoading: false })
        /*
        //get requests
        await Axios.get('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/requests', {params:{token: this.props.screenProps.token}})
            .then(res => this.setState({ requests: res.data }))
            .catch(err => console.log(err))

        //get chats
        await Axios.get('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/chats', {params:{token: this.props.screenProps.token}})
            .then(res => this.setState({ chats: res.data }))
            .catch(err => console.log(err))
        */
    }

    acceptFollow = async index => {
        let temp = this.state.requests
        temp[index].accept = true
        this.setState({ requests: temp })
        Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/accept', { username: this.props.name, token: this.props.screenProps.token })
    }

    clear = async index => {
        let temp = this.state.requests
        temp.splice(index, 1)
        this.setState({ requests: temp })
        Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/requests', { requests: temp, token: this.props.screenProps.token })
    }

    goBack = () => { this.setState({ gotoProfile: null }) }

    goto = loc => {
        if (Number.isInteger(loc)) {
            // goto chat
            this.props.screenProps.push('Chat', { messages: this.state.chats[loc].messages, myIndex: this.state.chats[loc].myIndex, id: this.state.chats[loc].id })
        } else {
            //goto profile of username
            this.setState({ gotoProfile: loc })
        }
    }

    leaveChat = index => {
        // Axios.post('https://if6chclj8h.execute-api.us-east-1.amazonaws.com/live/leaveChat', chats[index].id)
        let chats = this.state.chats
        chats.splice(index,1)
        this.setState({chats})
    }

    render() {
        if (this.state.isLoading) return (
            <View style={[{ alignItems: 'center', justifyContent: 'center', flex: 1 }, this.state.theme.container]}>
                <ActivityIndicator size='large' color='blue' animated />
            </View>
        )
        if (this.state.gotoProfile) return <Profile screenProps={{ theme: this.props.screenProps.theme, token: this.props.screenProps.token }} goBack={this.goBack} username={this.state.gotoProfile} />
        return (
            <View style={[{ flex: 1, padding: 20, paddingTop: 40 }, this.state.theme.container]}>
                <NavigationEvents onWillFocus={() => this.get()} />
                <Text style={[{ fontSize: 40, fontWeight: 'bold' }, this.state.theme.text]}>Chats & Requests</Text>
                <View>
                    <Text style={[{ fontSize: 30, fontWeight: 'bold' }, this.state.theme.text]}>Requests</Text>
                    {this.state.requests.map((req, i) => <ReqItem token={this.props.screenProps.token} theme={this.props.screenProps.theme} key={i} index={i} goto={this.goto} acceptFollow={this.acceptFollow} clear={this.clear} get={this.get} {...req} />)}
                </View>
                <View>
                    <Text style={[{ fontSize: 30, fontWeight: 'bold' }, this.state.theme.text]}>Chats</Text>
                    {this.state.chats.map((chat, i) => <ChatItem theme={this.props.screenProps.theme} key={i} index={i} leaveChat={this.leaveChat} goto={this.goto} {...chat} />)}
                </View>
            </View>
        )
    }
}