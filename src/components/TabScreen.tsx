import { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import { Theme } from "App";
import styles from "./TabScreen.module.css";
import { IoCopy } from "react-icons/io5";
import { TbCopy, TbCopyCheck } from "react-icons/tb";
import ActionBtn from "./ActionBtn";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setContent, changeAutoSaveMode, reset } from "store/features/tabSlice";
import { IoSave, IoSaveOutline } from "react-icons/io5";
import { GrFolderCycle } from "react-icons/gr";
import { GrPowerReset } from "react-icons/gr";

interface TabScreenProps {
  theme: Theme;
  // setTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TabScreen: React.FC<TabScreenProps> = ({ theme }) => {
  const {
    tabsInfo: tabs,
    tabIndex,
    autoSaveMode,
  } = useAppSelector((state) => state.tabs);
  const dispatch = useAppDispatch();

  const divRef = useRef<HTMLDivElement>(null);
  const [placeholders, setPlaceholders] = useState({});

  useEffect(() => {
    const regex = /<([^>]+)>/g;
    const content = tabs[tabIndex].content;
    const placeholdersArray = [...content.matchAll(regex)].map(
      (match) => match[1]
    );
    // Create an object to store the placeholders
    const placeholdersObj = placeholdersArray.reduce((acc, placeholder) => {
      acc[placeholder] = placeholder;
      return acc;
    }, {});

    setPlaceholders(placeholdersObj);

    // Replace the words within "<>" with <span> tags
    const replacedContent = content.replace(
      regex,
      (match, p1) =>
        `<span class=${styles.editable} data-placeholder="${p1}">${p1}</span>`
    );

    if (divRef.current) {
      // Set the innerHTML of the div
      divRef.current.innerHTML = replacedContent;

      // divRef.current.innerHTML = tabs[tabIndex].content;
    }
  }, [tabIndex, tabs]);

  useEffect(() => {
    if (divRef.current) {
      // Update the innerHTML of the div when placeholders state changes
      const regex = /<([^>]+)>/g;
      const content = tabs[tabIndex].content;

      // Replace the words within "<>" with updated <span> tags
      const replacedContent = String(content).replace(regex, (match, p1) => {
        return `<span class=${styles.editable} data-placeholder="${p1}">${placeholders[p1]}</span>`;
      });

      divRef.current.innerHTML = replacedContent;
    }
  }, [placeholders, tabIndex, tabs]);

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlaceholders((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInput = () => {
    if (autoSaveMode) {
      if (divRef.current) {
        dispatch(setContent(divRef.current.innerText));
      }
    }
  };

  return (
    <section
      style={{
        fontSize: "1rem",
        padding: " 0 2rem",
      }}
    >
      <div className={styles.actionContainer}>
        <ActionBtn
          icons={[GrPowerReset, GrPowerReset]}
          toastMessage={`Content reset!`}
          toastIcon={GrPowerReset}
          onClick={async () => {
            dispatch(reset());
          }}
        />
        <ActionBtn
          icons={[GrFolderCycle, GrFolderCycle]}
          toastMessage={`Auto save turned ${!autoSaveMode ? "ON" : "OFF"}!`}
          toastIcon={GrFolderCycle}
          divStyle={{
            background: autoSaveMode
              ? "var(--white"
              : "linear-gradient(43deg,hsla(0, 0%, 100%, 0.16),hsla(0, 0%, 100%, 0.08))",
          }}
          onClick={async () => {
            dispatch(changeAutoSaveMode());
            if (divRef.current) {
              dispatch(setContent(divRef.current.innerText));
            }
          }}
          style={{
            color: autoSaveMode ? "var(--black)" : "var(--white",
          }}
        />
        <ActionBtn
          icons={[IoSave, IoSaveOutline]}
          toastMessage={`${tabs[tabIndex].name} is updated!`}
          toastIcon={IoSave}
          onClick={async () => {
            if (divRef.current) {
              dispatch(setContent(divRef.current.innerText));
            }
          }}
          style={{
            transform: "rotateY(180deg)",
          }}
        />
        <ActionBtn
          icons={[TbCopyCheck, TbCopy]}
          toastMessage="Copied to Clipboard!"
          toastIcon={IoCopy}
          onClick={async () => {
            const root = divRef.current;
            if (root) {
              if ("clipboard" in navigator) {
                return await navigator.clipboard.writeText(root.innerText);
              } else {
                return document.execCommand("copy", true, root.innerText);
              }
            }
          }}
        />
      </div>
      <div
        contentEditable={false}
        aria-disabled
        ref={divRef}
        className={`${styles.textarea} glassy`}
        style={{
          background: theme === Theme.DARK ? "initial" : "var(--backdrop-bg)",
        }}
        onChange={handleInput}
      />
      <div style={{background: '#fff'}}>
        <div>
          {Object.keys(placeholders).map((key) => (
            <div key={key}>
              <label>
                {key}:
                <input
                  type="text"
                  name={key}
                  value={placeholders[key]}
                  onChange={handleChange}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TabScreen);
