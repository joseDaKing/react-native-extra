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

const useMmUnit: Unit = () => {

    return 3.78;
};

const useCmUnit: Unit = () => {

    return 37.8;
};

const useInUnit: Unit = () => {

    return 96;
};

const usePtUnit: Unit = () => {

    return 1.33;
};

const usePcUnit: Unit = () => {

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

const useRemUnit: Unit = () => {

    const remValue = useContext(RemContext);

    return remValue;
};



export type Units = "rem" | "pt" | "pc" | "in" | "cm" | "mm" | "vmin" | "vmax" | "vh" | "vw";

export type UnitsObject = {
    [Key in Units]: number;
}

export const useUnits = (): UnitsObject => {

    return {
        rem: useRemUnit(),
        pt: usePtUnit(),
        pc: usePcUnit(),
        in: useInUnit(),
        cm: useCmUnit(),
        mm: useMmUnit(),
        vmin: useVminUnit(),
        vmax: useVmaxUnit(),
        vh: useVhUnit(),
        vw: useVwUnit()
    };
};