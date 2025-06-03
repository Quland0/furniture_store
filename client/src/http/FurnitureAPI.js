import { $host, $authHost } from "./index";

// === Типы ===
export const createType = async (type) => {
    const { data } = await $authHost.post("type", type);
    return data;
};
export const fetchTypes = async () => {
    const { data } = await $host.get("type");
    return data;
};
export const updateType = async (id, newName) => {
    const { data } = await $authHost.put(`type/${id}`, { name: newName });
    return data;
};
export const deleteType = async (id) => {
    const { data } = await $authHost.delete(`type/${id}`);
    return data;
};

// === Подтипы ===
export const createSubType = async (subType) => {
    const { data } = await $authHost.post("subtype", subType);
    return data;
};
export const fetchSubTypes = async () => {
    const { data } = await $host.get("subtype");
    return data;
};
export const fetchSubtypesByTypeId = async (typeId) => {
    const { data } = await $host.get(`subtype/by-type/${typeId}`);
    return data;
};
export const updateSubType = async (id, newName) => {
    const { data } = await $authHost.put(`subtype/${id}`, { name: newName });
    return data;
};
export const deleteSubType = async (id) => {
    const { data } = await $authHost.delete(`subtype/${id}`);
    return data;
};

// === Производители ===
export const createManufacturer = async (manufacturer) => {
    const { data } = await $authHost.post("manufacturer", manufacturer);
    return data;
};
export const fetchManufacturers = async () => {
    const { data } = await $host.get("manufacturer");
    return data;
};
export const updateManufacturer = async (id, newName) => {
    const { data } = await $authHost.put(`manufacturer/${id}`, { name: newName });
    return data;
};
export const deleteManufacturer = async (id) => {
    const { data } = await $authHost.delete(`manufacturer/${id}`);
    return data;
};

// === Мебель ===
export const createFurniture = async (formData) => {
    const { data } = await $authHost.post(
        "furniture",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return data;
};
export const updateFurniture = async (id, formData) => {
    const { data } = await $authHost.put(
        `furniture/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return data;
};
export const fetchFurniture = async () => {
    const { data } = await $host.get("furniture", {
        params: { includeHidden: "true" }
    });
    return data;
};
export const fetchOneFurniture = async (id) => {
    const { data } = await $authHost.get(`furniture/${id}`);
    return data;
};
export const deleteFurniture = async (id) => {
    const { data } = await $authHost.delete(`furniture/${id}`);
    return data;
};

// для совместимости
export const editType    = updateType;
export const editSubType = updateSubType;
export const CreateType  = createType;

// Отзывы
export const addRating = async ({ furnitureId, rate, name, review }) => {
    const { data } = await $authHost.post("rating/add", {
        furnitureId,
        rate,
        name,
        review
    });
    return data;
};

export const fetchRatingsByFurnitureId = async (furnitureId) => {
    const { data } = await $host.get(`rating/furniture/${furnitureId}`);
    return data;
};

export const fetchAverageRating = async (furnitureId) => {
    const { data } = await $host.get(`rating/average/${furnitureId}`);
    return data;
};
export const fetchSearchResults = async (query) => {
    const { data } = await $host.get(`/furniture/search?q=${query}`)
    return data;
};

