import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';

const deviceHeight = Dimensions
  .get("window")
  .height;
const deviceWidth = Dimensions
  .get("window")
  .width;
const platform = Platform.OS;
const xSeries = platform === "ios" && deviceHeight === 812 || 896 && deviceWidth === 375 || 414;

const APIKeys = '66e327b798544bb1892af57aa49e59db';

let page = 1

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      scrollY:0,
      noData:false,
      animating:false
    };
  }

  componentDidMount() {
    this.fetchNews(page)
  }

  handleScroll(event) {
    let scrollY = Math.floor(event.nativeEvent.contentOffset.y);
    if(scrollY > this.state.scrollY+450 && !this.state.animating){
        page++;
        this.fetchNews(page)
        this.setState({scrollY});
    }
  }

  fetchNews = (page) => {
    this.setState({
       animating:true
    })
    let items = this.state.items
    let url = `https://newsapi.org/v2/everything?q=Robot&sortBy=popularity&pageSize=10&page=${page}&apiKey=${APIKeys}`;
    fetch(url).then(function (response) {
        if(response.status==200){
            return response.json()
        }else{
            throw response
        }
    }).then(res=>{
        console.log(res)
        items = items.concat(res.articles)
        this.setState({
            items
        })
    }).catch(error => {
      console.log(error)
      Alert.alert('Error')
      this.setState({
        noData:true
      })
    }).then(()=>{
        this.setState({
            animating:false
        })
    })
  }

  renderNews = (item, index) => {
    return (
      <View
        key={index}
        style={{
        height: 120,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 4,
        marginVertical: 12,
        padding:12
      }}>
        <View style={{flex:1, justifyContent:'flex-start'}}>
            <Text style={{fontSize:16, fontWeight:'600'}}>{item.title}</Text>
        </View>
        <View style={{flex:1, justifyContent:'flex-start'}}>
            <Text style={{color:'#999'}}>{item.source.name}</Text>
        </View>
        <View style={{flex:1, alignItems:'flex-end', justifyContent:'flex-end'}}>
            <Text style={{fontSize:10, color:'#999'}}>{new Date(item.publishedAt).toDateString()}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <View
          style={{
          width: deviceWidth,
          height: 96,
          paddingTop: xSeries
            ? 48
            : 12,
          backgroundColor: 'white',
          borderBottomColor: '#999',
          borderBottomWidth: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text
            style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#999'
          }}>RN NEWS READER</Text>
        </View>
        <ScrollView scrollEventThrottle={300} style={{
          paddingHorizontal: 20,
        }} onScroll={event => this.handleScroll(event)}>
        {this.state.items.map((elm, idx)=>{
            return this.renderNews(elm, idx)
        })}
        <View style={{paddingTop:12, flex:1, justifyContent:'center', alignItems:'center', display:this.state.noData ? 'flex' : 'none'}}>
            <Text>No More Data</Text>
        </View>
        </ScrollView>
        <View style={{height:10, width:deviceWidth,bottom:32, position:'absolute', alignItems:'center', justifyContent:'flex-end'}}>
            <ActivityIndicator size="large" color="#999" animating={this.state.animating} />
        </View>
      </View>
    )
  }
}