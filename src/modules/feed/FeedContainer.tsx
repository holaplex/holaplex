import WhoToFollowList from './WhoToFollowList';

function FollowingFeed() {
  return <div>FollowingFeed</div>;
}

function DiscoveryFeed() {
  return <div>DiscoveryFeed</div>;
}

function MyActivityList() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="m-0 text-base font-medium text-white">Your activity</h3>
        <button className="text-base text-gray-300">See more</button>
      </div>
    </div>
  );
}

function ProfileCard() {
  // expanded = true / false
}

function BackToTopBtn() {
  return (
    <button className="absolute right-8 bottom-8 rounded-full bg-gray-900">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.99935 12.8332V1.1665M6.99935 1.1665L1.16602 6.99984M6.99935 1.1665L12.8327 6.99984"
          stroke="white"
          strokeWidth="1.67"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function FeedContainer() {
  const myPubkey: string = '';

  const mode: 'Following' | 'Discovery' = 'Following';

  return (
    <div className="flex">
      <div className="w-2/3">
        <FollowingFeed />

        <DiscoveryFeed />
      </div>
      <div className="w-1/3 space-y-7">
        <WhoToFollowList />
        <MyActivityList />
      </div>
      <BackToTopBtn />
    </div>
  );
}
