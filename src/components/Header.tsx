import React from "react";
import { Theme } from "../App";
import styles from "./Header.module.css";

interface HeaderProps {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header
      className={
        theme === Theme.DARK
          ? `${styles.header} ${styles.dark}`
          : `${styles.header} ${styles.light} glassy`
      }
    >
      <h2>Resume Postman</h2>
      <label className="container">
        <input
          type="checkbox"
          id="toggle"
          checked={theme === Theme.DARK ? true : false}
          onChange={() =>
            setTheme((oldTheme) => {
              return oldTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
            })
          }
        />
        <span className="slider round">
          <div className="background"></div>
          <div className="star"></div>
          <div className="star"></div>
        </span>
      </label>
    </header>
  );
};
export default Header;
