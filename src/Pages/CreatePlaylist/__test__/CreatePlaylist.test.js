import React from "react";
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import CreatePlaylist from "../index";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { MusicData } from "../__mock__/data";
import * as reactRedux from 'react-redux';
import '@testing-library/jest-dom'

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

describe("Testing redux integration and mock API endpoint", () => {

    const server = setupServer(
        rest.get('https://api.spotify.com/v1/search', (req, res, ctx) => {
            return res(ctx.json({greeting: 'hello there'}))
        }),
    )

    beforeAll(() => {
        server.listen();
        window.matchMedia = (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), 
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })
    });
    
    beforeEach(() => {
        useDispatchMock.mockImplementation(() => () => {});
        useSelectorMock.mockImplementation(selector => selector(mockStore));
    });
    
    afterEach(() => {
        server.resetHandlers();
        useDispatchMock.mockClear();
        useSelectorMock.mockClear();
    });

    afterAll(() => {
        server.close();
    });

    const useSelectorMock = reactRedux.useSelector;
    const useDispatchMock = reactRedux.useDispatch;

    const mockStore = {
        userToken : {
            token: "thisisjustmocktoken",
        },
        musicsData : {
            items: [MusicData],
        },
    };

    it("Added tracks should be rendered on side bar", () => {
        render(
            <BrowserRouter>
                <CreatePlaylist/>
            </BrowserRouter>
        );

        const musicSelectButton = screen.getByText("SELECT");
        userEvent.click(musicSelectButton);

        const sideBar = screen.getByLabelText("right");
        userEvent.click(sideBar);

        expect(screen.getByText("Bad Habits - Ed Sheeran")).toBeVisible();
    });

    it("Intercepting consume API using mock server and tracks should be rendered", () => {
        render(
            <BrowserRouter>
                <CreatePlaylist/>
            </BrowserRouter>
        );

        const searchBar = screen.getByPlaceholderText("Search your musics...");
        userEvent.type(searchBar, "testing[enter]");
        
        const musicImage = screen.getByAltText("Bad Habits");
        const musicTitle = screen.getByText("Bad Habits");
        const musicArtist = screen.getByText("Ed Sheeran");
        const musicButton = screen.getByText("SELECT");

        expect(musicImage).toBeVisible();
        expect(musicTitle).toBeVisible();
        expect(musicArtist).toBeVisible();
        expect(musicButton).toBeVisible();
    });

});