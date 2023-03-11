import React, { useState } from 'react';
import axios from 'axios';
import RepoList from './components/RepoList';
import 'react-dropdown/style.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export interface Users {
  id : number,
  login : string
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.github.com/search/users?q=${searchTerm}`);
      const items = response.data.items.slice(0, 5);
      setUsers(items);
      setSelectedUser("");
    } catch (error) {
      console.log("Error occurred while searching users: ", error);
    }
  };

  const handleUserClick = async (username: string) => {
    try {
      setSelectedUser((prevUser: string) => prevUser === username ? "" : username);
    } catch (error) {
      console.log("Error occurred while handling user click: ", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-2">
        <input
          type="text"
          placeholder="Search for a GitHub user"
          className="p-2 rounded-l border-t border-b border-l text-gray-800 w-full bg-gray-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-400 text-white px-4 rounded-r border-t border-b border-r w-full h-10 mt-4"
        >
          Search
        </button>
      </form>
      {users.length === 0 && (
        <p>User Not Found.</p>
      )}
      {users.length > 0 && (
        <div>
          <p className='mb-4'>Showing Users for "{searchTerm}"</p>
          <ul className="w-full">
            {users.map((user) => (
            <div key={user.id} className="relative mb-3 ">
            <button
              className="flex items-center justify-between w-full px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onClick={() => handleUserClick(user.login)}
            >
              {user.login}
              {selectedUser === user.login ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </button>
          
            {selectedUser === user.login && <RepoList username={selectedUser} />}
          </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
