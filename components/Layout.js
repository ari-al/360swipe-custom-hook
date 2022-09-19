import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import styles from "./layout.module.scss";
import LVLogo from "../asset/images/lv-logo.svg";
import MobileLVLogo from "../asset/images/mobile-lv-logo.svg";
import classnames from "classnames";
import FooterLogo from "../asset/images/footer-lv-logo.svg";

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <div>
            <span>360 VIEWER</span>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <div>
          <FooterLogo />
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {};

export default Layout;
