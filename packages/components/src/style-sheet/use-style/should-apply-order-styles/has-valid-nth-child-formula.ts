export function hasValidNthChildFormula(index: number, nthChildFormula: string): boolean {

    const { a, b } = extractNthChildFormulaValues(nthChildFormula);

    const value = (index - b)/a;

    return Number.isInteger(value);
};

type NthChildValue = {
    a: number;
    b: number;
};

function extractNthChildFormulaValues(nthChildFormula: string): NthChildValue {

    const tokens = extractNthChildFormulaTokens(nthChildFormula);

    const nthChildValue: NthChildValue = {
        a: 0,
        b: 0
    };

    const nToken = tokens.find(isNToken);

    const aToken = tokens.find(isAToken);

    const bToken = tokens.find(isBToken);

    if (!nToken) {
        
        nthChildValue.b = Number(tokens[0]);
    }
    else {

        if (aToken) {

            if (aToken === "-") {

                nthChildValue.a = -1;
            }
            else {

                nthChildValue.a = Number(aToken);
            }
        }
        else {

            nthChildValue.a = 1;
        }

        if (bToken) {

            nthChildValue.b = Number(bToken.split("+")[1]);
        }
        else {

            nthChildValue.b = 0;
        }
    }

    return nthChildValue;
};

const extractNthChildFormulaTokensRegex = /(?=n)|(?<=n)/;

function extractNthChildFormulaTokens(nthChildFormula: string): string[] {

    return nthChildFormula.split(extractNthChildFormulaTokensRegex);
};

const isATokenRegex = /^((-)?\d+)|-$/;

function isAToken(token: string): boolean {

    return isATokenRegex.test(token);
};

const isBTokenRegex = /^\+\d+$/;

function isBToken(token: string): boolean {

    return isBTokenRegex.test(token);
};

function isNToken(token: string): boolean {

    return token === "n";
};