import React from "react";
import { Panel, SectionLabel, Muted } from "./LeftSidebar";

export default function RightSidebar() {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Panel>
        <SectionLabel>Suggestions</SectionLabel>
        <Muted>
          Suggestions for you will appear here
        </Muted>
      </Panel>
    </aside>
  );
}
