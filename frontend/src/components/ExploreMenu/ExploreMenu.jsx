import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({ category, setCategory }) => {
    console.log("Current category:", category);
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>
                Explore Menu
            </h1>
            <p className='explore-menu-text'>
                Explore our delicious menu and find your favorite dishes. From appetizers to desserts, we have something for everyone!
            </p>
            <div className="explore-menu-list">
                {menu_list.map((item, index) => {
                    return (
                        <div onClick={() => {
                            console.log("Item clicked:", item.menu_name);
                            setCategory(prev => {
                                const newCategory = prev === item.menu_name ? "All" : item.menu_name;
                                return newCategory;
                            });
                        }} key={index} className="explore-menu-list-item">
                            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt="" />
                            <p>{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
            <hr />
        </div>
    )
}

export default ExploreMenu