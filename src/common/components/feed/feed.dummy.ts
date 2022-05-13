export const PROFILES = {
  wga: {
    pubkey: 'asdf',
    handle: '@wgarrettdavis',
  },
  kayla: {
    pubkey: 'asdfgggg',
    handle: '@kaylakane',
  },
  sleepr: {
    pubkey: 'fghsdfgdsg',
    handle: '@sleeprNFTS',
  },
  sik: {
    pubkey: 'fghsdfgdssfasdfg',
    handle: '@sikedelic',
  },
  nate: {
    pubkey: 'asdfasdfsf',
    handle: '@N8Solomon',
  },
  yosh: {
    pubkey: 'asdfasyost',
    handle: '@yoshidanft',
  },
};

export const NFTS = {
  yoshida: {
    creator: PROFILES.sik,
    address: 'sjjxjcjvxcvsfafasdf',
    imageURL:
      'https://assets.holaplex.tools/ipfs/bafybeidwbbs2mqyzld64rqkbbqbt57hvcas6h6peimkfmsq3kkzhzl4ooy?width=600',
    name: 'Yoshida #003',
    storeSubdomain: 'sika',
  },
};

export const FEED_EVENTS_DUMMY = [
  {
    __typename: 'FollowEvent',
    feedEventId: '4dd91759-9f97-4984-9666-b71e33c9ffab',
    graphConnectionAddress: '4fM9YQhdvavfPViNbm7AxwWGjmyTCnTbEMYdCQTdiLSo',
    createdAt: '2022-04-26T14:47:44.819201+00:00',
    connection: {
      address: '4fM9YQhdvavfPViNbm7AxwWGjmyTCnTbEMYdCQTdiLSo',
      from: {
        address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
        profile: null,
      },
      to: {
        address: '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR',
        profile: {
          handle: 'belle__sol',
        },
      },
    },
  },
  {
    __typename: 'FollowEvent',
    feedEventId: '4dd91759-9f97-4984-9666-b71e33c9ffsab',
    graphConnectionAddress: '4fM9YQhdvavfPViNbm7AxwWGjmyTCnTbEMYdCQTadiLSo',
    createdAt: '2022-04-27T14:47:44.819201+00:00',
    connection: {
      address: '4fM9YQhdvavfPViNbm7AxwWGjmyTCnTbEMYdCQTdiLSo',
      from: {
        address: '2fLigDC5sgXmcVMzQUz3vBqoHSj2yCbAJW1oYX8qbyoR',
        profile: null,
      },
      to: {
        address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
        profile: {
          handle: 'belle__sol',
        },
      },
    },
  },
  {
    __typename: 'OfferEvent',
    feedEventId: '94d2a65b-6547-4b09-ad02-ee8dba82da79',
    createdAt: '2022-04-25T20:39:53.332329+00:00',
    offer: {
      buyer: 'GJMCz6W1mcjZZD8jK5kNSPzKWDVTD4vHZCgm8kCdiVNS',
      price: 250000000,
      nft: {
        address: '4SET3vVDsCHYCYQaRrWrDHBJojkLtAxvMe18suPr7Ycf',
        name: 'DreamerKid',
        image:
          'https://assets2.holaplex.tools/ipfs/bafkreiahhvowe5lfdtdjsltyvvgy6emen3lfrzfrszv5g5jzmapalw2mda?width=600',
        // 'https://assets.holaplex.tools/ipfs/bafybeich4igoclnufqimgeghk3blqpqhdjzu6ilhuvd4hje5kcvlh2wpiu?width=600',
        description: 'my description',
        creators: [
          {
            address: 'asdfasdf',
            twitterHandle: 'fffffff',
          },
        ],
        mintAddress: 'fasdfasdfsaf',
      },
    },
  },
  {
    __typename: 'PurchaseEvent',
    feedEventId: 'asdfasdf',
    createdAt: '2022-04-25T15:30:43',
    purchase: {
      buyer: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
      seller: '3XzWJgu5WEU3GV3mHkWKDYtMXVybUhGeFt7N6uwkcezF',
      price: 1500000000000,
      nft: {
        name: 'Somyed',
        image:
          'https://assets.holaplex.tools/ipfs/bafybeich4igoclnufqimgeghk3blqpqhdjzu6ilhuvd4hje5kcvlh2wpiu?width=600',
        description: 'asdfasdf',
      },
    },
  },
  {
    __typename: 'MintEvent',
    feedEventId: 'asdfasdfsss',
    createdAt: '2022-04-25T11:30:43',
    nft: {
      name: 'Yogi',
      image:
        'https://assets.holaplex.tools/ipfs/bafybeidpfnobrzwdj53nlpdd2ryz4yignl4viloxkjb2a2rnpuo5a27ppq?width=600',
      description: 'asdfasdasdasdf',
      creators: [
        {
          address: 'NWswq7QR7E1i1jkdkddHQUFtRPihqBmJ7MfnMCcUf4H',
          profile: {
            handle: 'kristianeboe',
            pfp: 'https://pbs.twimg.com/profile_images/1502268999316525059/nZNPG8GX_bigger.jpg',
          },
        },
      ],
    },
  },
];
