import { useMemo } from "react";

import {
    RotationUnits,
    constantRotationUnits
}
from "./unit-hooks";

import { createUnitValidator } from "./validate-unit";



export const useRotationValueFactory = () => { 

    const useNumberValue = (value: string): number => {

        return computeRotationValue(value);
    };

    return useNumberValue;
};

export const useRotationValue = (value: string): number => {

    const rotationValue = useRotationValueFactory();

    return useMemo(() => rotationValue(value), [ value ]);
};



const isRotationValueRegex = /^(-)?\d+(grad|rad|deg|turn)$/;

const validateRotationValue = createUnitValidator(isRotationValueRegex);

export function computeRotationValue(value: string): number {

    validateRotationValue(value);

    const [factor, unit] = extractRotationValue(value);

    let degrees: number;

    const unitInDegrees = constantRotationUnits[unit];

    degrees = unitInDegrees * factor;

    return degrees; 
};



const extractRotationValueRegex = /(?=(grad|rad|deg|turn))/;

function extractRotationValue(value: string): [number, RotationUnits] {

    return value.split(extractRotationValueRegex) as [number, RotationUnits];
};