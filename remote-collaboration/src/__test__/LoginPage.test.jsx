import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import LoginPage from "../components/LoginPage/LoginPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { act } from "react";

describe("Tests for LoginPage component", () => {
    
    test("LoginPage is rendered correctly", async () => {
        render(
            <MemoryRouter initialEntries={["/LoginPage"]}>
              <Routes>
                <Route path="/LoginPage" element={<LoginPage />} />
              </Routes>
            </MemoryRouter>
        );
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }); 

        const loginEmail = document.getElementById("email");
        const loginPassword = document.getElementById("password");

        // Checks that email and password input fields are present
        expect(loginEmail).toBeInTheDocument();
        expect(loginPassword).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    });
});