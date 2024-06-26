import React from "react";
import { Theme } from "App";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { TabsType } from "types";
import styles from "./Tabs.module.css";
import { setTabIndex } from "store/features/tabSlice";
// import * as Icons from "react-icons/io5";
import { getIconComponent } from 'utils/iconUtils'
interface TabsProps {
  theme: Theme;
}

const Tabs: React.FC<TabsProps> = ({ theme }) => {
  const { tabsInfo: tabs, tabIndex } = useAppSelector((state) => state.tabs);
  const dispatch = useAppDispatch();
  
  return (
    <section>
      <div className={styles.tabContainer}>
        {tabs.map((tab: TabsType, index: number) => {
          const { name, logo, logoType } = tab;
          const Logo = getIconComponent(logo, logoType);
          return (
            <div
              key={index}
              className={`${styles.tab} ${
                theme === Theme.DARK ? styles.dark : `${styles.light} glassy`
              }`}
              style={
                tabIndex === index
                  ? {
                      background:
                        "linear-gradient(128deg, #0fa, #4579f5 53%, #9c42f5",
                      border: "none",
                    }
                  : {}
              }
              onClick={() => dispatch(setTabIndex(index))}
            >
              <div className={styles.tabContent}>
                <h4>{name}</h4>
                {Logo && (
                  <Logo
                    style={{ fontSize: "1.9rem", transform: "scale(1.3)" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default Tabs;
