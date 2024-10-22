import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PagesNames from "../Router/PagesNames";
import "../components/Header.css"; // Import the CSS file for styling

const Header = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const pagesNavigation = [
    { title: "Trang chủ", path: PagesNames.HOMEPAGE },
    { title: "Tour", path: PagesNames.SCHEDULE },
    { title: "Về chúng tôi", path: PagesNames.ABOUT },
    { title: "Liên hệ", path: PagesNames.CONTACT }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleHomepageClick = () => {
    navigate(PagesNames.HOMEPAGE);
  };

  const handleSignUpClick = () => {
    navigate(PagesNames.LOGIN);
  };

  const handleProfileClick = () => {
    navigate(`/user-profile/`); // Navigate to profile page
  };

  return (
    <header>
      <div className={isMobileMenuOpen ? "mx-2 pb-5 md:hidden" : "hidden"}>
        {/* BrandLogo Component */}
      </div>
      <nav className={`md:text-sm bg-gray-900 ${isMobileMenuOpen ? "absolute z-20 top-0 inset-x-0 bg-gray-800 rounded-xl mx-2 mt-2 md:mx-0 md:mt-0 md:relative md:bg-transparent" : ""}`}>
        <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
          {/* BrandLogo */}
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
                {user ? (
                  <div className="flex items-center">
                    <button className="username-plate" onClick={handleProfileClick}>
                      Xin chào, {user.fullname}
                    </button>
                    <button onClick={onLogout} className="ml-2 flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-orange-500 hover:bg-orange-400 active:bg-orange-600 duration-150 rounded-full">
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <button onClick={handleSignUpClick} className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-orange-500 hover:bg-orange-400 active:bg-orange-600 duration-150 rounded-full">
                    Đăng nhập
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
