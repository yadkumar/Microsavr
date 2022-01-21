import { etfNames } from "./constants";

export const getEtfSymbol = (etfName: string) => {
    let etfSymbol = 'VB';
    switch (etfName) {
        case etfNames.VOO:
            etfSymbol = 'VOO';
            break;
        case etfNames.SHY:
            etfSymbol = 'SHY';
            break;
        case etfNames.VB:
            etfSymbol = 'VB';
            break;
    }
    return etfSymbol;
}