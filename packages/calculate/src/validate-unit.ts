const hasUnvalidUnitValue = /^(-)?\d+([A-Za-z]+)$/;

const extractUnvalidUnitValueRegex = /(?=[A-Za-z]+)/;

type Validator = (value: string) => void;

export function createUnitValidator(isUnitValueRegex: RegExp): Validator {

    const validator: Validator = value => {

        if (!isUnitValueRegex.test(value)) {

            if (hasUnvalidUnitValue.test(value)) {
    
                const [, unit] = value.split(extractUnvalidUnitValueRegex);
    
                throw new Error(`Unsported unit type ${unit} in ${value}`);
            }
    
            throw new Error(`Unable to parse ${value}`);
        }
    };

    return validator;
};