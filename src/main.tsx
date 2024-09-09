import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./i18n/i18n";
import "bootstrap/dist/css/bootstrap.min.css";
import "./static/styles/index.css";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <RecoilRoot>
    <ToastContainer />
    <App />
  </RecoilRoot>
);
