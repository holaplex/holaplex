import React, { useState, useEffect } from 'react';
import { List, message, Avatar } from 'antd';
import VirtualList from 'rc-virtual-list';
import { Listing, ListingPreview, SkeletonListing } from './ListingPreview';

export function CurrentListingsVirtualized(props: { listings: Listing[] }) {
  const [data, setData] = useState<Listing[]>(props.listings.slice(0, 20));
  const [cursor, setCursor] = useState(20);
  const pageSize = 8;
  const ContainerHeight = 800;

  const appendData = () => {
    //   fetch(fakeDataUrl)
    //   .then((res) => res.json())
    new Promise(
      (resolve) => setTimeout(() => resolve(props.listings.slice(cursor, cursor + pageSize)), 1000)
      // @ts-ignore
    ).then((newListings: Listing[]) => {
      setData(data.concat(newListings));
      message.success(`${newListings.length} more items loaded!`);
    });
  };

  useEffect(() => {
    appendData();
  }, []);

  const onScroll = (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop === ContainerHeight) {
      appendData();
    }
  };

  return (
    <List
      grid={{
        xs: 2,
        sm: 3,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4, // could even consider 5 for xxl
        gutter: 24,
      }}
    >
      <VirtualList
        data={data}
        height={ContainerHeight}
        itemHeight={400}
        itemKey="address"
        onScroll={onScroll}
      >
        {(listing, i) => (
          <List.Item key={listing?.address || i}>
            {/* @ts-ignore */}
            {!listing.subdomain ? <SkeletonListing /> : <ListingPreview {...listing} />}
          </List.Item>
          //   <List.Item key={item.email}>
          //     <List.Item.Meta
          //       avatar={<Avatar src={item.picture.large} />}
          //       title={<a href="https://ant.design">{item.name.last}</a>}
          //       description={item.email}
          //     />
          //     <div>Content</div>
          //   </List.Item>
        )}
      </VirtualList>
    </List>
  );
}
