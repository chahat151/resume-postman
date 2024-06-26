import React,{ MouseEvent, useState, CSSProperties } from "react";
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
  [key: string]: any;
}

const ActionBtn: React.FC<ActionBtnProps> = ({
  icons,
  toastIcon: ToastIcon = IoNotificationsCircle,
  onClick,
  toastMessage,
  divStyle = {},
  ...props
}) => {
  const [Icon1, Icon2] = icons;
  const [isCopied, setIsCopied] = useState(false);

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
    >
      {isCopied ? (
        <Icon1 className={styles.actionIcon} {...props} />
      ) : (
        <Icon2 className={styles.actionIcon} {...props} />
      )}
    </div>
  );
};

export default ActionBtn;
