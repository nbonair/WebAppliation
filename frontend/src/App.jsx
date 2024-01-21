import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CSVUpload from "./components/CsvUpload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <div className="App">
            <ToastContainer position="top-left" autoClose={5000} hideProgressBar closeOnClick className="text-sm" />
            <CSVUpload />
        </div>
    );
};

export default App;
