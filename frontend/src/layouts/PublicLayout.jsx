import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* This is where the page content (Home/Service) renders */}
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;