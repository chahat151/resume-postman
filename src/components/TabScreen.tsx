import { ChangeEvent, memo, useEffect, useRef, useState, useMemo } from "react";
import { IoCopy } from "react-icons/io5";
import { TbCopy, TbCopyCheck, TbEdit } from "react-icons/tb";
import ActionBtn from "./ActionBtn";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  setContent,
  changeAutoSaveMode,
  reset,
  turnOnEditMode,
  turnOffEditMode,
} from "store/features/tabSlice";
import { IoSave } from "react-icons/io5";
import { GrFolderCycle } from "react-icons/gr";
import { GrPowerReset } from "react-icons/gr";
import styles from "./TabScreen.module.css";
import { Theme } from "App";
import { camelCaseToWords } from "utils/functions";

interface TabScreenProps {
  theme: Theme;
}

const TabScreen: React.FC<TabScreenProps> = ({ theme }) => {
  const {
    tabsInfo: tabs,
    tabIndex,
    autoSaveMode,
    editMode,
  } = useAppSelector((state) => state.tabs);
  const dispatch = useAppDispatch();

  const divRef = useRef<HTMLDivElement>(null);
  const [placeholders, setPlaceholders] = useState<{ [key: string]: string }>(
    {}
  );
  const [trigger, setTrigger] = useState(false);
  const regex = useMemo(() => /{([^}]+)}/g, []);

  const content = tabs[tabIndex].content;

  useEffect(() => {
    if (divRef.current) {
      const placeholdersArray = [...content.matchAll(regex)].map(
        (match) => match[1]
      );
      const placeholdersObj = placeholdersArray.reduce((acc, placeholder) => {
        acc[placeholder] = placeholder;
        return acc;
      }, {});

      setPlaceholders(placeholdersObj);

      const replacedContent = content.replace(
        regex,
        (match, p1) =>
          `<span class=${styles.editable} data-placeholder="${p1}">${p1}</span>`
      );

      divRef.current.innerHTML = replacedContent;
    }
  }, [tabs, content, regex, trigger]);

  useEffect(() => {
    if (divRef.current) {
      const replacedContent = String(content).replace(regex, (match, p1) => {
        return `<span class=${styles.editable} data-placeholder="${p1}">${placeholders[p1]}</span>`;
      });

      divRef.current.innerHTML = replacedContent;
    }
  }, [tabs, content, placeholders, regex]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const convertToPlaceholderFormat = () => {
    if (divRef.current) {
      const spanElements = divRef.current.querySelectorAll(
        `.${styles.editable}`
      );
      spanElements.forEach((span) => {
        const placeholder = span.getAttribute("data-placeholder");
        console.log(placeholder, span.innerHTML);
        if (placeholder === span.innerHTML) {
          span.outerHTML = `{${placeholder}}`;
        } else {
          span.outerHTML = span.innerHTML;
        }
      });
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
          tooltipText="Reset"
        />
        {/* <ActionBtn
          icons={[GrFolderCycle, GrFolderCycle]}
          toastMessage={`Auto save turned ${!autoSaveMode ? "ON" : "OFF"}!`}
          toastIcon={GrFolderCycle}
          divStyle={{
            background: autoSaveMode ? "var(--white" : "var(--backdrop-bg)",
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
        /> */}
        {editMode ? (
          <ActionBtn
            icons={[IoSave, IoSave]}
            toastMessage={`${tabs[tabIndex].name} is updated!`}
            toastIcon={IoSave}
            onClick={async () => {
              if (divRef.current) {
                console.log(convertToPlaceholderFormat());
                dispatch(setContent(divRef.current.innerHTML));
                dispatch(turnOffEditMode());
                setTrigger(!trigger);
              }
            }}
            divStyle={{ background: "var(--white)", position: "relative" }}
            linearGradient={["#0fa", "#4579f5", "#9c42f5"]}
            tooltipText="Save"
          />
        ) : (
          <ActionBtn
            icons={[TbEdit, TbEdit]}
            onClick={async () => {
              if (divRef.current) {
                dispatch(turnOnEditMode());
              }
            }}
            tooltipText="Edit"
          />
        )}
        <ActionBtn
          icons={[TbCopyCheck, TbCopy]}
          toastMessage="Copied to Clipboard!"
          toastIcon={IoCopy}
          onClick={async () => {
            const root = divRef.current;
            if (root) {
              if ("clipboard" in navigator) {
                await navigator.clipboard.writeText(root.innerText);
              } else {
                document.execCommand("copy", true, root.innerText);
              }
              // window.scrollTo({
              //   top: root.offsetTop - 50,
              //   left: 0,
              //   behavior: "smooth",
              // });
            }
          }}
          tooltipText="Save"
        />
      </div>
      <div
        contentEditable={editMode}
        aria-disabled
        ref={divRef}
        className={`${styles.textarea} glassy`}
        style={{
          background:
            theme === Theme.DARK
              ? "initial"
              : editMode
              ? "initial"
              : "var(--backdrop-bg)",
          transition: "var(--theme-transition)",
          // color: editMode ? "var(--white)": "var(--zinc2)"
          cursor: editMode ? "initial" : "no-drop",
        }}
        onChange={handleInput}
      />
      {!editMode && (
        <div
          className="glassy"
          style={{
            padding: "2.4rem",
            borderRadius: "24px",
            boxShadow: "var(--box-shadow2)",
            background: theme === Theme.DARK ? "initial" : "var(--backdrop-bg)",
            transition: "var(--theme-transition)",
            marginTop: "1.2rem",
          }}
        >
          <div className={styles.inputContainer}>
            {Object.keys(placeholders).map((key) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <label>{camelCaseToWords(key)}:</label>
                <input
                  type="text"
                  name={key}
                  value={placeholders[key]}
                  onChange={handleChange}
                  className={`${styles.input}
                        ${theme === Theme.DARK ? styles.dark : styles.light}`}
                  onFocus={(e) => {
                    if (e?.target.name === e?.target.value.trim()) {
                      e.target.value = "";
                      handleChange(e);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      e.target.value = e?.target.name;
                      handleChange(e);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(TabScreen);
