interface Props {
  size: number;
  username: string;
}

const API_VERSION = '3';
const AVATAR_URL =
  'https://avatars{host}.githubusercontent.com/{username}?v={version}&s={size}';

function getAvatarUrl(
  username: string,
  size: number = 24,
  host: number = 0,
): string {
  return AVATAR_URL.replace('{host}', '' + host)
    .replace('{size}', '' + size)
    .replace('{username}', '' + username)
    .replace('{version}', API_VERSION);
}

const GitHubAvatar = ({ username, size }: Props) => {
  const avatarUrl = getAvatarUrl(username);
  const increments = [1, 2, 3, 4];
  const srcSets = increments.map(
    (increment) => `${getAvatarUrl(username, size * increment)} ${increment}x`,
  );

  return (
    <a className="flex items-center" href={`https://github.com/${username}`}>
      <img
        alt={username}
        className="rounded-md mr-2"
        height={size}
        src={avatarUrl}
        srcSet={srcSets.join(', ')}
        width={size}
      />
      <span className="text-cyan-300 font-bold">{username}</span>
    </a>
  );
};

export default GitHubAvatar;
