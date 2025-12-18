import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import { LocationProvider } from './context/LocationContext';

const App = () => {
    return (
        <LocationProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </Layout>
            </Router>
        </LocationProvider>
    );
};

export default App;