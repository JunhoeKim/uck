import { isNumber } from "util";

export function isDigit(c: string) {
    return !isNaN(parseInt(c));
}

export function getDigitLength(value: number) {
    if (value === 0) {
        return 1;
    }
    return Math.floor(Math.log10(value)) + 1;
}

export function isFixType(type: string) {
    return type[0] === 'f';
}

declare global {
    interface Number {
        toString(): string;
        clamp(min: number, max: number): number;
    }
}

Number.prototype.toString = function(radix?: number): string {
    return this.toLocaleString('fullwide', { useGrouping: false });
} 

Number.prototype.clamp = function(min: number, max: number): number {
    return Math.max(min, Math.min(max, this)); 
}

