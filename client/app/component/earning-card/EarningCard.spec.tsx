import { render } from '@testing-library/react';

import EarningCard from './EarningCard';

describe('EarningCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EarningCard />);
    expect(baseElement).toBeTruthy();
  });
});
