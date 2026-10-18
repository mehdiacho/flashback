import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import { THEME_OPTIONS, setTheme } from '../utils/theme';

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem('theme') || THEME_OPTIONS.SYSTEM
  );

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    setTheme(theme);
  };

  const getToggleIcon = () => {
    switch (currentTheme) {
      case THEME_OPTIONS.LIGHT:
        return <FaSun />;
      case THEME_OPTIONS.DARK:
        return <FaMoon />;
      case THEME_OPTIONS.SYSTEM:
      default:
        return <FaDesktop />;
    }
  };

  return (
    <Dropdown align="end" className="me-3 w-100">
      <Dropdown.Toggle variant="outline-secondary" id="theme-toggle" className='w-25'>
        {getToggleIcon()}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item 
          onClick={() => handleThemeChange(THEME_OPTIONS.LIGHT)}
          active={currentTheme === THEME_OPTIONS.LIGHT}
        >
          <FaSun className="me-2" /> Light
        </Dropdown.Item>
        <Dropdown.Item 
          onClick={() => handleThemeChange(THEME_OPTIONS.DARK)}
          active={currentTheme === THEME_OPTIONS.DARK}
        >
          <FaMoon className="me-2" /> Dark
        </Dropdown.Item>
        <Dropdown.Item 
          onClick={() => handleThemeChange(THEME_OPTIONS.SYSTEM)}
          active={currentTheme === THEME_OPTIONS.SYSTEM}
        >
          <FaDesktop className="me-2" /> System
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ThemeToggle; 