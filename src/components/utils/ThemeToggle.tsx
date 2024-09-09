import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { themeState } from "../../recoil/atoms";
import Icon from "./Icon";

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  // Toggle the theme and save it in localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme to localStorage

    // Remove the opposite theme class first and then add the correct one
    if (newTheme === "dark") {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  };

  // Initialize the theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"; // Get saved theme or default to 'light'
    setTheme(savedTheme);

    // Apply the saved theme class to body
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [setTheme]);

  return (
    <button onClick={toggleTheme} className="btn btn-secondary border">
      {theme === "light" ? (
        <Icon icon="circum:dark" className={"fs-3"} />
      ) : (
        <Icon icon="iconoir:sun-light" className={"fs-3"} />
      )}
    </button>
  );
};

export default ThemeToggle;
