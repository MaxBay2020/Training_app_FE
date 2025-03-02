import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreditPage from "./CreditPage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import { MemoryRouter } from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import '@testing-library/jest-dom'
import {userEvent} from "@testing-library/user-event";

const renderWithStore = (component) => {
    const store = configureStore({
        reducer: {
            user: userReducer,
        },
    });

    const queryClient = new QueryClient();

    return render(
        <Provider store={store}>
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    {component}
                </QueryClientProvider>
            </MemoryRouter>
        </Provider>
    );
};

/**
 * testing component: CreditPage.js
 */
describe("CreditPage", () => {
    // test if user rendered
    it("should render user information", async () => {
        renderWithStore(<CreditPage />);

        const userName = await screen.findByText(/User Name:/);
        expect(userName).toBeInTheDocument();

        const userRole = await screen.findByText(/User Role:/);
        expect(userRole).toBeInTheDocument();
    });


    // test if the button works
    it("should open and close download menu", async () => {
        renderWithStore(<CreditPage />);

        const downloadButton = screen.getByRole("button", {
            name: /download/i,
        });

        userEvent.click(downloadButton);
        await waitFor(() => screen.getByText("Download Excel"));

        expect(screen.getByText("Download Excel")).toBeInTheDocument();
        expect(screen.getByText("Download PDF")).toBeInTheDocument();

    });


});
