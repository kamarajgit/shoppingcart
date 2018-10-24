import React, { Component } from "react";
import WarningIcon from '@material-ui/icons/Warning';

const NoResults = () => {
  return (
    <div className="products">
      <div className="no-results">
        <div><WarningIcon className="warningIcon"/></div>
        <h2>Sorry, no products matched your search!</h2>
        <p>Please enter a different keyword and try.</p>
      </div>
    </div>
  );
};

export default NoResults;
