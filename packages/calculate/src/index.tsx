import React, { useMemo } from "react";

import { createContext, useContext } from "react";

import { useWindowDimensions } from "react-native";

import calculate from "calc-units";



type Unit = (value: number) => number;

const useVh: Unit = value => {

    const { height } = useWindowDimensions();

    return height / 100 * value;
};

const useVw: Unit = value => {

    const { width } = useWindowDimensions();

    return width / 100 * value;
};

const useVmax: Unit = value => {

    const { height, width } = useWindowDimensions();

    return value * Math.max(width, height) / 100;
};

const useVmin: Unit = value => {

    const { height, width } = useWindowDimensions();

    return value * Math.min(width, height) / 100;
};

const useMm: Unit = value => {

    return value * 3.78;
};

const useCm: Unit = value => {

    return value * 37.8;
};

const useIn: Unit = value => {

    return value * 96;
};

const usePt: Unit = value => {

    return value * 1.33;
};

const usePc: Unit = value => {

    return usePt(12) * value;
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

const useRem: Unit = value => {

    const remValue = useContext(RemContext);

    return value * remValue;
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
        rem: useRem(1),
        pt: usePt(1),
        pc: usePc(1),
        in: useIn(1),
        cm: useCm(1),
        mm: useMm(1),
        vmin: useVmin(1),
        vmax: useVmax(1),
        vh: useVh(1),
        vw: useVw(1)
    };
};



const isValueRegex = /^\d+(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px)$/;

const hasUnvalidUnit = /^\d([A-Za-z]+)$/;

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



export function useInitCalc() {
    
    const units = useUnits();

    return (expression: string): number => {

        return calculate(expression, value => computeUnitValue(value, units));
    };
};

export function useCalc(expression: string): number {

    const calc = useInitCalc();

    return useMemo(() => calc(expression), [ expression ]);
};