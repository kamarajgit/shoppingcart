import React, { Component } from "react";
import EmptyCartIcon from '@material-ui/icons/ShoppingBasket';
const EmptyCart = props => {
  return (
    <div className="empty-cart">
      <div><EmptyCartIcon className="emptycarticon"/></div>
      <h2>You cart is empty!</h2>
    </div>
  );
};

export default EmptyCart;
