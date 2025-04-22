import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";

export const CreateType = async (type) => {
    const {data} = await $authHost.post('api/type', type);
    return data;
}
export const fetchTypes = async ()=> {
    const {data} = await $host.get('api/type');
    return data;
}
export const deleteType = async (id) => {
    const { data } = await $authHost.delete(`api/type/${id}`);
    return data;
}

export const createSubType = async (subType) => {
    const { data } = await $authHost.post('api/subtype', subType);
    return data;
}

export const fetchSubTypes = async () => {
    const { data } = await $host.get('api/subtype');
    return data;
}
export const fetchSubtypesByTypeId = async (typeId) => {
    const { data } = await $host.get(`api/subtype/by-type/${typeId}`);
    return data;
};

export const deleteSubType = async (id) => {
    const { data } = await $authHost.delete(`api/subtype/${id}`);
    return data;
}
export const CreateManufacturer = async (type) => {
    const {data} = await $authHost.post('api/manufacturer', type);
    return data;
}
export const fetchManufacturers = async ()=> {
    const {data} = await $host.get('api/manufacturer');
    return data;
}
export const deleteManufacturer = async (id) => {
    const { data } = await $authHost.delete(`api/manufacturer/${id}`);
    return data;
}