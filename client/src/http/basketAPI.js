import { $authHost } from './index';

export const fetchBasket = async () => {
    const { data } = await $authHost.get('basket');
    console.log('… raw basket data:', data);
    return data.basket_furnitures.map(item => {
        const imgs = item.furniture.images || [];
        const fileName = imgs[0]?.img; // первый по порядку
        const url = fileName
            ? `${process.env.REACT_APP_API_URL}/${fileName}`
            : '/placeholder-product.jpg';

        return {
            basketItemId: item.id,
            id:           item.furniture.id,
            name:         item.furniture.name,
            price:        item.furniture.price,
            img:          url,
            manufacturer: item.furniture.manufacturer,
            quantity:     item.quantity
        };
    });
};

export const addToBasket = async (furnitureId, quantity = 1) => {
    const { data } = await $authHost.post('basket/add', { furnitureId, quantity });
    return data;
};

export const removeFromBasket = async (basketItemId) => {
    const { data } = await $authHost.post('basket/remove', { basketFurnitureId: basketItemId });
    return data;
};

export const updateBasketQuantity = async (basketItemId, quantity) => {
    const { data } = await $authHost.post('basket/update', { basketFurnitureId: basketItemId, quantity });
    return data;
};
