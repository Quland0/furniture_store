import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
    const { categoryName } = useParams();

    // Данные категорий
    const categoryData = {
        bedroom: 'Информация о спальнях: кровати, шкафы, прикроватные тумбы.',
        kitchen: 'Информация о кухнях: кухонные гарнитуры, столешницы.',
        "living-room": 'Информация о гостиных: диваны, шкафы, журнальные столики.',
        "kids-room": 'Информация о детских: кроватки, рабочие столы, стулья.',
        tables: 'Информация о столах и стульях.',
        sofas: 'Информация о мягкой мебели: диваны, кресла.',
        hallway: 'Информация о мебели для прихожей.',
        chandeliers: 'Информация о люстрах.',
    };

    const content = categoryData[categoryName] || 'Категория не найдена';

    return (
        <div style={{padding: '20px'}}>
            <h1 style={{marginTop: '120px'}}>Категория: {categoryName}</h1>
            <p>{content}</p>
        </div>
    );
};

export default CategoryPage;
