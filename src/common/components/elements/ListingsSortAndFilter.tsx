import styled from 'styled-components';
import { Button, Dropdown, Space, Menu, Checkbox, Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DiscoveryToolAction, FilterOption, SortingOption } from './CurrentListings';

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
