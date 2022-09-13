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
          <div className={styles.pcOnly}>
            <LVLogo />
          </div>
          <div className={styles.mobileOnly}>
            <MobileLVLogo />
          </div>
        </div>
        <div>
          <nav className={classnames(styles.nav, styles.pcOnly)}>
            <ul>
              <li>NEW</li>
              <li>MEN</li>
              <li>WOMEN</li>
            </ul>
          </nav>
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
