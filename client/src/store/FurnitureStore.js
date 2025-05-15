import { makeAutoObservable } from "mobx";


export default class FurnitureStore {
    constructor() {
        this._types = [
        ];
        this._manufacturers = [
        ];
        this._furnitures = [
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

    get furnitures() {
        return this._furnitures;
    }
}
