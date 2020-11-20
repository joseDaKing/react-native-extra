import React, { createContext, useContext } from "react";

import { useWindowDimensions } from "react-native";



type Unit = () => number;

const useCssVh: Unit = () => {

    const { height } = useWindowDimensions();

    return height / 100;
};

const useCssVw: Unit = () => {

    const { width } = useWindowDimensions();

    return width / 100;
};

const useCssVmax: Unit = () => {

    const { height, width } = useWindowDimensions();

    return Math.max(width, height) / 100;
};

const useCssVmin: Unit = () => {

    const { height, width } = useWindowDimensions();

    return Math.min(width, height) / 100;
};

const useCssMm: Unit = () => {

    return 3.78;
};

const useCssCm: Unit = () => {

    return 37.8;
};

const useCssIn: Unit = () => {

    return 96;
};

const useCssPt: Unit = () => {

    return 1.33;
};

const useCssPc: Unit = () => {

    return 1.33 * 12
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

const useCssRem: Unit = () => {

    const remValue = useContext(RemContext);

    return remValue;
};



export type CssUnits = "rem" | "pt" | "pc" | "in" | "cm" | "mm" | "vmin" | "vmax" | "vh" | "vw";

export type CssUnitsObject = {
    [Key in CssUnits]: number;
}

export const useCssUnits = (): CssUnitsObject => {

    return {
        rem: useCssRem(),
        pt: useCssPt(),
        pc: useCssPc(),
        in: useCssIn(),
        cm: useCssCm(),
        mm: useCssMm(),
        vmin: useCssVmin(),
        vmax: useCssVmax(),
        vh: useCssVh(),
        vw: useCssVw()
    };
};