import { $authHost } from './index';

export const fetchFavorites = async () => {
    const { data } = await $authHost.get('/api/favorites');
    return data;
};

export const addToFavorites = async (furnitureId) => {
    const { data } = await $authHost.post('/api/favorites/add', { furnitureId });
    return data;
};

export const removeFromFavorites = async (furnitureId) => {
    const { data } = await $authHost.post('/api/favorites/remove', { furnitureId });
    return data;
};
