import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component{
  state = {
    purchasing: false,
    loading: false,
    err: false,
  };

  componentDidMount() {
    // axios.get('ingredients.json')
    //   .then(response => {
    //     this.setState({ingredients: response.data})
    //   })
    //   .catch(() => {
    //     this.setState({err: true})
    //   })
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((sum, el) => sum + el, 0);

    return sum > 0
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  };

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  };

  purchaseContinueHandler = () => {


    this.props.history.push('/checkout');
  };


  render (){
    const disabledInfo = {
      ...this.props.ings,
    };
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    let burger = this.state.err ? <p>Ingredients cant'n be loaded!!!</p> : <Spinner/>;
    if(this.props.ings){
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded = {this.props.onIngredientAdded}
            ingredientRemoved = {this.props.onIngredientRemoved}
            disabled = {disabledInfo}
            purchaseable = {this.updatePurchaseState(this.props.ings)}
            ordered = {this.purchaseHandler}
            price = {this.props.price} />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          price={this.props.price}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler} />
      );
    }
    if(this.state.loading){
      orderSummary = <Spinner />
    }

    return (
      <Aux>
        <Modal
          modalClosed={this.purchaseCancelHandler}
          show={this.state.purchasing}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  };
}

const mapStateToProps = state => ({
  ings: state.ingredients,
  price: state.totalPrice,
});

const mapDispatchToProps = dispatch => ({
  onIngredientAdded: ingName => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
  onIngredientRemoved: ingName => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName}),
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));