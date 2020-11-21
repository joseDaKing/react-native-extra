import { useMemo } from "react";

import { useUnits } from "./css-unit-hooks";

import { computeUnitValue} from "./css-number-value-hooks";

import calculate from "calc-units";



export type  UseCalc = (expression: string) => number;

export const useCalcFactory = (): UseCalc => {
    
    const units = useUnits();

    const useCalc: UseCalc = (expression: string): number => {

        return calculate(expression, value => computeUnitValue(value, units));
    };

    return useCalc;
};

export const useCalc: UseCalc = expression => {

    const calc = useCalcFactory();

    return useMemo(() => calc(expression), [ expression ]);
};