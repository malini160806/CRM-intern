import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: {
    lead: false,
    deal: false,
    contact: false,
    meeting: false,
    case: false,
    solution: false,
    help: false,
    stickyNotes: false,
  },
  helpView: 'menu', // 'menu', 'docs', 'forum'
  breadcrumbOverrides: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const payload = action.payload;
      if (typeof payload === 'string') {
        state.modals[payload] = true;
      } else {
        state.modals[payload.modal] = true;
        if (payload.view) state.helpView = payload.view;
      }
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
      if (action.payload === 'help') state.helpView = 'menu';
    },
    setHelpView: (state, action) => {
      state.helpView = action.payload;
    },
    closeAllModals: (state) => {
      state.modals = initialState.modals;
      state.helpView = 'menu';
    },
    setBreadcrumbOverride: (state, action) => {
      const { id, name } = action.payload;
      if (id && name) {
        if (!state.breadcrumbOverrides) {
          state.breadcrumbOverrides = {};
        }
        state.breadcrumbOverrides[id] = name;
      }
    },
  },
});

export const { openModal, closeModal, closeAllModals, setHelpView, setBreadcrumbOverride } = uiSlice.actions;
export default uiSlice.reducer;
