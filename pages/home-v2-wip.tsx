import FeaturedMarkeplacesSection from '@/common/components/home/FeaturedMarketplacesSection';
import Footer from '@/common/components/home/Footer';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <>
      <div className="container mx-auto pb-48">
        <FeaturedMarkeplacesSection />
      </div>
      <Footer />
    </>
  );
};

export default Home;
