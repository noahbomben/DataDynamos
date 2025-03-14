import { render } from "@testing-library/react";
import { describe, expect } from "vitest";
import ProjectView from "../components/ProjectView/ProjectView";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { act } from "react";


describe("ChatBox Component", () => {

        // _id is test data from db, simulate getting to this point
    localStorage.setItem("email", "alex@test.com")
    const Project = {
        users: ["fake@test.com", "notreal@test.com"],
        _id: "67d37a008ef8faa4306a51c6"
    }

    test("renders Project View correctly with state", async () => {
        render(
          <MemoryRouter initialEntries={[{ pathname: "/ProjectView", state: Project }]}>
            <Routes>
              <Route path="/ProjectView" element={<ProjectView />} />
            </Routes>
          </MemoryRouter>
        );
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }); 

        const chatBox = document.getElementById("chat-box");
        const textInput = document.getElementById("text-input");
        const messages = document.getElementsByClassName("msg");

        // ensure chat box and input for texting are there
        expect(chatBox).toBeInTheDocument();
        expect(textInput).toBeInTheDocument();

        // ensure all previously sent messages are here
        Array.from(messages).forEach((message, index) => {
            switch(index) {
                case 0:
                    expect(message).toHaveTextContent("Test Message1");
                    break;
                case 1:
                    expect(message).toHaveTextContent("Test Message2");
                    break;
                case 2:
                    expect(message).toHaveTextContent("Test Message3");       
            }
        });
    });
})