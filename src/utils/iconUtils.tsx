import * as Bs from "react-icons/bs";
import * as Im from "react-icons/im";
import * as Io from "react-icons/io";
import * as Ti from "react-icons/ti";

export const getIconComponent = (logo: string, logoType: string) => {
  switch (logoType) {
    case "bs":
      return Bs[logo as keyof typeof Bs];
    case "im":
      return Im[logo as keyof typeof Im];
    case "io":
      return Io[logo as keyof typeof Io];
    case "ti":
      return Ti[logo as keyof typeof Ti];
    default:
      return null;
  }
};