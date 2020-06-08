import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import Quests from "../components/Quests";
import SEO from "../components/seo";

const QuestsPage = () => (
  <Layout>
    <SEO title="QuestsPage" />
    <Quests />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
);

export default QuestsPage;
