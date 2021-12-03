import styled from 'styled-components';
import { Button, Dropdown, Space, Menu, Checkbox, Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DiscoveryToolState, DiscoveryToolAction, SortingOption, FilterOption } from 'pages';

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

export function DiscoveryRadioDropdown({
  label,
  value,
  options,
  dispatch,
}: {
  label: string;
  value: string;
  options: (SortingOption | FilterOption)[];
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  return (
    <Dropdown
      overlay={
        <Menu>
          <Radio.Group onChange={(e) => dispatch({ type: e.target.value })} value={value}>
            {options.map((o) => (
              <Menu.Item key={o.value}>
                <Radio value={o.value}>{o.label}</Radio>
              </Menu.Item>
            ))}
          </Radio.Group>
        </Menu>
      }
    >
      <StyledDropdownTrigger>
        <span className="label">{label}:</span>
        <span className="value">{options.find((o) => o.value === value)?.label}</span>
        <DownOutlined />
      </StyledDropdownTrigger>
    </Dropdown>
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
        <span className="label">Sort by:</span>
        <span className="value">{sortBy}</span>
        <DownOutlined />
      </StyledDropdownTrigger>
    </Dropdown>
  );
}

const StyledDropdownTrigger = styled.div`
  padding: 10px 16px;
  background: #333333;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 25px;
  font-size: 12px;

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

export function ListingsSortAndFilter({
  state,
  dispatch,
  sortingOptions,
  filterOptions,
}: {
  state: DiscoveryToolState;
  dispatch: React.Dispatch<DiscoveryToolAction>;
  sortingOptions: SortingOption[];
  filterOptions: FilterOption[];
}) {
  const { filter, sortBy } = state;
  return (
    <Space direction="horizontal">
      {/* <Dropdown overlay={<FilterMenu value={filters} dispatch={dispatch} />}>
        <StyledButton>
          Filter: {filters.join(', ')} <DownOutlined />
        </StyledButton>
      </Dropdown> */}
      {/* <Dropdown overlay={<FilterMenuRadio value={filter} dispatch={dispatch} />}>
        <StyledButton>
          Filter2: {filters.join(', ')} <DownOutlined />
        </StyledButton>
      </Dropdown> */}
      <DiscoveryRadioDropdown
        label="Filter"
        value={filter}
        options={filterOptions}
        dispatch={dispatch}
      />
      <DiscoveryRadioDropdown
        label="Sort"
        value={sortBy}
        options={sortingOptions}
        dispatch={dispatch}
      />
      {/* <Dropdown
        overlay={<SortMenu value={sortBy} sortingOptions={sortingOptions} dispatch={dispatch} />}
      >
        <StyledDropdownTrigger>
          <span className="label">Sort by:</span>
          <span className="value">{sortBy}</span>
          <DownOutlined />
        </StyledDropdownTrigger>
      </Dropdown> */}
      <style jsx global>{`
        .ant-radio-group.ant-radio-group-outline {
        }
      `}</style>
    </Space>
  );
}
