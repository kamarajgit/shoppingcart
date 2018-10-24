import React, { Component } from "react";
import CartScrollBar from "./CartScrollBar";
import Counter from "./Counter";
import EmptyCart from "../empty-states/EmptyCart";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { findDOMNode } from "react-dom";
import ShoppingBasketIcon from '@material-ui/icons/ShoppingCart';
import SearchIcon from '@material-ui/icons/Search';
import companyLogo from '../images/logo-dummy.png';
import Products from "../components/Products";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCart: false,
      cart: this.props.cartItems
    };
  }
  handleCart(e) {
    e.preventDefault();
    this.setState({
      showCart: !this.state.showCart
    });
  }
  handleSubmit(e) {
    e.preventDefault();
  }
  
  handleSearchNav(e) {
    e.preventDefault();
    this.setState(      
      function() {
        this.refs.searchBox.value = "";
      }
    );
  }
  handleClickOutside(event) {
    const cartNode = findDOMNode(this.refs.cartPreview);
    const buttonNode = findDOMNode(this.refs.cartButton);
    if (cartNode.classList.contains("active")) {
      if (!cartNode || !cartNode.contains(event.target)) {
        this.setState({
          showCart: false
        });
        event.stopPropagation();
      }
    }
  }
  componentDidMount() {
    document.addEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true
    );
  }
  componentWillUnmount() {
    document.removeEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true
    );
  }
  render() {
    let cartItems;
    cartItems = this.state.cart.map(product => {
      return (
        <li className="cart-item" key={product.name}>
          <img className="product-image" src={product.image} />
          <div className="product-info">
            <p className="product-name">{product.name}</p>
            <p className="product-price">{product.price}</p>
          </div>
          <div className="product-total">
            <p className="quantity">
              {product.quantity} {product.quantity > 1 ? "Nos." : "No."}{" "}
            </p>
            <p className="amount">{product.quantity * product.price}</p>
          </div>
          <a
            className="product-remove"
            href="#"
            onClick={this.props.removeProduct.bind(this, product.id)}
          >
            ×
          </a>
        </li>
      );
    });
    let view;
    if (cartItems.length <= 0) {
      view = <EmptyCart />;
    } else {
      view = (
        <CSSTransitionGroup
          transitionName="fadeIn"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component="ul"
          className="cart-items"
        >
          <h4>My Cart</h4>
          {cartItems}
        </CSSTransitionGroup>
      );
    }
    return (
      <header>
        <div className="container">
          <div className="brand">
            <img
              className="logo"
              src={companyLogo}
              alt="Sales Basket"
            />
          </div>

          <div className="search">            
            <form
              action="#"
              method="get"
              className="search-form"
            >              
              <input
                type="search"
                ref="searchBox"
                placeholder="Search for Products"
                className="search-keyword"
                onChange={this.props.handleSearch}
              />
              <div
                className="search-button"
                type="submit"
                onClick={this.handleSubmit.bind(this)}>
                  <SearchIcon />
              </div>
            </form>
          </div>

          <div className="cart">
            <div className="cart-info">
              <table>
                <tbody>
                  <tr>
                    <td>No. of items</td>
                    <td>:</td>
                    <td>
                      <strong>{this.props.totalItems}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Sub Total</td>
                    <td>:</td>
                    <td>
                      <strong>{this.props.total}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a
              className="cart-icon"
              href="#"
              onClick={this.handleCart.bind(this)}
              ref="cartButton"
            >
              <div
                className={this.props.cartBounce ? "tada" : " "}>
                  <ShoppingBasketIcon className="basketIcon"/>
              </div>
              {this.props.totalItems ? (
                <span className="cart-count">{this.props.totalItems}</span>
              ) : (
                ""
              )}
            </a>
            <div
              className={
                this.state.showCart ? "cart-preview active" : "cart-preview"
              }
              ref="cartPreview"
            >
              <CartScrollBar>
                {view}
                
                
                {( () => {
                  if (this.props.recommendProducts.length > 0) {
                    return(
                      <div className="recommended-block">
                        <hr />
                          <h4>Recommended Items</h4>
                          <Products
                            productsList={this.props.recommendProducts}
                            searchTerm={this.props.searchTerm}
                            addToCart={this.props.addToCart}
                            productQuantity={this.props.productQuantity}
                            updateQuantity={this.props.updateQuantity}
                            openModal={this.props.openModal}
                            extraclass=" notoppadding"
                          />
                      </div>
                    )
                  }
                })()}

                
              </CartScrollBar>
              <div className="action-block">
                <button
                  type="button"
                  className={this.state.cart.length > 0 ? " " : "disabled"}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>

              
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
