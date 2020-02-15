import React from "react";
//import PropTypes from "prop-types";

const BotaoSair = ({ children, color, ...props }) => (
  <button type="button" color={color} {...props}>
    {children}
  </button>
);

/*BotaoSair.propTypes = {
  children: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  props: PropTypes.object
};*/

export default BotaoSair;
