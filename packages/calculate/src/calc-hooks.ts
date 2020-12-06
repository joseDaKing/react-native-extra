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



export const useRotationCalcFactory = (): UseCalc => {

    const useCalc: UseCalc = (expression: string): number => {

        return calculate(`calc(${expression})`, value => computeRotationValue(value));
    };

    return useCalc;
};

export const useRotationCalc: UseCalc = expression => {

    const rotationCalc = useRotationCalcFactory();

    return useMemo(() => rotationCalc(expression), [ expression ]);
};