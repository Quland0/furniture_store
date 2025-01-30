import { makeAutoObservable } from "mobx";

export default class FurnitureStore {
    constructor() {
        this._types = [
            { id: 1, name: "Спальни" },
            { id: 2, name: "Кухни" }
        ];
        this._manufacturers = [
            { id: 1, name: "Арида" },
            { id: 2, name: "Milana group" }, // Исправлен повторяющийся id
        ];
        this._furnitures = [
            { id: 1, name: "Спальня виктория", price: 130000, rating: 5, img: "https://imgur.com/LcHP2oT" },
            { id: 2, name: "Кухня Джоконда", price: 120000, rating: 5, img: "https://imgur.com/LcHP2oT" },
            { id: 3, name: "Кровать Версаль", price: 10000, rating: 5, img: "https://imgur.com/LcHP2oT" },
            { id: 4, name: "Стол стулович", price: 30000, rating: 5, img: "https://imgur.com/LcHP2oT" },
            { id: 5, name: "Диван креслович", price: 100000, rating: 5, img: "https://imgur.com/LcHP2oT" },
        ];
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setManufacturers(manufacturers) {
        this._manufacturers = manufacturers;
    }

    setFurnitures(furnitures) {
        this._furnitures = furnitures;
    }

    get Types() {
        return this._types;
    }

    get Manufacturers() {
        return this._manufacturers;
    }

    get Furnitures() {
        return this._furnitures;
    }
}
