import React, { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
const LitJsSdk = require('lit-js-sdk');
import { Spinner } from '@/common/components/elements/Spinner';

const accessControlConditions = [
  {
    method: "balanceOfToken",
    params: ["6855BL6aaQW9NaJUtbMqyYXnewjWdnSrQxdarKQ54fdD"],
    chain: "solana",
    returnValueTest: {
      key: "$.amount",
      comparator: ">",
      value: "0",
    },
  },
];

const resourceId = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    path: process.env.NEXT_PUBLIC_ADMIN_PATH,
    orgId: "none",
    role: "none",
    extraData: "none"
}

async function fetchToken() {

    const litNodeClient = new LitJsSdk.LitNodeClient();


    const solAuthSig = await LitJsSdk.checkAndSignAuthMessage({ chain: 'solana' });

    const chain = 'solana';
    const permanent = false;

    const signingArgs = {
      solRpcConditions: accessControlConditions,
      chain,
      authSig: solAuthSig,
      resourceId
    }

    await litNodeClient.connect();
    let jwt;
    try {
      jwt = await litNodeClient.getSignedToken(signingArgs);
    } catch(err) {
      console.log('error fetching jwt', err);
    }

    if (jwt) {
      return jwt;
    }
}

const renderSecretAdminContent = () => {

  return(<h1>Secret Admin Content</h1>);
}

export default function AdminLogin() {
  const [isAdmin, setIsAdmin] = useState(false);

  const validateUser = async () => {
    const jwt = await fetchToken();
    let newResponse = (JSON.stringify(jwt_decode(jwt), null, 2));
    if (newResponse) {
      setIsAdmin(true);
    }
  }

  useEffect(() => {

    validateUser();

  }, [])

    return (
      <div className="mt-20 flex flex-col items-center text-center">
        {isAdmin===false ?
          <>
        <h1 className="text-3xl font-medium font-semi-bold">
          Verifying that you hold at least one Admin Token...
        </h1>
        <Spinner />
          </>
        : (
          <>
          <h1 className="text-3xl font-medium font-semi-bold">
            Welcome to the Holaplex Admin Page!
          </h1>
            </>
        )
        }
        {isAdmin && renderSecretAdminContent()}
      </div>
    );
}