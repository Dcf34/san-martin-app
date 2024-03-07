export function cleanParamBool(bool?:boolean|null) {    
    return bool != undefined && bool != null ? bool : '';
}

export function cleanParam(value?:string|null) {
    return value ? value : '';
}

export function cleanParamNum(value?:number|null) {
    return value || value === 0 ? value : '';
}

export function cleanParamDate(date?:Date|null) {
    return date ? date.toISOString() : '';
}

export function cleanParamDateSub(date?:Date|null) {
    return date ? date.toISOString().substring(0,10) : '';
}

export function cleanParamArray(array?: any[]|null) {
    return array && array.length > 0 ? array.toString() : '';
}