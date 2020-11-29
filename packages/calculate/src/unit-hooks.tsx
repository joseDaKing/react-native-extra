import React, { createContext, useContext } from "react";

import { useWindowDimensions } from "react-native";



type Unit = () => number;

const useVhUnit: Unit = () => {

    const { height } = useWindowDimensions();

    return height / 100;
};

const useVwUnit: Unit = () => {

    const { width } = useWindowDimensions();

    return width / 100;
};

const useVmaxUnit: Unit = () => {

    const { height, width } = useWindowDimensions();

    return Math.max(width, height) / 100;
};

const useVminUnit: Unit = () => {

    const { height, width } = useWindowDimensions();

    return Math.min(width, height) / 100;
};



const RemContext = createContext(16);

type RemProviderProps = {
    value: number;
}

export const RemProvider: React.FC<RemProviderProps> = ({ children, value }) => {

    return (
        <RemContext.Provider value={value}>
            { children }
        </RemContext.Provider>
    );
};

const useRemUnit: Unit = () => {

    const remValue = useContext(RemContext);

    return remValue;
};



const constantUnits = {
    em: 16,
    rem: 16,
    cm: 96 / 2.54,
    mm: 96 / 2.54 / 10,
    in: 96,
    pt: 72,
    pc: 72 / 12,
};



export type Units = "rem" | "pt" | "pc" | "in" | "cm" | "mm" | "vmin" | "vmax" | "vh" | "vw";

export type UnitsObject = {
    [Key in Units]: number;
}

export const useUnits = (): UnitsObject => {

    return {
        ...constantUnits,
        rem: useRemUnit(),
        vmin: useVminUnit(),
        vmax: useVmaxUnit(),
        vh: useVhUnit(),
        vw: useVwUnit()
    };
};