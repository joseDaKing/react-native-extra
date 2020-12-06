import { useMemo } from "react";

import { useUnits } from "./unit-hooks";

import { computeUnitValue} from "./unit-value-hooks";

import calculate from "calc-units";

import { computeRotationValue } from "./rotation-value-hooks";



export type  UseCalc = (expression: string) => number;

export const useCalcFactory = (): UseCalc => {
    
    const units = useUnits();

    const useCalc: UseCalc = (expression: string): number => {

        return calculate(`calc(${expression})`, value => computeUnitValue(value, units));
    };

    return useCalc;
};

export const useCalc: UseCalc = expression => {

    const calc = useCalcFactory();

    const units = useUnits();
    
    return useMemo(() => calc(expression), [ 
        expression, 
        ...Object.values(units)
    ]);
};



export type  UseRotationCalc = (expression: string) => string;

export const useRotationCalcFactory = (): UseRotationCalc => {

    const useRotationCalc: UseRotationCalc = (expression: string): string => {

        const degrees = calculate(`calc(${expression})`, value => computeRotationValue(value));

        return `${degrees}deg`;
    };

    return useRotationCalc;
};

export const useRotationCalc: UseRotationCalc = expression => {

    const rotationCalc = useRotationCalcFactory();

    return useMemo(() => rotationCalc(expression), [ expression ]);
};