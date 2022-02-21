import { Selector, t } from "testcafe";
import { shallow } from "enzyme";

import Page from "../src/components/Page";
import { DateFilter } from "@gooddata/sdk-ui-filters";
import ContentChart from "../src/components/ContentChart";
import SideBar from "../src/components/SideBar";

test("Home should render correctly", async () => {
    await t.expect(Selector(".s-home").exists).ok();
});

const mockSideBar = jest.fn();
jest.mock("./ChildComponent", () => (props) => {
    mockSideBar(props);
    return <mock-sideBarComponent />;
});

test("noData is false", () => {
    render(<SideBar noData={true} />);
    expect(mockSideBar).toHaveBeenCalledWith(
        expect.objectContaining({
            noData: true
        }),
    );
});

test("noData is true", () => {
    render(<SideBar noData={true} />);
    expect(mockSideBar).not.toHaveBeenCalled();
});

describe("Home component", () => {
    it("should render DateFilter", () => {
        const wrapper = shallow(<Page mainClassName="s-home" />);
        expect(wrapper.find(DateFilter).length).toBe(1);
    });
    it("should render ContentChart", () => {
        const wrapper = shallow(<Page mainClassName="s-home" />);
        expect(wrapper.find(ContentChart).length).toBe(1);
    });
    it("should render SideBar", () => {
        const wrapper = shallow(<Page mainClassName="s-home" />);
        expect(wrapper.find(SideBar).length).toBe(1);
    });
});
