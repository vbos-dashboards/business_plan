import { NavLink } from 'react-router-dom'
import { VBOS_SECTIONS } from '../sections'

/** Horizontal department strip (1601–1612, no 1604) — matches VBoS org list */
export function DepartmentNav() {
  return (
    <div className="dept-nav-wrap">
      <nav className="dept-nav" aria-label="Departments">
        {VBOS_SECTIONS.map((s) => (
          <NavLink
            key={s.id}
            to={`/section/${s.id}`}
            className={({ isActive }) =>
              `dept-nav-link${isActive ? ' dept-nav-link--active' : ''}`
            }
            aria-label={`${s.name} (${s.id})`}
          >
            {s.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
