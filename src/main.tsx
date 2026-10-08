import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import { Tab, TabList, TabPanel, Tabs, type TabsVariant } from "./index";

const variants: TabsVariant[] = ["pill", "underline"];

const App = () => (
  <main style={{ display: "grid", gap: 48, padding: 24 }}>
    {variants.map((variant) => (
      <section key={variant}>
        <h2 style={{ fontFamily: "Inter, sans-serif" }}>{variant}</h2>
        <Tabs defaultValue="emails" variant={variant}>
          <TabList aria-label="Inbox sections">
            <Tab value="emails">Emails</Tab>
            <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
              Files
            </Tab>
            <Tab value="edits">Edits</Tab>
            <Tab value="dashboard" badge={{ label: "New", variant: "positive" }}>
              Dashboard
            </Tab>
            <Tab value="messages" badge={{ label: "3" }}>
              Messages
            </Tab>
          </TabList>
          <TabPanel value="emails">Emails content</TabPanel>
          <TabPanel value="files">Files content</TabPanel>
          <TabPanel value="edits">Edits content</TabPanel>
          <TabPanel value="dashboard">Dashboard content</TabPanel>
          <TabPanel value="messages">Messages content</TabPanel>
        </Tabs>
      </section>
    ))}
  </main>
);

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
