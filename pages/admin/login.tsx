import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
//import LitJsSdk from 'lit-js-sdk';
import jwt_decode from "jwt-decode";
const LitJsSdk = require('lit-js-sdk');


const accessControlConditions = [
    {
      method: "getBalance",
      params: [":userAddress"],
      chain: 'solana',
      returnValueTest: {
        key: "",
        comparator: ">=",
        value: "100000000", // equals 0.1 SOL
      },
    },
  ];

const resourceId = {
    baseUrl: 'http://localhost:3000',
    path: '/dan',
    orgId: "",
    role: "",
    extraData: ""
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
      console.log('>>>>>> attempting to fetch signed token! <<<<<<')
      jwt = await litNodeClient.getSignedToken(signingArgs)
    } catch(err) {
      console.log('error fetching jwt', err);
    }

    if (jwt) {
      console.log('signing token found', { jwt })
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
    const { verified, header, payload } = LitJsSdk.verifyJwt({jwt});
    if (payload.baseUrl !== "http://localhost:3000" || payload.path !== "/admin/login" || payload.orgId !== "" || payload.role !== "" || payload.extraData !== "") {
      console.log('Success!');
      setIsAdmin(true);
    }
  }

  useEffect(() => {

    validateUser();

  }, [])

    return (
      <div>
        <h1>Verifying that you are an admin...</h1>
        {isAdmin && renderSecretAdminContent()}
      </div>
    );
}