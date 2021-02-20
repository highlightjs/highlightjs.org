interface Props {
  timestamp: string | Date;
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const Timestamp = ({ timestamp }: Props) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

  return (
    <time dateTime={date.toISOString()}>
      {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}
    </time>
  );
};

export default Timestamp;
