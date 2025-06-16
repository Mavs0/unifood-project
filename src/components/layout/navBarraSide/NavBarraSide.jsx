import { NavLink } from 'react-router-dom';
import styles from './NavBarraSide.module.css';

// ícones
import { HiOutlineHome } from "react-icons/hi";
import { RiPencilLine, RiCupLine, RiCalendarEventLine } from "react-icons/ri";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { MdOutlineBorderAll } from "react-icons/md";
import { PiListBold } from "react-icons/pi"; // ícone de menu opcional

export default function NavBarraSide() {
  return (
    <div className={styles.navbarraside}>
      <div className={styles.iconeBarra}>
        <PiListBold className={styles.iconMenu} />
      </div>

      <NavLink to="/dashboard" className={({ isActive }) =>
        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
      }>
        <HiOutlineHome className={styles.icon}/>
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/reviews" className={({ isActive }) =>
        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
      }>
        <RiPencilLine className={styles.icon} />
        <span>Reviews</span>
      </NavLink>

      <NavLink to="/comidas" className={({ isActive }) =>
        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
      }>
        <RiCupLine className={styles.icon} />
        <span>Comidas</span>
      </NavLink>

      <NavLink to="/pedidos" className={({ isActive }) =>
        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
      }>
        <HiOutlinePencilAlt className={styles.icon} />
        <span>Pedidos</span>
      </NavLink>

      <NavLink to="/eventos" className={({ isActive }) =>
        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
      }>
        <RiCalendarEventLine className={styles.icon} />
        <span>Eventos</span>
      </NavLink>

      <NavLink to="/meusProdutos" className={({ isActive }) =>
        isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
      }>
        <MdOutlineBorderAll className={styles.icon} />
        <span>Meus Produtos</span>
      </NavLink>
    </div>
  );
}
