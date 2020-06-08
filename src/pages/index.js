import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import Image from "../components/image";
import Stats from "../components/Stats";
import SEO from "../components/seo";

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Stats />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
);

export default IndexPage;