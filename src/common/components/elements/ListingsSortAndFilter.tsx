import styled from 'styled-components';
import { Button, Dropdown, Space, Menu, Checkbox, Radio } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DiscoveryToolState, DiscoveryToolAction } from 'pages';

const ColorPreview = styled.div`
  height: 32px;
  width: 85px;
  margin: 0 16px 0 0;
  border-radius: 4px;
  background: ${(props) => props.color};
`;

const ColorSelect = styled.div`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
`;

const StyledButton = styled(Button)`
  background: #333333;
`;

function FilterMenu({
  value,
  dispatch,
}: {
  value: string[];
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  return (
    <Menu>
      <Menu.Item>
        <Checkbox
          checked={value.includes('SHOW_ALL')}
          onChange={() => dispatch({ type: 'RESET_FILTERS' })}
        >
          Show all
        </Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox
          checked={value.includes('ACTIVE_AUCTIONS')}
          onChange={() =>
            dispatch({
              type: value.includes('ACTIVE_AUCTIONS') ? 'REMOVE_FILTER' : 'ADD_FILTER',
              payload: 'ACTIVE_AUCTIONS',
            })
          }
        >
          Active auctions
        </Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox
          checked={value.includes('BUY_NOW')}
          onChange={() =>
            dispatch({
              type: value.includes('BUY_NOW') ? 'REMOVE_FILTER' : 'ADD_FILTER',
              payload: 'BUY_NOW',
            })
          }
        >
          Buy now
        </Checkbox>
      </Menu.Item>
    </Menu>
  );
}

function FilterMenuRadio({
  value,
  dispatch,
}: {
  value: string;
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  function sort(sortBy: string) {
    if (sortBy === 'SHOW_ALL') {
      dispatch({ type: 'RESET_FILTERS' });
    } else if (sortBy === 'ACTIVE_AUCTIONS') {
      dispatch({ type: 'FILTER_BY_ACTIVE_AUCTIONS' });
    } else if (sortBy === 'BUY_NOW') {
      dispatch({ type: 'FILTER_BY_BUY_NOW' });
    }
  }

  return (
    <Menu>
      <Radio.Group onChange={(e) => sort(e.target.value)} value={value}>
        <Menu.Item>
          <Radio value={'SHOW_ALL'}>Show all</Radio>
        </Menu.Item>
        <Menu.Item>
          <Radio value={'ACTIVE_AUCTIONS'}>Active auctions</Radio>
        </Menu.Item>
        <Menu.Item>
          <Radio value={'BUY_NOW'}>Buy now</Radio>
        </Menu.Item>
      </Radio.Group>
    </Menu>
  );
}

function SortMenu({
  value,
  dispatch,
}: {
  value: string;
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  function sort(sortBy: string) {
    if (sortBy === 'ENDING_SOONEST') {
      dispatch({ type: 'SORT_BY_ENDING_SOONEST' });
    } else if (sortBy === 'RECENTLY_LISTED') {
      dispatch({ type: 'SORT_BY_RECENTLY_LISTED' });
    }
  }

  return (
    <Menu>
      <Radio.Group onChange={(e) => sort(e.target.value)} value={value}>
        <Menu.Item>
          <Radio value={'ENDING_SOONEST'}>Ending soonest</Radio>
        </Menu.Item>
        <Menu.Item>
          <Radio value={'RECENTLY_LISTED'}>Recently listed</Radio>
        </Menu.Item>
      </Radio.Group>
    </Menu>
  );
}

export function ListingsSortAndFilter({
  state,
  dispatch,
}: {
  state: DiscoveryToolState;
  dispatch: React.Dispatch<DiscoveryToolAction>;
}) {
  const { filters, filter, sortBy } = state;
  return (
    <Space direction="horizontal">
      <Dropdown overlay={<FilterMenu value={filters} dispatch={dispatch} />}>
        <StyledButton>
          Filter: {filters.join(', ')} <DownOutlined />
        </StyledButton>
      </Dropdown>
      <Dropdown overlay={<FilterMenuRadio value={filter} dispatch={dispatch} />}>
        <StyledButton>
          Filter2: {filters.join(', ')} <DownOutlined />
        </StyledButton>
      </Dropdown>
      <Dropdown overlay={<SortMenu value={sortBy} dispatch={dispatch} />}>
        <Button>
          Sort by: {sortBy} <DownOutlined />
        </Button>
      </Dropdown>
    </Space>
  );
}
