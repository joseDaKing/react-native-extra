import { useMemo } from "react";

import {
    useCssUnits,
    CssUnitsObject,
    CssUnits
}
from "./css-unit-hooks";



export const useInitCssNumberValue = () => {

    const units = useCssUnits();

    const useCssNumberValue = (value: string): number => {

        return computeCssNumberValue(value, units);
    };

    return useCssNumberValue;
};

export const useCssNumberValue = (value: string): number => {

    const cssNumberValue = useInitCssNumberValue();

    return useMemo(() => cssNumberValue(value), [ value ]);
};



export function computeCssNumberValue(value: string, units: CssUnitsObject): number {

    validateUnit(value);

    const [factor, unit] = extractCssNumberValue(value);

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

const extractCssNumberValueRegex = /(?=(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px))/;

function extractCssNumberValue(value: string): [number, CssUnits|"px"] {

    return value.split(extractCssNumberValueRegex) as [number, CssUnits|"px"];
};



const isCssNumberValueRegex = /^\d+(vh|vw|vmax|vmin|mm|cm|in|pt|pc|rem|px)$/;

const hasUnvalidCssNumberValue = /^\d+([A-Za-z]+)$/;

const extractUnvalidCssNumberValueRegex = /(?=[A-Za-z]+)/;

function validateUnit(value: string): void {

    if (!isCssNumberValueRegex.test(value)) {

        if (hasUnvalidCssNumberValue.test(value)) {

            const [, unit] = value.split(extractUnvalidCssNumberValueRegex);

            throw new Error(`Unsported unit type ${unit} in ${value}`);
        }

        throw new Error(`Unable to parse ${value}`);
    }
};