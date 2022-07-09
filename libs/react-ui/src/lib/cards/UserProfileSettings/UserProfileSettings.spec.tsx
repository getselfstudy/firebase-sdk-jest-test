import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Timestamp } from '@firebase/firestore';
import { UserProfileSettings } from './UserProfileSettings';

afterEach(cleanup);

describe('UserProfileSettings', () => {
  it('should render', () => {
    const time = Timestamp.fromDate(new Date());
    // eslint-disable-next-line no-console
    console.log(time);
    const { getByText } = render(<UserProfileSettings />);
    expect(getByText('Your Profile Information')).toBeInTheDocument();
  });
});
