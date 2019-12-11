/**
 * Sessions Table
 */
export declare class Sessions {
    constructor(name: string, ip: string, user: string, pass: string);
    id: number;
    ip: string;
    name: string;
    user?: string;
    pass?: string;
}
