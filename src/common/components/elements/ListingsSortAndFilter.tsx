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
      visible={dropdownVisible}
      overlay={
        <Menu onClick={handleMenuClick}>
          {props.options.map((o) => (
            <Menu.Item
              key={o.value}
              onClick={(e) => props.dispatch({ type: 'FILTER', payload: o.value })}
            >
              <Checkbox checked={props.value.includes(o.value)}>{o.label}</Checkbox>
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      <StyledDropdownTrigger>
        <Space direction="horizontal" size="small" align="center">
          <span className="label">{props.label}:</span>
          <span className="value">
            {props.options
              .filter((o) => props.value.includes(o.value))
              .map((o) => o.label)
              .join(', ')}
          </span>
          <DownOutlined />
        </Space>
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
          >
            {props.options.map((o) => (
              <Menu.Item
                key={o.value as string}
                disabled={props.onlyBuyNow && SortByAuctionValues.includes(o.value as any)}
              >
                <Radio value={o.value}>{o.label}</Radio>
              </Menu.Item>
            ))}
          </Radio.Group>
        </Menu>
      }
    >
      <StyledDropdownTrigger>
        <Space direction="horizontal" size="small" align="center">
          <span className="label">{props.label}:</span>
          <span className="value">{props.options.find((o) => o.value === props.value)?.label}</span>
          <DownOutlined />
        </Space>
      </StyledDropdownTrigger>
    </Dropdown>
  );
}

// will need to refactor out a separate Filter component
export function DiscoveryRadioDropdown({
  label,
  value,
  action,
  options,
  dispatch,
}: {
  label: string;
  action: 'FILTER' | 'SORT';
  value: string | string[];
  options: (SortingOption | FilterOption)[];
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  return (
    <Dropdown
      overlay={
        <Menu>
          <Radio.Group
            onChange={(e) => dispatch({ type: action, payload: e.target.value })}
            value={value}
          >
            {options.map((o) => (
              <Menu.Item key={o.value as string}>
                <Radio value={o.value}>{o.label}</Radio>
              </Menu.Item>
            ))}
          </Radio.Group>
        </Menu>
      }
    >
      <StyledDropdownTrigger>
        <Space direction="horizontal" size="small" align="center">
          <span className="label">{label}:</span>
          <span className="value">{options.find((o) => o.value === value)?.label}</span>
          <DownOutlined />
        </Space>
      </StyledDropdownTrigger>
    </Dropdown>
  );
}

function SortMenu({
  value,
  dispatch,
  sortingOptions,
}: {
  value: string;
  dispatch: React.Dispatch<DiscoveryToolAction>;
  sortingOptions: SortingOption[];
}) {
  return (
    <Menu>
      <Radio.Group onChange={(e) => dispatch({ type: e.target.value })} value={value}>
        {sortingOptions.map((so) => (
          <Menu.Item key={so.value}>
            <Radio value={so.value}>{so.label}</Radio>
          </Menu.Item>
        ))}
      </Radio.Group>
    </Menu>
  );
}

export function DiscoverySortDropdown({
  sortBy,
  sortingOptions,
  dispatch,
}: {
  sortBy: string;
  sortingOptions: SortingOption[];
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  return (
    <Dropdown
      overlay={<SortMenu value={sortBy} sortingOptions={sortingOptions} dispatch={dispatch} />}
    >
      <StyledDropdownTrigger>
        <Space direction="horizontal" size="small">
          <span className="label">Sort by:</span>
          <span className="value">{sortBy}</span>
          <DownOutlined />
        </Space>
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
    <Space direction="horizontal">
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
    </Space>
  );
}
