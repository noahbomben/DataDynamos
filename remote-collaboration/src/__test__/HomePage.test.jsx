import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import HomePage from "../components/HomePage/HomePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { act } from "react";

describe("Tests for HomePage component", () => {
    
    test("HomePage is rendered correctly", async () => {
        render(
            <MemoryRouter initialEntries={["/HomePage"]}>
              <Routes>
                <Route path="/HomePage" element={<HomePage/>} />
              </Routes>
            </MemoryRouter>
        );
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        const createBlock = document.getElementById("Create Project");
        const projectList = document.getElementById("Project List");
        const calendar = document.getElementById("Calendar");

        expect(createBlock).toBeInTheDocument();
        expect(projectList).toBeInTheDocument();
        expect(calendar).toBeInTheDocument();
    });
});