import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import CreditTable from './CreditTable';
import '@testing-library/jest-dom'

const mockData = [
    {
        smId: '123',
        smName: 'John Doe',
        ECLASS: 2,
        Webinar: 3,
        LiveTraining: 1,
        credits: 10,
        users: [
            {
                userName: 'Alice',
                userEmail: 'alice@example.com',
                ECLASS: 1,
                LiveTraining: 0,
                Webinar: 2,
            },
        ],
    },
];

/**
 * testing component: CreditTable.js
 */
describe('CreditTable Component', () => {

    // test if data rendered
    it('renders table with data', () => {
        render(<CreditTable creditsStats={mockData} />);

        expect(screen.getByText('Servicer ID')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    // test if the row expands and collapses when clicked
    it('expands and collapses the row when clicking the button', async () => {
        render(<CreditTable creditsStats={mockData} />);

        const toggleButton = screen.getByRole('button', { name: /expand row/i });
        expect(toggleButton).toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(screen.getByText('Alice')).toBeInTheDocument();

        fireEvent.click(toggleButton);
        await waitFor(() => expect(screen.queryByText('Alice')).not.toBeInTheDocument());
    });
});
