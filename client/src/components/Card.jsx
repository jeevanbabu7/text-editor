
import { Link } from 'react-router-dom';
const Card = ({ project }) => {
    
  return (
    <Link to={`/project/${project.id}`}>
        
        <a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{project.title}</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">{project.description}</p>
            <p className='text-slate-300'>{project.lastUpdated}</p>
        </a>
    </Link>
  );
};
export default Card;