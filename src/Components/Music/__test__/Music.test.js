import React from "react";
import Music from "../index";
import {render, screen} from "@testing-library/react";
import { MusicData } from "../__mock__/data";

test("Music component should be rendered into document", () => {
    render(<Music 
        data = {MusicData}
        select = {() => {}}
        deselect = {() => {}}
        isSelected = {false}
    />);

    const musicImage = screen.getByRole("img");
    const musicTitle = screen.getByText("Bad Habits");
    const musicArtist = screen.getByText("Ed Sheeran");
    const musicButton = screen.getByRole("button");

    expect(musicImage).toBeVisible();
    expect(musicTitle).toHaveClass("music-title");
    expect(musicTitle).toBeVisible();
    expect(musicArtist).toHaveClass("music-artist");
    expect(musicArtist).toBeVisible();
    expect(musicButton).toHaveClass("btn select");
    expect(musicButton).toBeVisible();
});