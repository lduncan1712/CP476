import React, {createContext, useContext, useEffect, useState} from "react";
import {api} from "../api.js";

const EntitiesContext = createContext([]);

export function EntitiesProvider({children}) {
    const [entities, setEntities] = useState([]);

    useEffect(() => {
        api("/entities").then(setEntities)
    }, []);

    // console.log("Entities: " + JSON.stringify(entities))

    return (
        <EntitiesContext.Provider value={entities}>
            {children}
        </EntitiesContext.Provider>
    );
}

export const useEntities = () => useContext(EntitiesContext);
