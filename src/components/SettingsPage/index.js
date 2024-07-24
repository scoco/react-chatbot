import React, { useEffect, useState } from 'react';
import style from './style.css';

const SettingsPage = () => {
  const [localStorageItems, setLocalStorageItems] = useState([]);

  const fetchLocalStorageItems = () => {
    const items = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      items.push({ key, value });
    }
    setLocalStorageItems(items);
  };

  const handleResetItem = (key) => {
    localStorage.removeItem(key);
    fetchLocalStorageItems();
  };

  useEffect(() => {
    fetchLocalStorageItems();
  }, []);

  return (
    <div>
      <h1>{'Page d\'option'}</h1>
      <h2 className={style.hello}>Contenu du Local Storage :</h2>
      <ul>
        {localStorageItems.map((item, index) => (
          <li key={index}>
            <strong>{item.key}:</strong>
            <pre>{item.value}</pre>
            <button onClick={() => handleResetItem(item.key)}>Vider le chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsPage;
