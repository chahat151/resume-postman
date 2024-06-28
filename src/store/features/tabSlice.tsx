import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TabsType } from "types";

interface state {
  tabsInfo: TabsType[];
  tabIndex: number;
  autoSaveMode: boolean;
  editMode: boolean;
}

const initialState: state = {
  tabsInfo: [
    {
      name: "Email",
      logo: "IoIosMail",
      logoType: "io",
      content: `Hi {userName},
It's great connecting with you. How have you been?
I found a job opportunity at {companyName} which perfectly overlaps with my skillset and wanted to check if you could provide me with a refferal for the same.
Here is the job link:
{jobLink}
Here is a link to my resume:
Looking forward to hearing back from you, thank you for your time and consideration.
Best Regards,
{senderName}`,
    },
    {
      name: "Cover Letter",
      logo: "TiDocumentText",
      logoType: "ti",
      content: "Cover Letter",
    },
    {
      name: "Introduction",
      logo: "BsFilePerson",
      logoType: "io",
      content: "Introduction",
    },
    { name: "Profile", logo: "ImProfile", logoType: "io", content: "Profile" },
  ],
  tabIndex: 0,
  autoSaveMode: false,
  editMode: false,
};

export const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.tabsInfo[state.tabIndex].content = action.payload;
    },
    changeAutoSaveMode: (state) => {;
      state.autoSaveMode = !state.autoSaveMode;
    },
    reset: () => {
      return initialState;
    },
    turnOnEditMode: (state) => {
      state.editMode = true
    },
    turnOffEditMode: (state) => {
      state.editMode = false
    },
  },
});

export const {
  setTabIndex,
  setContent,
  changeAutoSaveMode,
  reset,
  turnOnEditMode,
  turnOffEditMode,
} = tabSlice.actions;

export default tabSlice.reducer;
