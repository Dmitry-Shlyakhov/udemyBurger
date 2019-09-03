import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
  componentWillMount(){
    const query = new URLSearchParams(this.props.location.search);
    const ingredients = {};
    
    for(let param of query.entries()){
      if(param[0] === 'price'){
        this.setState({price: +param[1]});
      } else {
        ingredients[param[0]] = +param[1];
      }
    }

    this.setState({ingredients});
  }

  checkoutCanceledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  };

  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.props.ings}
          checkoutCanceled={this.checkoutCanceledHandler}
          checkoutContinued={this.checkoutContinuedHandler} />
          <Route 
            path={this.props.match.path + '/contact-data'}
            component={ContactData} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ings: state.ingredients,
});

export default connect(mapStateToProps)(Checkout);