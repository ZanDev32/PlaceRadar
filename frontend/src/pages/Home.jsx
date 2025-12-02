import React from 'react';
import mascot from '../public/mascot.png';

const Home = () => {
    return (
        <div className="hero">
            <img src={mascot} alt="PlaceRadar mascot" className="hero_image" />
            <h1>Hello PlaceRadar</h1>
            <p>Ini adalah Front-End PlaceRadar</p>
        </div>
    );
};

export default Home;