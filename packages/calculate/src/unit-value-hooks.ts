import { useMemo } from "react";

import {
    useUnits,
    UnitsObject,
    Units
}
from "./unit-hooks";

import { createUnitValidator } from "./validate-unit";



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



const isUnitValueRegex = /^(-)?\d+(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px)$/;

const validateUnitValue = createUnitValidator(isUnitValueRegex);

export function computeUnitValue(value: string, units: UnitsObject): number {

    validateUnitValue(value);

    const [factor, unit] = extractUnitValue(value);

    let pixels: number;

    const unitInPixels = units[unit];

    pixels = unitInPixels * factor;

    return pixels;
};



const extractUnitValueRegex = /(?=(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px))/;

function extractUnitValue(value: string): [number, Units] {

    return value.split(extractUnitValueRegex) as [number, Units|"px"];
};