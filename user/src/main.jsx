import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ConfigProvider
            theme={{
                components: {
                    Radio: {
                        colorPrimary: "transparent",
                    },
                    DatePicker: {
                        activeBorderColor: "#f97316",
                        hoverBorderColor: "#f97316",
                        activeShadow: "#f97316",
                    },
                    Select: {
                        activeBorderColor: "#f97316",
                        hoverBorderColor: "#f97316",
                        optionSelectedBg: "rgba(249, 115, 22, 0.8)",
                        optionSelectedColor: "#fff",
                    },
                    Breadcrumb: {
                        linkHoverColor: '#f97316',
                    }
                },
            }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ConfigProvider>
    </StrictMode>
);
