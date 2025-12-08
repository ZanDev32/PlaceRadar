import React from 'react';
import mascot from '../public/mascot.png';

const Home = () => {
    return (
        <div className="hero">
            <img src={mascot} alt="PlaceRadar mascot" className="hero_image" />
            <h1>Hello PlaceRadar</h1>
            <p>Ini adalah Front-End PlaceRadar.</p>
            <nav>
                <a href="/nagios">NagiOS</a>
                {' | '}
                <a href="/pgadmin">pgAdmin</a>
                {' | '}
                <a href="/api">api</a>
            </nav>
        </div>
    );
};

export default Home;