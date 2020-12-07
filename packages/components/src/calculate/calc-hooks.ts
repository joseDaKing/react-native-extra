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



export type  UseRotationCalc = (expression: string) => string;

export const useRotationCalcFactory = (): UseRotationCalc => {

    const useRotationCalc: UseRotationCalc = (expression: string): string => {

        const degrees = calculate(`calc(${expression})`, value => computeRotationValue(value));

        return `${degrees}deg`;
    };

    return useRotationCalc;
};