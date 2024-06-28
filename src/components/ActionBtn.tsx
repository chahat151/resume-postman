import React, { MouseEvent, useState, CSSProperties } from "react";
import { IconType } from "react-icons";
import styles from "./ActionBtn.module.css";
import { IoNotificationsCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { guidGenerator } from "utils/functions";

interface ActionBtnProps {
  icons: [IconType, IconType];
  onClick: (event: MouseEvent<HTMLDivElement>) => Promise<any>;
  toastIcon?: IconType;
  toastMessage?: string;
  divStyle?: CSSProperties;
  linearGradient?: string[];
  tooltipText?: string;
  [key: string]: any;
}

const ActionBtn: React.FC<ActionBtnProps> = ({
  icons,
  toastIcon: ToastIcon = IoNotificationsCircle,
  onClick,
  toastMessage,
  divStyle = {},
  linearGradient,
  tooltipText,
  ...props
}) => {
  const [Icon1, Icon2] = icons;
  const [isCopied, setIsCopied] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false); // State for tooltip visibility

  const handleMouseEnter = () => {
    setIsTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  return (
    <div
      className={`${styles.actionBtn} glassy`}
      style={divStyle}
      onClick={async (e) => {
        setIsCopied(true);
        await onClick(e);
        toastMessage &&
          toast(toastMessage, {
            toastId: guidGenerator(),
            icon: <ToastIcon />,
            onClose: () => {
              return setIsCopied(false);
            },
          });
      }}
      onMouseEnter={handleMouseEnter} // Show tooltip on mouse enter
      onMouseLeave={handleMouseLeave}
    >
      {linearGradient && (
        <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {linearGradient.map((el, index) => {
                const offset =
                  index === 0
                    ? "0%"
                    : index === linearGradient.length - 1
                    ? "100%"
                    : `${(index / (linearGradient.length - 1)) * 100}%`;
                return (
                  <stop
                    key={index}
                    offset={offset}
                    style={{ stopColor: el, stopOpacity: 1 }}
                  />
                );
              })}
            </linearGradient>
          </defs>
        </svg>
      )}
      {isCopied ? (
        <Icon1
          className={`${styles.actionIcon}  ${linearGradient && styles.icon}`}
          {...props}
        />
      ) : (
        <Icon2
          className={`${styles.actionIcon}  ${linearGradient && styles.icon}`}
          {...props}
        />
      )}
      {/* Tooltip element */}
      {tooltipText && isTooltipVisible && (
        <div className={styles.tooltip}>
          {tooltipText}
          {/* You can style this tooltip further in your CSS */}
        </div>
      )}
    </div>
  );
};

export default ActionBtn;
