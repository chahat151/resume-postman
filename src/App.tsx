import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import TabScreen from "./components/TabScreen";
import { ToastContainer, cssTransition } from "react-toastify";
import { BgLight } from "assets";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

// export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut",
});
function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (localStorage.getItem("mode")) {
      return localStorage.getItem("mode") === "dark" ? Theme.DARK : Theme.LIGHT;
    }
    return Theme.DARK;
  });

  useEffect(() => {
    localStorage.setItem("mode", theme);
    const html = document.querySelector("html");
    if (html) {
      html.style.color = theme === Theme.DARK ? "var(--zinc1)" : "var(--black)";
      html.style.background =
        theme === Theme.DARK ? "#212429" : `url(${BgLight})`;
    }
  }, [theme]);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === Theme.DARK ? "dark" : "light"}
        transition={bounce}
      />
      <Header theme={theme} setTheme={setTheme} />
      <main>
        <Tabs
          theme={theme}
        />
        <TabScreen
          theme={theme}
        />
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
