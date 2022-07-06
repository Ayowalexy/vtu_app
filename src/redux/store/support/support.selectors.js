import { createSelector } from "reselect";

export const selectSupport = state => state.support

export const selectTickets = createSelector(
    [selectSupport],
    (support) => support.tickets
)