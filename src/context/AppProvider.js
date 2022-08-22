import React, { useState } from 'react';
import { node } from 'prop-types';

import fetchMealsOrDrinks from '../services/fetchMealsOrDrinks';

import AppContext from './AppContext';

function AppProvider({ children }) {
  const [meals, setMeals] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const ALERT_OF_EMPTY_RESPONSE = 'Sorry, we haven\'t found any '
    + 'recipes for these filters.';

  const requestAPI = (custom, type) => {
    if (search.length > 1 && searchFilter === 'first-letter') {
      return global.alert('Your search must have only 1 (one) character');
    }

    const fetchParameters = custom !== undefined ? custom : [search, searchFilter];
    const updateState = type === 'meals' ? setMeals : setDrinks;

    fetchMealsOrDrinks(...fetchParameters, type)
      .then((data) => {
        if (data[type]?.length === 0 || data[type] === null) {
          return global.alert(ALERT_OF_EMPTY_RESPONSE);
        }
        return updateState(data[type] || []);
      });
  };

  const getMealsFromAPI = (custom) => requestAPI(custom, 'meals');
  const getDrinksFromAPI = (custom) => requestAPI(custom, 'drinks');

  const updateSearch = (value) => setSearch(value);
  const updateSearchFilter = (value) => setSearchFilter(value);

  const value = {
    meals,
    drinks,
    search,
    updateSearch,
    updateSearchFilter,
    getMealsFromAPI,
    getDrinksFromAPI,
  };

  return (
    <AppContext.Provider value={ value }>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: node.isRequired,
};

export default AppProvider;
