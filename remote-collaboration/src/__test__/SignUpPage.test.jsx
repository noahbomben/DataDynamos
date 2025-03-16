import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import SignUpPage from "../components/SignUpPage/SignUpPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { act } from "react";

describe("Tests for SignUpPage component", () => {
    
    test("SignUpPage is rendered correctly", async () => {
        render(
            <MemoryRouter initialEntries={["/SignUpPage"]}>
              <Routes>
                <Route path="/SignUpPage" element={<SignUpPage />} />
              </Routes>
            </MemoryRouter>
        );
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        const signupEmail = document.getElementById("signupEmail");
        const singupPassword = document.getElementById("signupPassword");
        const confirmPassword = document.getElementById("confirmPassword");

        // Checks that email and password input fields are present
        expect(signupEmail).toBeInTheDocument();
        expect(singupPassword).toBeInTheDocument();
        expect(confirmPassword).toBeInTheDocument();
    });
});