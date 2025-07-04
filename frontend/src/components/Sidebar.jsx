import { NavLink } from 'react-router-dom'
import { 
  FaHome, 
  FaRobot, 
  FaShieldAlt, 
  FaCog, 
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa'
import { useAgent } from '../contexts/AgentContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { agents, activeAgent, setActiveAgent } = useAgent()
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FaHome className="w-5 h-5" /> },
    { name: 'Agents', path: '/agent', icon: <FaRobot className="w-5 h-5" /> },
    { name: 'Red Team', path: '/redteam', icon: <FaShieldAlt className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <FaCog className="w-5 h-5" /> }
  ]
  
  return (
    <div className={`bg-dark-800 border-r border-dark-600 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-dark-600">
        {isOpen && <h2 className="text-xl font-bold text-white">Offline AI</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-600 focus:outline-none"
        >
          {isOpen ? <FaChevronLeft className="h-4 w-4" /> : <FaChevronRight className="h-4 w-4" />}
        </button>
      </div>
      
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2 px-2">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center py-2 px-3 rounded-md ${
                    isActive 
                      ? 'bg-primary-700 text-white' 
                      : 'text-gray-400 hover:bg-dark-600 hover:text-white'
                  }`
                }
              >
                {item.icon}
                {isOpen && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {isOpen && (
        <div className="mt-8 px-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Available Agents
          </h3>
          <ul className="mt-2">
            {agents.map((agent) => (
              <li key={agent.id} className="mb-1">
                <button
                  onClick={() => setActiveAgent(agent)}
                  className={`w-full text-left py-2 px-3 rounded-md ${
                    activeAgent.id === agent.id
                      ? 'bg-secondary-700 text-white'
                      : 'text-gray-400 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  {agent.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Sidebar