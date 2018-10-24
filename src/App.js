import React, { Component } from 'react';
import logo from './logo.svg';
import Header from "./components/Header";
import Products from "./components/Products";
import QuickView from "./components/QuickView";
import productsJson from "./json/products.json";
import "./scss/style.scss";

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      recommendProducts: [],
      cart: [],
      totalItems: 0,
      totalAmount: 0,
      term: "",
      category: "",
      cartBounce: false,
      quantity: 1,
      quickViewProduct: {},
      modalActive: false
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleMobileSearch = this.handleMobileSearch.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.sumTotalItems = this.sumTotalItems.bind(this);
    this.sumTotalAmount = this.sumTotalAmount.bind(this);
    this.checkProduct = this.checkProduct.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    console.log("productsJson:::",productsJson);
  }
  // Fetch Initial Set of Products from external API
  getProducts() {    
    this.setState({products: productsJson, recommendProducts:productsJson});
	  //this.fetchProductJson();
  }
  fetchProductJson(){
    var me = this;
    fetch("./json/products.json")
      .then(res => res.json())
      .then(
        (result) => {
          me.setState({
      products: result
      });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          
        }
      )
  }
  componentWillMount() {
    this.getProducts();
  }

  // Search by Keyword
  handleSearch(event) {
    this.setState({ term: event.target.value });
  }
  // Mobile Search Reset
  handleMobileSearch() {
    this.setState({ term: "" });
  }
  // Filter by Category
  handleCategory(event) {
    this.setState({ category: event.target.value });
    console.log(this.state.category);
  }
  // Add to Cart
  handleAddToCart(selectedProducts) {
    let cartItem = this.state.cart;
    let productID = selectedProducts.id;
    let productQty = selectedProducts.quantity;
    if (this.checkProduct(productID)) {
      
      let index = cartItem.findIndex(x => x.id == productID);
      cartItem[index].quantity =
        Number(cartItem[index].quantity) + Number(productQty);
      this.setState({
        cart: cartItem
      });
    } else {
      cartItem.push(selectedProducts);
    }
    var recomenddata = [];
    for(var i=0;i<cartItem.length;i++){
      for(var j=0;j<this.state.products.length;j++){
       if ((this.state.products[j].tags.indexOf(cartItem[i].name)>-1) || (this.state.products[j].tags.indexOf(cartItem[i].category)>-1)) {
          if (!this.checkProduct(this.state.products[j].id)) {
           recomenddata.push(this.state.products[j]);
          }
       } 
      }
    }
    //console.log("cartItem::::",cartItem, "products:::",this.state.products);
    this.setState({
      cart: cartItem,
      cartBounce: true,
      recommendProducts:recomenddata
    });
    setTimeout(
      function() {
        this.setState({
          cartBounce: false,
          quantity: 1
        });
        console.log(this.state.quantity);
        console.log(this.state.cart);
      }.bind(this),
      1000
    );
    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);
  }
  handleRemoveProduct(id, e) {
    let cart = this.state.cart;
    let index = cart.findIndex(x => x.id == id);
    cart.splice(index, 1);

    var recomenddata = [];
    for(var i=0;i<cart.length;i++){
      for(var j=0;j<this.state.products.length;j++){
       if ((this.state.products[j].tags.indexOf(cart[i].name)>-1) || (this.state.products[j].tags.indexOf(cart[i].category)>-1)) {
          if (!this.checkProduct(this.state.products[j].id)) {
           recomenddata.push(this.state.products[j]);
          }
       } 
      }
    }

    this.setState({
      cart: cart,
      recommendProducts:recomenddata
    });
    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);
    e.preventDefault();
  }
  checkProduct(productID) {
    let cart = this.state.cart;
    return cart.some(function(item) {
      return item.id === productID;
    });
  }
  sumTotalItems() {
    let total = 0;
    let cart = this.state.cart;
    total = cart.length;
    this.setState({
      totalItems: total
    });
  }
  sumTotalAmount() {
    let total = 0;
    let cart = this.state.cart;
    for (var i = 0; i < cart.length; i++) {
      total += cart[i].price * parseInt(cart[i].quantity);
    }
    this.setState({
      totalAmount: total
    });
  }

  //Reset Quantity
  updateQuantity(qty) {
    console.log("quantity added...");
    this.setState({
      quantity: qty
    });
  }
  // Open Modal
  openModal(product) {
    this.setState({
      quickViewProduct: product,
      modalActive: true
    });
  }
  // Close Modal
  closeModal() {
    this.setState({
      modalActive: false
    });
  }

  render() {
    return (
      <div className="container">
        <Header
          cartBounce={this.state.cartBounce}
          total={this.state.totalAmount}
          totalItems={this.state.totalItems}
          cartItems={this.state.cart}
          removeProduct={this.handleRemoveProduct}
          handleSearch={this.handleSearch}
          handleMobileSearch={this.handleMobileSearch}
          handleCategory={this.handleCategory}
          categoryTerm={this.state.category}
          updateQuantity={this.updateQuantity}
          productQuantity={this.state.quantity}

          recommendProducts={this.state.recommendProducts}
          searchTerm={""}
          addToCart={this.handleAddToCart}
          openModal={this.openModal}
        />
        <Products
          productsList={this.state.products}
          searchTerm={this.state.term}
          addToCart={this.handleAddToCart}
          productQuantity={this.state.quantity}
          updateQuantity={this.updateQuantity}
          openModal={this.openModal}
        />        
        <QuickView
          product={this.state.quickViewProduct}
          openModal={this.state.modalActive}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

export default App;
