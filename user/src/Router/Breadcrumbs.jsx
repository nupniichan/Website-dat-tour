import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

// Utility function to capitalize each word in a string
const capitalizeWords = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    // Hide Breadcrumbs on home route
    if (location.pathname === "/") {
        return null;
    }

    // Breadcrumb items array
    const breadcrumbItems = [
        {
            title: (
                <Link to="/">
                    <HomeOutlined className="mr-1" /> Home
                </Link>
            ),
        },
        ...pathnames.map((name, index) => {
            const path = `/${pathnames.slice(0, index + 1).join("/")}`;
            // Decode the name and replace dashes with spaces
            const formattedName = decodeURIComponent(name.replace(/-/g, ' '));
            // Capitalize each word in the formatted name
            const capitalizedName = capitalizeWords(formattedName);
            return {
                title: (
                    <Link to={path}>
                        {capitalizedName}
                    </Link>
                ),
            };
        }),
    ];

    return (
        <Breadcrumb
            className="my-9 mt-6 lg:ml-16 sm:ml-14"
            separator=">"
            items={breadcrumbItems}
        />
    );
};

export default Breadcrumbs;