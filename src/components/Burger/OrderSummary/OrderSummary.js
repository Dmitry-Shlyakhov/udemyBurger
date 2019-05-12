import React, { Component } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
  render(){
    const ingredientSummary = Object.keys(this.props.ingredients)
      .map(igKey => (
        <li key={igKey}>
          <span style={{textTransform: 'capitalize'}}>{igKey}</span>:
          {this.props.ingredients[igKey]}
        </li>
      ));

    return (
      <Aux>
        <h3>Your order</h3>
        <p>A dilicious burger with the following ingriedients:</p>
        <ul>
          {ingredientSummary}
        </ul>
        <p><strong>Total price: {this.props.price.toFixed(2)}</strong></p>
        <p>Continue to Checkout?</p>
        <Button
          btnType="Danger"
          clicked={this.props.purchaseCancelled} >CANCEL</Button>
        <Button
          btnType="Success"
          clicked={this.props.purchaseContinued} >CONTINUE</Button>
      </Aux>
    );
  }
}

export default OrderSummary;