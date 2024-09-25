import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PagesNames from "../Router/PagesNames";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate();

    const pagesNavigation = [
        { title: "Home", path: `${PagesNames.HOMEPAGE}` },
        { title: "Schedule", path: `${PagesNames.SCHEDULE}` },
        { title: "About", path: `${PagesNames.ABOUT}` },
        { title: "Contact", path: `${PagesNames.CONTACT}` }
    ]

    const handleNavigation = (path) => {
        navigate(path);
    };

    useEffect(() => {
        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) {
                setIsMobileMenuOpen(false);
            }
        };
    }, [])

    const handleHomepageClick = () => {
        navigate(PagesNames.HOMEPAGE);
    }

    const handleSignUpClick = () => {
        navigate(PagesNames.REGISTRATION);
    }

    const BrandLogo = () => (
        <div className="flex items-center justify-between py-2 md:block">
            <button onClick={() => handleHomepageClick()} className="h-[96px] w-[96px]">
                <img src="/images/Logo3.png" alt="VietTourLogo" />
            </button>
            <div className="md:hidden">
                <button className="menu-btn text-gray-400 hover:text-gray-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    )

    return (
            <header>
                <div className={`md:hidden ${isMobileMenuOpen ? "mx-2 pb-5" : "hidden"}`}>
                    <BrandLogo />
                </div>
                <nav className={` md:text-sm bg-gray-900 ${isMobileMenuOpen ? "absolute z-20 top-0 inset-x-0 bg-gray-800 rounded-xl mx-2 mt-2 md:mx-0 md:mt-0 md:relative md:bg-transparent" : ""}`}>
                    <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
                        <BrandLogo />
                        <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                            <ul className="flex-1 justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                                {pagesNavigation.map((item, index) => (
                                    <li key={index} className="text-gray-300 hover:text-gray-400">
                                        <button onClick={() => handleNavigation(item.path)} className="block">
                                            {item.title}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button onClick={() => handleSignUpClick()} className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-orange-500 hover:bg-orange-400 active:bg-orange-600 duration-150 rounded-full md:inline-flex">
                                        Sign Up
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
    )
}

export default Header;