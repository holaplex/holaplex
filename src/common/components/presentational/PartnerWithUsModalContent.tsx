import Modal, { ModalFuncProps } from 'antd/lib/modal/Modal';

import { Typography, Layout, Space } from 'antd';
const { Header, Content } = Layout;
import Paragraph from 'antd/lib/typography/Paragraph';
import styled from 'styled-components';

const { Title } = Typography;
const HolaLink = styled(Paragraph)`
  cursor: pointer;
  background: linear-gradient(143.77deg, #d24089 8.62%, #b92d44 84.54%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default function PartnerWithUsModalContent() {
  return (
    <div>
      <Title style={{ color: 'white' }} level={2}>
        Partner with us.
      </Title>

      <Content>
        <Paragraph style={{ fontSize: '18px', opacity: 0.6 }}>
          Our mission is to empower creators and collectors by building a suite of integrated tools
          to mint, discover, and sell NFTs.
        </Paragraph>
      </Content>
      <HolaLink>Learn More</HolaLink>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            style={{ marginRight: '1rem' }}
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 50V0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 33.9948 7.66222 18.9568 20.6107 9.54915L50 50Z"
              fill="url(#paint0_linear_484_145)"
            />
            <path
              d="M50.0002 50L20.6109 9.54918C28.893 3.53193 38.8224 0.201866 49.0578 0.00891113L50.0002 50Z"
              fill="url(#paint1_linear_484_145)"
            />
            <path
              d="M49.9999 50L49.0575 0.00888238C49.3716 0.00296092 49.6858 0 49.9999 0V50Z"
              fill="url(#paint2_linear_484_145)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_484_145"
                x1="26.9097"
                y1="6.71428"
                x2="98.4914"
                y2="63.4831"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0989583" stopColor="#841896" />
                <stop offset="1" stopColor="#4F1364" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_484_145"
                x1="25.9243"
                y1="0.856219"
                x2="58.0225"
                y2="26.6115"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#D24089" />
                <stop offset="1" stopColor="#B92D44" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_484_145"
                x1="49.2279"
                y1="0.847458"
                x2="50.9188"
                y2="0.890956"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#84DBC8" />
                <stop offset="1" stopColor="#55AB86" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <Title style={{ color: 'white' }} level={4}>
              Future sales
            </Title>
            <Paragraph style={{ fontSize: '12px', opacity: 0.6 }}>assuming 10% royalty</Paragraph>

            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg
                  style={{
                    marginRight: 4,
                  }}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="5" fill="url(#paint0_linear_484_138)" />
                  <defs>
                    <linearGradient
                      id="paint0_linear_484_138"
                      x1="2.69097"
                      y1="0.671428"
                      x2="9.84914"
                      y2="6.34831"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.0989583" stopColor="#841896" />
                      <stop offset="1" stopColor="#4F1364" />
                    </linearGradient>
                  </defs>
                </svg>
                Seller 90%
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg
                  style={{
                    marginRight: 4,
                  }}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="5" fill="url(#paint0_linear_484_141)" />
                  <defs>
                    <linearGradient
                      id="paint0_linear_484_141"
                      x1="1.80791"
                      y1="0.169492"
                      x2="8.0791"
                      y2="8.72881"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#D24089" />
                      <stop offset="1" stopColor="#B92D44" />
                    </linearGradient>
                  </defs>
                </svg>
                Creator 9.8%
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg
                  style={{
                    marginRight: 4,
                  }}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="5" cy="5" r="5" fill="url(#paint0_linear_484_144)" />
                  <defs>
                    <linearGradient
                      id="paint0_linear_484_144"
                      x1="1.80791"
                      y1="0.169492"
                      x2="8.0791"
                      y2="8.72881"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#84DBC8" />
                      <stop offset="1" stopColor="#55AB86" />
                    </linearGradient>
                  </defs>
                </svg>
                Holaplex 0.2%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
