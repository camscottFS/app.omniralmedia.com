import React, { useEffect, useState } from 'react';
import { UserType } from '../../utils/types/UserType';
import { getGravatarUrl } from '../../utils/getGravatarUrl';

interface AvatarProps {
  user: UserType | null | undefined;
  size: 'small' | 'large';
}

const Avatar: React.FC<AvatarProps> = ({ user, size }) => {
  const [avatar, setAvatar] = useState(null as any);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      const avatarUrl = await getGravatarUrl(user?.email, 64);
      setAvatar(avatarUrl);
    };
    fetchAvatarUrl();
  }, [user])

  return (
    <img
      src={avatar}
      alt={`${user?.firstName} ${user?.lastName}'s avatar`}
      className={
        size === 'small' ? 'w-6 h-6 rounded-full mr-4' : 'w-16 h-16 rounded-full mr-4'
      }
    />
  )
}

export default Avatar;