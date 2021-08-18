import sv from '@/constants/styles'
import styled from 'styled-components'
import { Grid } from 'antd-mobile'
import {Typography} from 'antd'
const {Text} = Typography

type StoreProps = {
  bgColor: string;
}
const Store = styled.a`
  ${sv.flexCenter};
  flex-direction: column;
  transition: all .2s ease;
  padding: ${sv.grid*2}px;
  ${sv.borderRadius};
  margin: ${sv.grid}px;
  background-color: ${({ bgColor }: StoreProps) => bgColor};
  ${sv.shadow};
  cursor: pointer;
  img {
    border-radius: 4px;
  }
  &:hover {
    transform: translate(0, -4px);
    box-shadow: 0 8px 16px rgba(0,0,0,.5);
  }
`;

type StoreNameProps = {
  color: string;
}
const StoreName = styled(Text)`
  width: 100%;
  ${sv.label};
  text-align: center;
  margin-top: ${sv.grid}px;
  color: ${({color}: StoreNameProps) => color};
`;

type StoreGridProps = {
  stores: any
}


const StoresGrid = ({stores}: StoreGridProps) => {

  return (
    <div>
      <Grid
        itemStyle={{ display: 'inline-block' }}
        data={stores}
        columnNum={4}
        renderItem={storefront => {
          return (
            <Store
              bgColor={storefront?.theme?.backgroundColor}
              href={`https://${storefront?.subdomain}.holaplex.com`}
              target="_blank"
              rel="noreferrer"
            >
              <img src={storefront?.theme?.logo?.url} style={{ width: '75px', height: '75px' }} alt="" />
              <StoreName
                ellipsis
                color={storefront?.theme?.primaryColor}
              >
                {storefront?.meta?.title}
              </StoreName>
            </Store>
          )
        }}
      />
    </div>

  )
};

export default StoresGrid;
