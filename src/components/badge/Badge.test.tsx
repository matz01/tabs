import { render } from "@testing-library/react";
import {Badge} from "./Badge";

describe("Badge", () => {
    it("renders without crashing", () => {
        render(<Badge />)
    })
})