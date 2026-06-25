import React, {createContext, useContext, useEffect, useState} from "react";
import {api} from "../api.js";

const EntitiesContext = createContext([]);

export function EntitiesProvider({children}) {
    const [entities, setEntities] = useState([]);

    useEffect(() => {
        api("./entities").then(setEntities)
    }, []);

    return (
        <EntityContext.Provider value={entities}>
            {children}
        </EntityContext.Provider>
    );
}

export const useEntities = () => useContext(EntitiesContext);
