export = uck;
export as namespace uck;

declare namespace uck {

    /**
     * specifier에 따라 format 해주는 function을 반환한다.
     */
    export function format(specifier: string): (value: number) => string;

    /**
     * specifier에 맞춰서 value를 format해준다.
     */
    export function convert(specifier: string, value: number): string;
}