-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 19, 2024 at 04:34 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlytour`
--

-- --------------------------------------------------------

--
-- Table structure for table `chitietlichtrinh`
--

CREATE TABLE `chitietlichtrinh` (
  `ID` int(11) NOT NULL,
  `NGAY` date NOT NULL,
  `SUKIEN` varchar(255) DEFAULT NULL,
  `MOTA` text DEFAULT NULL,
  `GIO` time DEFAULT NULL,
  `ID_LICH_TRINH` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `chitietlichtrinh`
--

INSERT INTO `chitietlichtrinh` (`ID`, `NGAY`, `SUKIEN`, `MOTA`, `GIO`, `ID_LICH_TRINH`) VALUES
(4, '2024-09-20', 'Lên xe', 'Lên xe đi đà lạt', '22:05:00', 3),
(5, '2024-09-20', 'Ăn tối', 'Ăn tối tại nhà hàng bảy xạy', '21:05:00', 3),
(6, '2024-09-22', 'đi về', 'Đi về tphcm', '12:11:00', 3);

-- --------------------------------------------------------

--
-- Table structure for table `danhgia`
--

CREATE TABLE `danhgia` (
  `ID` int(11) NOT NULL,
  `NOIDUNG` text DEFAULT NULL,
  `SOSAO` int(11) DEFAULT NULL,
  `IDNGUOIDUNG` int(11) DEFAULT NULL,
  `IDTOUR` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lichtrinh`
--

CREATE TABLE `lichtrinh` (
  `ID` int(11) NOT NULL,
  `NGAYDI` date NOT NULL,
  `NGAYVE` date NOT NULL,
  `tenlichtrinh` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `lichtrinh`
--

INSERT INTO `lichtrinh` (`ID`, `NGAYDI`, `NGAYVE`, `tenlichtrinh`) VALUES
(3, '2024-09-20', '2024-09-22', 'Đà Lạt - Nha Trang 2');

-- --------------------------------------------------------

--
-- Table structure for table `magiamgia`
--

CREATE TABLE `magiamgia` (
  `IDMAGIAMGIA` int(11) NOT NULL,
  `TENMGG` varchar(100) DEFAULT NULL,
  `NGAYAPDUNG` date DEFAULT NULL,
  `NGAYHETHAN` date DEFAULT NULL,
  `DIEUKIEN` varchar(255) DEFAULT NULL,
  `TILECHIETKHAU` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tour`
--

CREATE TABLE `tour` (
  `ID` int(11) NOT NULL,
  `TENTOUR` varchar(255) DEFAULT NULL,
  `LOAITOUR` varchar(100) DEFAULT NULL,
  `GIA` decimal(15,2) DEFAULT NULL,
  `SOVE` int(11) DEFAULT NULL,
  `HINHANH` varchar(255) DEFAULT NULL,
  `MOTA` text DEFAULT NULL,
  `TRANGTHAI` varchar(50) DEFAULT NULL,
  `IDLICHTRINH` int(11) DEFAULT NULL,
  `IDDANHGIA` int(11) DEFAULT NULL,
  `PHUONGTIENDICHUYEN` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tour`
--

INSERT INTO `tour` (`ID`, `TENTOUR`, `LOAITOUR`, `GIA`, `SOVE`, `HINHANH`, `MOTA`, `TRANGTHAI`, `IDLICHTRINH`, `IDDANHGIA`, `PHUONGTIENDICHUYEN`) VALUES
(0, 'Tour Đà Lạt - Nha Trang', 'Tour thường', 1000000.00, 200, 'src/img/tourImage/1726756261268.jpg', 'Tour du lịch đà lạt', 'Còn vé', 3, NULL, 'Máy bay');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `ID` int(11) NOT NULL,
  `FULLNAME` varchar(300) DEFAULT NULL,
  `PHONENUMBER` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(100) DEFAULT NULL,
  `ADDRESS` varchar(300) DEFAULT NULL,
  `DAYOFBIRTH` date DEFAULT NULL,
  `ACCOUNTNAME` varchar(30) DEFAULT NULL,
  `PASSWORD` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`ID`, `FULLNAME`, `PHONENUMBER`, `EMAIL`, `ADDRESS`, `DAYOFBIRTH`, `ACCOUNTNAME`, `PASSWORD`) VALUES
(1, 'Nguyễn Văn Admin', '0983640126', 'admin@gmail.com', '828 sư vạn hạnh, TPHCM', '2004-08-02', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `ve`
--

CREATE TABLE `ve` (
  `ID` int(11) NOT NULL,
  `NGAYDAT` date DEFAULT NULL,
  `SOVE` int(11) DEFAULT NULL,
  `LOAIVE` varchar(100) DEFAULT NULL,
  `TINHTRANG` varchar(50) DEFAULT NULL,
  `TONGTIEN` decimal(15,2) DEFAULT NULL,
  `PHUONGTHUCTHANHTOAN` varchar(100) DEFAULT NULL,
  `IDMAGIAMGIA` int(11) DEFAULT NULL,
  `IDNGUOIDUNG` int(11) DEFAULT NULL,
  `IDTOUR` int(11) DEFAULT NULL,
  `GHICHU` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chitietlichtrinh`
--
ALTER TABLE `chitietlichtrinh`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_lichtrinhto_chitiet` (`ID_LICH_TRINH`);

--
-- Indexes for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDTOUR` (`IDTOUR`);

--
-- Indexes for table `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `magiamgia`
--
ALTER TABLE `magiamgia`
  ADD PRIMARY KEY (`IDMAGIAMGIA`);

--
-- Indexes for table `tour`
--
ALTER TABLE `tour`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `ve`
--
ALTER TABLE `ve`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IDMAGIAMGIA` (`IDMAGIAMGIA`),
  ADD KEY `IDTOUR` (`IDTOUR`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chitietlichtrinh`
--
ALTER TABLE `chitietlichtrinh`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `lichtrinh`
--
ALTER TABLE `lichtrinh`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chitietlichtrinh`
--
ALTER TABLE `chitietlichtrinh`
  ADD CONSTRAINT `fk_lichtrinhto_chitiet` FOREIGN KEY (`ID_LICH_TRINH`) REFERENCES `lichtrinh` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `danhgia_ibfk_1` FOREIGN KEY (`IDTOUR`) REFERENCES `tour` (`ID`);

--
-- Constraints for table `ve`
--
ALTER TABLE `ve`
  ADD CONSTRAINT `ve_ibfk_1` FOREIGN KEY (`IDMAGIAMGIA`) REFERENCES `magiamgia` (`IDMAGIAMGIA`),
  ADD CONSTRAINT `ve_ibfk_2` FOREIGN KEY (`IDTOUR`) REFERENCES `tour` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
