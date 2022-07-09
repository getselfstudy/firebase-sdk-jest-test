import { Timestamp } from '@firebase/firestore';

export function UserProfileSettings() {
  const time = Timestamp.fromDate(new Date());
  return <div>{time.toString()}</div>;
}
