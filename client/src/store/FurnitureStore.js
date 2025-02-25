import { makeAutoObservable } from "mobx";
import img1 from "../assets/images/products/bedroom/грация.jpg";
import img2 from "../assets/images/products/kitchen/кухня.jpg";
import img3 from "../assets/images/products/bedroom/кровать.jpg";
import img4 from "../assets/images/products/tables−and−chairs/стол.jpg";
import img5 from "../assets/images/products/upholstered−furniture/диван.jpg";

export default class FurnitureStore {
    constructor() {
        this._types = [
            { id: 1, name: "Спальни" },
            { id: 2, name: "Кухни" }
        ];
        this._manufacturers = [
            { id: 1, name: "Арида" },
            { id: 2, name: "Milana group" },
        ];
        this._furnitures = [
            { id: 1, name: "Спальня виктория", price: 130000, rating: 1, reviewsCount: 12, new: true, img: img1 },
            { id: 2, name: "Кухня Джоконда", price: 120000, rating: 4, reviewsCount: 12, new: true, img: img2 },
            { id: 3, name: "Кровать Версаль", price: 10000, rating: 3.5, reviewsCount: 12, new: true, img: img3 },
            { id: 4, name: "Стол стулович", price: 30000, rating: 3, reviewsCount: 12, new: false, img: img4 },
            { id: 5, name: "Диван креслович", price: 100000, rating: 5, reviewsCount: 12, new: true, img: img5 },
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
