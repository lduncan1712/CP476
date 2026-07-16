import React, {createContext, useContext, useEffect, useState} from "react";
import {api} from "../api.js";

const CategoriesContext = createContext([]);

export function CategoriesProvider({children}) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api("/categories").then(setCategories)
    }, []);

    return (
        <CategoriesContext.Provider value={categories}>
            {children}
        </CategoriesContext.Provider>
    );
}

export const useCategories = () => useContext(CategoriesContext);
