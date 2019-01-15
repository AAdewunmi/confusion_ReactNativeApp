import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
//import { DISHES } from '../shared/dishes';
//import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})


function RenderDish(props) {
    
    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
            featuredTitle={dish.name}
            image={{uri: baseUrl + dish.image}}>    
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={styles.buttons}>
                <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite heart') : props.onPress()}
                    />
                <Icon 
                    raised 
                    reverse 
                    name='pencil' 
                    type='font-awesome' 
                    color='#512DA8' 
                    onPress={() => props.popUpModal()}
                    /> 
                </View>
            </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

                   
function RenderComments(props){
      const comments = props.comments;
      const renderCommentItem = ({item, index}) => {
      return(
          <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating style={styles.ratingStars} type="star" readonly imageSize={12} startingValue={item.rating} /> 
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
      );
      };
      return(
          <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
      );
    }  
       
                 
class Dishdetail extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            rating: 1,
            author: '',
            comment: '',
            showModal: false,
        }
    }
    
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }
    
    static navigationOptions = {
        title: 'Dish Details'
    };
        
    handleComment(dishId, rating, author, comment) {
        this.props.postComment(dishId, rating, author, comment);
        this.toggleModal();
    };
    
    resetForm() {
        this.setState({
            showModal: false
        });
    }
     render(){
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    popUpModal={() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={'slide'} transparent={false} visible={this.state.showModal} 
                onDismiss = {() =>{this.toggleModal(); this.resetForm();}}
                    onRequestClose = {() =>{this.toggleModal(); this.resetForm();}}>
                    <View>                        
                      <Rating showRating type="star" onFinishRating={(value) => this.setState({rating: value})} />
                        <Text />
                        <Input style={styles.modalText} placeholder="Author" leftIcon={<Icon name="user-o" type="font-awesome" />} onChangeText={(value) => this.setState({author: value})} />
                        <Input style={styles.modalText} placeholder="Comment" leftIcon={<Icon name="comment-o" type="font-awesome" />} onChangeText={(value) => this.setState({comment: value})} />
                        <Text />
                        <Button onPress={() => {this.handleComment(dishId, this.state.rating, this.state.author, this.state.comment)}} color='#512DA8' title='Submit' />
                        <Text />
                        <Button onPress = {() =>{this.toggleModal(); this.resetForm();}} 
                        color='black' 
                        title='Cancel' />  
                    </View>
                </Modal> 
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttons:{
        alignItems: 'center', 
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },
     ratingStars:{
        flex: 1, 
        flexDirection:'row'
    },
    modal:{
        justifyContent: 'center',
        margin: 20
    },
    modalText:{
        fontSize: 18,
        margin: 10
    }
});
               
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);