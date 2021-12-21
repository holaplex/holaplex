import { Row, Carousel, Typography } from 'antd';
import { Listing, ListingPreview } from './ListingPreview';
const { Text } = Typography;

// still some style cleanup to do here.... :(
export function FeaturedListingCarousel(props: { featuredListings: Listing[] }) {
  return (
    <div style={{ maxWidth: 500 }}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <Text strong>Featured Listings</Text>
      </div>
      <Carousel autoplay={true} dots={{ className: 'carousel-dots' }} dotPosition="top">
        {props.featuredListings.map((listing) => (
          <ListingPreview key={listing.listingAddress} {...listing} />
        ))}
      </Carousel>
      <style global jsx>
        {`
          .carousel-dots {
            position: absolute;
            top: 0 !important;
            right: 0 !important;
            margin-top: -24px !important;
            margin-right: 0px !important;

            justify-content: flex-end !important;
          }
          .carousel-dots > li > button {
            opacity: 1 !important;
            padding-top: 5px !important;
            padding-bottom: 5px !important;
            border-radius: 100%;
          }

          .slick-active > button {
            background: white !important;
          }
        `}
      </style>
    </div>
  );
}
