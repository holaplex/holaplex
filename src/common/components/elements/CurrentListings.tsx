import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Listing, ListingPreview, SkeletonListing } from './ListingPreview';
import { generateListingShell } from '@/common/constants/demoContent';

export function CurrentListings(props: { sortBy: string; filters: string[]; listings: Listing[] }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Listing[]>(props.listings.slice(0, 20));
  const [cursor, setCursor] = useState(20);
  const pageSize = 20;

  const loadMoreData = (cursor2: number) => {
    if (loading) {
      return;
    }
    setLoading(true);
    new Promise((resolve) =>
      setTimeout(() => resolve(props.listings.slice(cursor2, cursor2 + pageSize)), 1000)
    )
      // fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
      //   .then((res) => res.json())
      // @ts-ignore
      .then((newListings: Listing[]) => {
        setData([...data, ...newListings]);
        setCursor(cursor2 + pageSize);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    setData([]);
    //setCursor(0);
    console.log('reset infinite scroll', {
      data,
      cursor,
    });
    loadMoreData(0);
  }, [props.listings, props.sortBy, props.filters]);

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => loadMoreData(cursor)}
      hasMore={data.length < props.listings.length / 10}
      loader={
        <List
          grid={{
            xs: 1,
            sm: 1,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4, // could even consider 5 for xxl
            gutter: 24,
          }}
          dataSource={Array(8)
            .fill(null)
            .map((_, i) => generateListingShell(i.toString()))}
          renderItem={() => <SkeletonListing />}
        />
      }
      endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      scrollableTarget="scrollableDiv"
    >
      <List
        //   pagination={{
        //     // position: 'top',
        //     pageSize: 8,
        //     defaultCurrent: 1,
        //     showSizeChanger: false,
        //     style: {
        //       margin: '24px auto',
        //       textAlign: 'center',
        //     },
        //   }}
        grid={{
          xs: 1,
          sm: 1,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4, // could even consider 5 for xxl
          gutter: 24,
        }}
        dataSource={data}
        renderItem={(listing, i) => (
          // @ts-ignore
          <List.Item key={listing?.address || i}>
            {/* @ts-ignore */}
            {!listing.subdomain ? (
              <div style={{ padding: 24 }}>
                <SkeletonListing />
              </div>
            ) : (
              <ListingPreview {...listing} />
            )}
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
}
