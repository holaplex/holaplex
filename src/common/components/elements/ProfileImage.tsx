import styled from 'styled-components';
import Image from 'next/image';
import { Popover } from 'antd';
import { useRef, useState } from 'react';
import { ButtonReset } from '@/common/styles/ButtonReset';
import { ProfilePopover } from './ProfilePopover';
import { useOutsideAlerter } from '@/common/hooks/useOutsideAlerter';

export const ProfileImage = () => {
  const [isShowingProfilePopover, setIsShowingProfilePopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null!);
  useOutsideAlerter(popoverRef, () => setIsShowingProfilePopover(false));
  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        visible={isShowingProfilePopover}
        content={<ProfilePopover ref={popoverRef} />}
      >
        <ProfileImageWrapper onClick={() => setIsShowingProfilePopover((v) => !v)}>
          <Image
            width={40}
            height={40}
            src="/images/gradients/gradient-3.png"
            alt="Profile Image"
          />
        </ProfileImageWrapper>
      </Popover>
    </>
  );
};

const ProfileImageWrapper = styled.button`
  ${ButtonReset};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 200px;
`;
