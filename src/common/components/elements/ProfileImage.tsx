import styled from 'styled-components';
import Image from 'next/image';

export const ProfileImage = () => {
  return (
    <ProfileImageWrapper>
      <Image width={40} height={40} src="/images/gradients/gradient-1.png" alt="Profile Image" />
    </ProfileImageWrapper>
  );
};

const ProfileImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 200px;
`;
