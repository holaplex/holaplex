import styled from 'styled-components';
import { Button, Dropdown, Space, Menu, Checkbox, Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  DiscoveryToolAction,
  FilterAction,
  FilterOption,
  SortByAction,
  SortByAuctionValues,
  SortingOption,
} from './CurrentListings';
import { FilterValue } from 'antd/lib/table/interface';
import { useState } from 'react';

const StyledDropdownTrigger = styled.div`
  padding: 10px 16px;
  background: #333333;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 25px;
  font-size: 12px;
  cursor: pointer;
  width: 145px;

  > .label {
    color: rgba(255, 255, 255, 0.6);
  }
  > .value {
    color: rgba(255, 255, 255, 1);
  }
  > .anticon.anticon-down {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const StyledSpace = styled(Space)`
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export function DiscoveryFilterDropdown(props: {
  label: string;
  value: string[];
  options: FilterOption[];
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'SHOW_ALL') {
      setDropdownVisible(false);
    }
  };

  const handleVisibleChange = (visible: boolean) => {
    setDropdownVisible(visible);
  };

  return (
    <Dropdown
      onVisibleChange={handleVisibleChange}
      // visible={dropdownVisible} // not needed when radio
      overlay={
        <Menu onClick={handleMenuClick}>
          {/* {props.options.map((o) => (
            <Menu.Item key={o.value}>
              <Checkbox
                style={{
                  width: '100%',
                }}
                checked={props.value.includes(o.value)}
                onChange={() => props.dispatch({ type: 'FILTER', payload: o.value })}
              >
                {o.label}
              </Checkbox>
            </Menu.Item>
          ))} */}
          <Radio.Group
            onChange={(e) => props.dispatch({ type: 'FILTER', payload: e.target.value })}
            value={props.value[0]}
            style={{
              width: '100%',
            }}
          >
            {props.options.map((o) => (
              <Menu.Item key={o.value as string}>
                <Radio
                  style={{
                    fontSize: 12,
                    width: '100%',
                  }}
                  value={o.value}
                >
                  {o.label}
                </Radio>
              </Menu.Item>
            ))}
          </Radio.Group>
        </Menu>
      }
    >
      {/* <Space direction="horizontal" size="small" align="center">
            </Space> */}
      <StyledDropdownTrigger>
        <span className="label">{props.label}:</span>

        <span className="value">
          {props.options
            .filter((o) => props.value.includes(o.value))
            .map((o) => o.label)
            .join(', ')}
        </span>
        <DownOutlined />
      </StyledDropdownTrigger>
    </Dropdown>
  );
}

export function DiscoverySortByDropdown(props: {
  label: string;
  value: string;
  options: SortingOption[];
  onlyBuyNow: boolean;
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  return (
    <Dropdown
      overlay={
        <Menu>
          <Radio.Group
            onChange={(e) => props.dispatch({ type: 'SORT', payload: e.target.value })}
            value={props.value}
            style={{
              width: '100%',
            }}
          >
            {props.options.map((o) => (
              <Menu.Item key={o.value as string}>
                <Radio
                  style={{
                    width: '100%',
                    fontSize: 12,
                  }}
                  value={o.value}
                  disabled={props.onlyBuyNow && SortByAuctionValues.includes(o.value as any)}
                >
                  {o.label}
                </Radio>
              </Menu.Item>
            ))}
          </Radio.Group>
        </Menu>
      }
    >
      {/* <Space direction="horizontal" size="small" align="center">
        </Space> */}
      <StyledDropdownTrigger>
        <span className="label">{props.label}:</span>

        <span className="value">{props.options.find((o) => o.value === props.value)?.label}</span>
        <DownOutlined />
      </StyledDropdownTrigger>
    </Dropdown>
  );
}

export function DiscoveryFiltersAndSortBy(props: {
  filters: FilterAction[];
  sortBy: SortByAction;
  allFilterOptions: FilterOption[];
  allSortByOptions: SortingOption[];
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  const onlyBuyNow = props.filters.length === 1 && props.filters[0] === 'BUY_NOW';
  const filteredSortingOptions = props.allSortByOptions.filter(
    (so) => !(onlyBuyNow && SortByAuctionValues.includes(so.value as any))
  );

  return (
    <StyledSpace direction="horizontal">
      <DiscoveryFilterDropdown
        label="Filter"
        value={props.filters}
        options={props.allFilterOptions}
        dispatch={props.dispatch}
      />
      <DiscoverySortByDropdown
        label="Sort"
        value={props.sortBy}
        options={filteredSortingOptions}
        dispatch={props.dispatch}
        onlyBuyNow={onlyBuyNow}
      />
    </StyledSpace>
  );
}
