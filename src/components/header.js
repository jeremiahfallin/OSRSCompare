import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const HeaderLinks = styled.h2`
  margin: 0;
  display: inline;
  float: right;
  a {
    color: white;
    text-decoration: none;
  }
`;

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#123524`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0, display: "inline" }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <HeaderLinks>
        <Link to="/quests">Quests</Link>
      </HeaderLinks>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
