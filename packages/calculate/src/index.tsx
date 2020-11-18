import React, { useMemo } from "react";

import { createContext, useContext } from "react";

import { useWindowDimensions } from "react-native";

import calculate from "calc-units";



type Unit = () => number;

const useVh: Unit = () => {

    const { height } = useWindowDimensions();

    return height / 100;
};

const useVw: Unit = () => {

    const { width } = useWindowDimensions();

    return width / 100;
};

const useVmax: Unit = () => {

    const { height, width } = useWindowDimensions();

    return Math.max(width, height) / 100;
};

const useVmin: Unit = () => {

    const { height, width } = useWindowDimensions();

    return Math.min(width, height) / 100;
};

const useMm: Unit = () => {

    return 3.78;
};

const useCm: Unit = () => {

    return 37.8;
};

const useIn: Unit = () => {

    return 96;
};

const usePt: Unit = () => {

    return 1.33;
};

const usePc: Unit = () => {

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

const useRem: Unit = () => {

    const remValue = useContext(RemContext);

    return remValue;
};



export const extractValueAndValueRegex = /(?=(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px))/;

export function useInitUnit() {

    const units = useUnits();

    const useUnit = (value: string): number => {

        return computeUnitValue(value, units);
    };

    return useUnit;
};

export function computeUnitValue(value: string, units: ReturnType<typeof useUnits>) {

    validateUnit(value);

    const [factor, unit] = value.split(extractValueAndValueRegex);

    let pixels: number;

    if (unit === "px") {

        pixels = Number(factor);
    }
    else {

        const unitInPixels = units[unit as keyof typeof units];

        pixels = unitInPixels * Number(factor);
    }

    return pixels;
};



export function useUnit(value: string): number {

    const unit = useInitUnit();

    return useMemo(() => unit(value), [ value ]);
};

export function useUnits() {

    return {
        rem: useRem(),
        pt: usePt(),
        pc: usePc(),
        in: useIn(),
        cm: useCm(),
        mm: useMm(),
        vmin: useVmin(),
        vmax: useVmax(),
        vh: useVh(),
        vw: useVw()
    };
};



const isValueRegex = /^\d+(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px)$/;

const hasUnvalidUnit = /^\d+([A-Za-z]+)$/;

const extractUnvalidUnitRegex = /(?=[A-Za-z]+)/;

export function validateUnit(value: string): void {

    if (!isValueRegex.test(value)) {

        if (hasUnvalidUnit.test(value)) {

            const [, unit] = value.split(extractUnvalidUnitRegex);

            throw new Error(`Unsported unit type ${unit} in ${value}`);
        }

        throw new Error(`Unable to parse ${value}`);
    }
};


type  UseCalc = (expression: string) => number;

export function useInitCalc(): UseCalc {
    
    const units = useUnits();

    const useCalc: UseCalc = (expression: string): number => {

        return calculate(expression, value => computeUnitValue(value, units));
    };

    return useCalc;
};

export const useCalc: UseCalc = expression => {

    const calc = useInitCalc();

    return useMemo(() => calc(expression), [ expression ]);
};