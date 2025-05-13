import { createContext, useContext } from "react";

export const ContestDataContext = createContext(null);
export const useContestData = () => useContext(ContestDataContext);
