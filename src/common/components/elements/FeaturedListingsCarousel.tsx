import { Row, Carousel } from 'antd';
import { Listing, ListingPreview } from './ListingPreview';

export function FeaturedListingCarousel(props: { featuredListings: Listing[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <span
          style={{
            color: 'white',
            opacity: 0.6,
            fontSize: 14,
            fontWeight: 400,
          }}
        >
          Featured listings
        </span>
        {/* <span>Navigation</span> */}
      </div>
      <Carousel autoplay={true} dots={{ className: 'carousel-dots' }} dotPosition="top">
        {props.featuredListings.map((listing) => (
          <ListingPreview key={listing.auctionId} {...listing} />
        ))}
      </Carousel>
      <style global jsx>
        {`
          .carousel-dots {
            position: absolute;
            top: 0 !important;
            right: 0 !important;
            margin-top: -16px !important;
            margin-right: 0px !important;

            justify-content: flex-end !important;
          }
          .carousel-dots > li > button {
            opacity: 1 !important;
          }

          .slick-active > button {
            background: white !important;
          }
        `}
      </style>
    </div>
  );
}
