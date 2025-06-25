import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBarraSide.module.css";
import { HiOutlineHome, HiOutlinePencilAlt } from "react-icons/hi";
import { RiPencilLine, RiCupLine, RiCalendarEventLine } from "react-icons/ri";
import { MdOutlineBorderAll } from "react-icons/md";
import { PiListBold } from "react-icons/pi";
import { FiSun, FiMoon } from "react-icons/fi";

export default function NavBarraSide() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState("vendedor"); // Default temporário

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const links = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <HiOutlineHome />,
      roles: ["vendedor"],
    },
    {
      to: "/reviews",
      label: "Reviews",
      icon: <RiPencilLine />,
      roles: ["cliente", "vendedor"],
    },
    {
      to: "/comidas",
      label: "Comidas",
      icon: <RiCupLine />,
      roles: ["cliente", "vendedor"],
    },
    {
      to: "/pedidos",
      label: "Pedidos",
      icon: <HiOutlinePencilAlt />,
      roles: ["cliente", "vendedor"],
    },
    {
      to: "/meusProdutos",
      label: "Meus Produtos",
      icon: <MdOutlineBorderAll />,
      roles: ["vendedor"],
    },
    // {
    //   to: "/eventos",
    //   label: "Eventos",
    //   icon: <RiCalendarEventLine />,
    //   roles: ["cliente", "vendedor"],
    // },
  ];

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.topBar}>
        <PiListBold className={styles.iconMenu} onClick={toggleSidebar} />
      </div>

      <div className={styles.linksWrapper}>
        {links
          .filter((link) => link.roles.includes(role))
          .map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? `${styles.menuItem} ${styles.active}`
                  : styles.menuItem
              }
            >
              <div className={styles.icon}>{link.icon}</div>
              {!collapsed && <span>{link.label}</span>}
              {collapsed && (
                <span className={styles.tooltip}>{link.label}</span>
              )}
            </NavLink>
          ))}
      </div>

      <div className={styles.bottomControls}>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {darkMode ? <FiSun /> : <FiMoon />}
          {!collapsed && <span>{darkMode ? "Claro" : "Escuro"}</span>}
        </button>
      </div>
    </div>
  );
}
