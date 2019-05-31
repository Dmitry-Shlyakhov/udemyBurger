import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component{
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    err: false,
  };

  componentDidMount() {
    axios.get('ingredients.json')
      .then(response => {
        this.setState({ingredients: response.data})
      })
      .catch(() => {
        this.setState({err: true})
      })
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((sum, el) => sum + el, 0);
    this.setState({purchaseable: sum > 0})
  }

  addIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAdditional = INGREDIENT_PRICES[type];
    const newPrice = this.state.totalPrice + priceAdditional;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = type => {
    if(this.state.ingredients[type] <= 0){
      return;
    }
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = this.state.ingredients[type] - 1;
    this.setState({ 
      totalPrice: this.state.totalPrice - INGREDIENT_PRICES[type],
      ingredients: updatedIngredients,
    });
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({purchasing: true});
  };

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  };

  purchaseContinueHandler = () => {
    this.setState({ loading: true });
    axios.post('/orders.json', {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Dmytro Shlialhov',
        address: {
          street: 'test street',
          zipCode: '12345',
          country: 'Ukraine',
        },
        email: 'test@gmail.com',
      },
      deliveryMethod: 'fastest',
    })
      .then(() => this.setState({ loading: false, purchasing: false, }))
      .catch(() => this.setState({ loading: false, purchasing: false, }));
  };


  render (){
    const disabledInfo = {
      ...this.state.ingredients
    };
    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    let burger = this.state.err ? <p>Ingredients cant'n be loaded!!!</p> : <Spinner/>;
    if(this.state.ingredients){
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded = {this.addIngredientHandler}
            ingredientRemoved = {this.removeIngredientHandler}
            disabled = {disabledInfo}
            purchaseable = {this.state.purchaseable}
            ordered = {this.purchaseHandler}
            price = {this.state.totalPrice} />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);