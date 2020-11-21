import { useMemo } from "react";

import {
    useUnits,
    UnitsObject,
    Units
}
from "./css-unit-hooks";



export const useUnitValueFactory = () => {

    const units = useUnits();

    const useNumberValue = (value: string): number => {

        return computeUnitValue(value, units);
    };

    return useNumberValue;
};

export const useUnitValue = (value: string): number => {

    const unitValue = useUnitValueFactory();

    return useMemo(() => unitValue(value), [ value ]);
};



export function computeUnitValue(value: string, units: UnitsObject): number {

    validateUnit(value);

    const [factor, unit] = extractUnitValue(value);

    let pixels: number;

    if (unit === "px") {

        pixels = factor;
    }
    else {

        const unitInPixels = units[unit];

        pixels = unitInPixels * factor;
    }

    return pixels;
};

const extractUnitValueRegex = /(?=(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px))/;

function extractUnitValue(value: string): [number, Units|"px"] {

    return value.split(extractUnitValueRegex) as [number, Units|"px"];
};



const isUnitValueRegex = /^\d+(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px)$/;

const hasUnvalidUnitValue = /^\d+([A-Za-z]+)$/;

const extractUnvalidUnitValueRegex = /(?=[A-Za-z]+)/;

function validateUnit(value: string): void {

    if (!isUnitValueRegex.test(value)) {

        if (hasUnvalidUnitValue.test(value)) {

            const [, unit] = value.split(extractUnvalidUnitValueRegex);

            throw new Error(`Unsported unit type ${unit} in ${value}`);
        }

        throw new Error(`Unable to parse ${value}`);
    }
};